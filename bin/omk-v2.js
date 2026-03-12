#!/usr/bin/env node

import { Command } from 'commander';
import { setup, doctor } from '../dist/cli/commands-v2.js';

const program = new Command();

program
  .name('omk')
  .description('Oh My Kiro v2 - Multi-agent orchestration for Kiro CLI')
  .version('2.0.0');

program
  .command('setup')
  .description('Install Oh My Kiro v2 (agents, prompts, steering)')
  .option('--local', 'Install to project .kiro/ instead of global ~/.kiro/')
  .option('--force', 'Overwrite existing files')
  .option('--agents-only', 'Install agents only')
  .option('--prompts-only', 'Install prompts only')
  .option('--steering-only', 'Install steering only')
  .action(setup);

program
  .command('doctor')
  .description('Verify Oh My Kiro v2 installation')
  .action(doctor);

program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log('Oh My Kiro v2.0.0');
    console.log('Multi-agent orchestration for Kiro CLI');
    console.log('');
    console.log('Features:');
    console.log('  - 8 specialized agents');
    console.log('  - Ralph loop verification');
    console.log('  - 4 workflow skills');
    console.log('  - Kiro native patterns');
  });

program.parse();
