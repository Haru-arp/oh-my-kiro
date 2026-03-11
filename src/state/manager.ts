import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export interface ModeState {
  mode: string;
  active: boolean;
  started_at: string;
  completed_at?: string;
  data: Record<string, any>;
}

export class StateManager {
  private stateDir: string;

  constructor(workingDir: string = process.cwd()) {
    this.stateDir = join(workingDir, '.omk', 'state');
    if (!existsSync(this.stateDir)) {
      mkdirSync(this.stateDir, { recursive: true });
    }
  }

  private getStatePath(mode: string): string {
    return join(this.stateDir, `${mode}.json`);
  }

  loadState(mode: string): ModeState | null {
    const path = this.getStatePath(mode);
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf-8'));
  }

  saveState(mode: string, state: ModeState): void {
    const path = this.getStatePath(mode);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(state, null, 2));
  }

  startMode(mode: string, data: Record<string, any> = {}): ModeState {
    const state: ModeState = {
      mode,
      active: true,
      started_at: new Date().toISOString(),
      data
    };
    this.saveState(mode, state);
    return state;
  }

  updateMode(mode: string, data: Partial<Record<string, any>>): void {
    const state = this.loadState(mode);
    if (!state) throw new Error(`No active state for mode: ${mode}`);
    
    state.data = { ...state.data, ...data };
    this.saveState(mode, state);
  }

  completeMode(mode: string): void {
    const state = this.loadState(mode);
    if (!state) return;
    
    state.active = false;
    state.completed_at = new Date().toISOString();
    this.saveState(mode, state);
  }

  getActiveModes(): ModeState[] {
    const modes = ['team', 'ralph', 'autopilot', 'ultrawork'];
    return modes
      .map(m => this.loadState(m))
      .filter((s): s is ModeState => s !== null && s.active);
  }
}
