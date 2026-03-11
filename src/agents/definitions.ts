export type AgentComplexity = 'low' | 'medium' | 'high';

export interface AgentDefinition {
  name: string;
  complexity: AgentComplexity;
  focus: string;
  description: string;
  prompt?: string;
  model?: string;
  allowedTools?: string[];
  resources?: string[];
}

export const DEFAULT_AGENTS: Record<string, AgentDefinition> = {
  architect: {
    name: 'architect',
    complexity: 'high',
    focus: 'analysis and design',
    description: 'High-level system analysis, architecture decisions, and design tradeoffs'
  },
  planner: {
    name: 'planner',
    complexity: 'medium',
    focus: 'planning and sequencing',
    description: 'Task breakdown, dependency analysis, and execution planning'
  },
  executor: {
    name: 'executor',
    complexity: 'medium',
    focus: 'implementation',
    description: 'Code implementation, refactoring, and feature development'
  },
  debugger: {
    name: 'debugger',
    complexity: 'medium',
    focus: 'debugging',
    description: 'Root cause analysis, error investigation, and bug fixing'
  },
  verifier: {
    name: 'verifier',
    complexity: 'low',
    focus: 'verification',
    description: 'Testing, validation, and completion evidence collection'
  },
  'test-engineer': {
    name: 'test-engineer',
    complexity: 'medium',
    focus: 'testing',
    description: 'Test design, implementation, and coverage analysis'
  },
  'security-reviewer': {
    name: 'security-reviewer',
    complexity: 'high',
    focus: 'security',
    description: 'Security audit, vulnerability analysis, and best practices'
  },
  explore: {
    name: 'explore',
    complexity: 'low',
    focus: 'exploration',
    description: 'Fast codebase search, mapping, and discovery'
  },
  writer: {
    name: 'writer',
    complexity: 'low',
    focus: 'documentation',
    description: 'Documentation, README, and technical writing'
  }
};

export function getAgentDefinition(name: string, customAgents?: Record<string, Partial<AgentDefinition>>): AgentDefinition {
  const agents = { ...DEFAULT_AGENTS };
  
  if (customAgents && customAgents[name]) {
    agents[name] = { ...agents[name], ...customAgents[name] } as AgentDefinition;
  }
  
  return agents[name] || {
    name,
    complexity: 'medium',
    focus: 'general',
    description: `Custom agent: ${name}`
  };
}

export function listAgents(customAgents?: Record<string, Partial<AgentDefinition>>): AgentDefinition[] {
  const agents = { ...DEFAULT_AGENTS };
  
  if (customAgents) {
    Object.keys(customAgents).forEach(key => {
      agents[key] = { ...agents[key], ...customAgents[key] } as AgentDefinition;
    });
  }
  
  return Object.values(agents);
}
