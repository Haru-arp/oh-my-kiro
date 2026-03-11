#!/usr/bin/env node

import { Command } from 'commander';
import { setup, doctor, listAgentsCommand, statusCommand, cancelCommand, addSkill, listSkills, updateCommand } from '../dist/cli/commands.js';
import { TeamOrchestrator } from '../dist/team/orchestrator.js';

const program = new Command();

program
  .name('omk')
  .description('Oh My Kiro - Multi-agent orchestration for Kiro CLI')
  .version('0.1.0');

program
  .command('setup')
  .description('Install skills, prompts, and AGENTS.md')
  .option('--force', 'Overwrite existing files')
  .option('--scope <scope>', 'Installation scope: user or project', 'project')
  .action(setup);

program
  .command('doctor')
  .description('Verify installation and configuration')
  .action(doctor);

program
  .command('agents')
  .description('List available agent roles')
  .action(listAgentsCommand);

program
  .command('add-skill <repo-url>')
  .description('Install skill from GitHub repository')
  .option('--skill <name>', 'Install specific skill from repository')
  .option('--local', 'Install to project (.omk/skills/) instead of global (~/.kiro/skills/)')
  .option('--force', 'Overwrite existing skill')
  .action(addSkill);

program
  .command('list-skills')
  .description('List installed skills (global and local)')
  .action(listSkills);

program
  .command('update')
  .description('Update Oh My Kiro to latest version')
  .option('--force', 'Force update even if already latest')
  .action(updateCommand);

program
  .command('team <spec> <task>')
  .description('Start team orchestration (e.g., "3:executor fix all bugs")')
  .option('--phase <phase>', 'Start at specific phase')
  .option('--model <model>', 'Model to use for workers (e.g., claude-sonnet-4-20250514)')
  .action(async (spec, task, options) => {
    const orchestrator = new TeamOrchestrator();
    await orchestrator.start(spec, task, options);
  });

program
  .command('team-status')
  .description('Show active team status')
  .action(async () => {
    const orchestrator = new TeamOrchestrator();
    await orchestrator.status();
  });

program
  .command('team-shutdown')
  .description('Shutdown active team')
  .option('--reason <reason>', 'Shutdown reason')
  .action(async (options) => {
    const orchestrator = new TeamOrchestrator();
    await orchestrator.shutdown(options.reason);
  });

program
  .command('status')
  .description('Show all active modes')
  .action(statusCommand);

program
  .command('cancel [mode]')
  .description('Cancel active mode(s)')
  .action(cancelCommand);

program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log('Oh My Kiro v0.1.0');
    console.log('Multi-agent orchestration for Kiro CLI');
  });

program
  .command('help')
  .description('Show help message')
  .action(() => {
    program.help();
  });

program.parse();
