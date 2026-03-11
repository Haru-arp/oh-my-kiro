import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export type TeamPhase = 'team-plan' | 'team-prd' | 'team-exec' | 'team-verify' | 'team-fix';
export type TerminalPhase = 'complete' | 'failed' | 'cancelled';

export interface TeamTask {
  id: string;
  role: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done' | 'failed';
  assigned_to?: number;
  result?: string;
}

export interface TeamState {
  active: boolean;
  phase: TeamPhase | TerminalPhase;
  task_description: string;
  created_at: string;
  phase_transitions: Array<{
    from: string;
    to: string;
    at: string;
    reason?: string;
  }>;
  tasks: TeamTask[];
  max_fix_attempts: number;
  current_fix_attempt: number;
  workers: Array<{
    id: number;
    role: string;
    status: 'idle' | 'working' | 'done' | 'failed';
    model?: string;
  }>;
}

const TRANSITIONS: Record<TeamPhase, (TeamPhase | TerminalPhase)[]> = {
  'team-plan': ['team-prd'],
  'team-prd': ['team-exec'],
  'team-exec': ['team-verify'],
  'team-verify': ['team-fix', 'complete', 'failed'],
  'team-fix': ['team-exec', 'team-verify', 'complete', 'failed']
};

export function isValidTransition(from: TeamPhase, to: TeamPhase | TerminalPhase): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalPhase(phase: TeamPhase | TerminalPhase): phase is TerminalPhase {
  return ['complete', 'failed', 'cancelled'].includes(phase);
}

export function createTeamState(taskDescription: string, workers: number, role: string, model?: string, maxFixAttempts = 3): TeamState {
  return {
    active: true,
    phase: 'team-plan',
    task_description: taskDescription,
    created_at: new Date().toISOString(),
    phase_transitions: [],
    tasks: [],
    max_fix_attempts: maxFixAttempts,
    current_fix_attempt: 0,
    workers: Array.from({ length: workers }, (_, i) => ({
      id: i + 1,
      role,
      status: 'idle',
      model
    }))
  };
}

export function transitionPhase(
  state: TeamState,
  to: TeamPhase | TerminalPhase,
  reason?: string
): TeamState {
  const from = state.phase as TeamPhase;
  
  if (isTerminalPhase(from)) {
    throw new Error(`Cannot transition from terminal phase: ${from}`);
  }
  
  if (!isValidTransition(from, to)) {
    throw new Error(`Invalid transition: ${from} -> ${to}`);
  }

  const nextFixAttempt = to === 'team-fix' ? state.current_fix_attempt + 1 : state.current_fix_attempt;
  
  if (to === 'team-fix' && nextFixAttempt > state.max_fix_attempts) {
    return {
      ...state,
      phase: 'failed',
      active: false,
      phase_transitions: [
        ...state.phase_transitions,
        {
          from,
          to: 'failed',
          at: new Date().toISOString(),
          reason: `Fix loop limit reached (${state.max_fix_attempts})`
        }
      ]
    };
  }

  const isTerminal = isTerminalPhase(to);
  
  return {
    ...state,
    phase: to,
    active: !isTerminal,
    current_fix_attempt: nextFixAttempt,
    phase_transitions: [
      ...state.phase_transitions,
      { from, to, at: new Date().toISOString(), reason }
    ]
  };
}

export function getPhaseAgents(phase: TeamPhase): string[] {
  switch (phase) {
    case 'team-plan': return ['planner', 'architect'];
    case 'team-prd': return ['planner', 'architect'];
    case 'team-exec': return ['executor', 'test-engineer'];
    case 'team-verify': return ['verifier', 'security-reviewer'];
    case 'team-fix': return ['debugger', 'executor'];
  }
}

export function getPhaseInstructions(phase: TeamPhase): string {
  switch (phase) {
    case 'team-plan':
      return 'PHASE: Planning. Break down task into subtasks with dependencies.';
    case 'team-prd':
      return 'PHASE: Requirements. Define explicit scope and success criteria.';
    case 'team-exec':
      return 'PHASE: Execution. Implement features with tests.';
    case 'team-verify':
      return 'PHASE: Verification. Validate implementation with evidence.';
    case 'team-fix':
      return 'PHASE: Fixing. Debug and fix issues, then re-verify.';
  }
}

export class TeamOrchestrator {
  private statePath: string;

  constructor(workingDir: string = process.cwd()) {
    const stateDir = join(workingDir, '.omk', 'state');
    if (!existsSync(stateDir)) {
      mkdirSync(stateDir, { recursive: true });
    }
    this.statePath = join(stateDir, 'team.json');
  }

  loadState(): TeamState | null {
    if (!existsSync(this.statePath)) return null;
    return JSON.parse(readFileSync(this.statePath, 'utf-8'));
  }

  saveState(state: TeamState): void {
    mkdirSync(dirname(this.statePath), { recursive: true });
    writeFileSync(this.statePath, JSON.stringify(state, null, 2));
  }

  async start(spec: string, task: string, options: { phase?: TeamPhase; model?: string } = {}): Promise<void> {
    const [countStr, role] = spec.split(':');
    const count = parseInt(countStr, 10);

    if (isNaN(count) || count < 1 || count > 6) {
      throw new Error('Worker count must be 1-6');
    }

    const state = createTeamState(task, count, role || 'executor', options.model);
    if (options.phase) {
      state.phase = options.phase;
    }

    this.saveState(state);

    console.log(`🚀 Team started: ${count} ${role}(s)`);
    console.log(`📋 Task: ${task}`);
    console.log(`📍 Phase: ${state.phase}`);
    if (options.model) {
      console.log(`🤖 Model: ${options.model}`);
    }
    console.log(`\n💡 Use in Kiro session:`);
    console.log(`   $team ${spec} "${task}"`);
    console.log(`\n📊 State: .omk/state/team.json`);
  }

  async status(): Promise<void> {
    const state = this.loadState();
    
    if (!state) {
      console.log('ℹ️  No active team');
      return;
    }

    console.log(`\n📊 Team Status`);
    console.log(`${'='.repeat(50)}`);
    console.log(`Phase: ${state.phase}`);
    console.log(`Active: ${state.active ? 'Yes' : 'No'}`);
    console.log(`Task: ${state.task_description}`);
    console.log(`Created: ${new Date(state.created_at).toLocaleString()}`);
    console.log(`Fix attempts: ${state.current_fix_attempt}/${state.max_fix_attempts}`);
    
    console.log(`\nWorkers:`);
    state.workers.forEach(w => {
      const icon = w.status === 'done' ? '✓' : w.status === 'working' ? '⟳' : '○';
      const modelInfo = w.model ? ` [${w.model}]` : '';
      console.log(`  ${icon} Worker ${w.id} (${w.role}${modelInfo}): ${w.status}`);
    });

    if (state.tasks.length > 0) {
      console.log(`\nTasks:`);
      state.tasks.forEach(t => {
        const icon = t.status === 'done' ? '✓' : t.status === 'in_progress' ? '⟳' : '○';
        console.log(`  ${icon} ${t.description} [${t.status}]`);
      });
    }

    if (state.phase_transitions.length > 0) {
      console.log(`\nPhase History:`);
      state.phase_transitions.forEach(t => {
        console.log(`  ${t.from} → ${t.to} (${new Date(t.at).toLocaleTimeString()})`);
      });
    }
  }

  async shutdown(reason?: string): Promise<void> {
    const state = this.loadState();
    
    if (!state) {
      console.log('ℹ️  No active team to shutdown');
      return;
    }

    const updatedState = {
      ...state,
      active: false,
      phase: 'cancelled' as TerminalPhase,
      phase_transitions: [
        ...state.phase_transitions,
        {
          from: state.phase,
          to: 'cancelled',
          at: new Date().toISOString(),
          reason: reason || 'Manual shutdown'
        }
      ]
    };

    this.saveState(updatedState);
    console.log('✓ Team shutdown complete');
  }
}
