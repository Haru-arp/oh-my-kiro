#!/usr/bin/env node

import { Command } from 'commander';
import { setup, doctor, uninstall } from '../dist/cli/commands.js';

const program = new Command();

program
  .name('omk')
  .description('Oh My Kiro v2 - Kiro CLI를 위한 멀티 에이전트 오케스트레이션')
  .version('2.0.0');

program
  .command('setup')
  .description('Oh My Kiro v2 설치 (에이전트, 프롬프트, steering)')
  .option('--local', '글로벌 대신 프로젝트 .kiro/에 설치')
  .option('--force', '기존 파일 덮어쓰기')
  .option('--agents-only', '에이전트만 설치')
  .option('--prompts-only', '프롬프트만 설치')
  .option('--steering-only', 'Steering만 설치')
  .action(setup);

program
  .command('uninstall')
  .description('Oh My Kiro v2 제거')
  .option('--local', '로컬 설치 제거 (기본: 글로벌)')
  .option('--keep-mcp', 'MCP 서버 유지')
  .action(uninstall);

program
  .command('doctor')
  .description('Oh My Kiro v2 설치 확인')
  .action(doctor);

program
  .command('version')
  .description('버전 정보 표시')
  .action(() => {
    console.log('Oh My Kiro v2.1.0');
    console.log('Kiro CLI를 위한 멀티 에이전트 오케스트레이션');
    console.log('');
    console.log('기능:');
    console.log('  - 8개 전문 에이전트 (omk_orchestrator + 7개 서브에이전트)');
    console.log('  - Ralph 루프 자동 검증');
    console.log('  - 4개 워크플로우 스킬 ($team, $autopilot, $plan, $tdd)');
    console.log('  - 워커 간 통신 (MCP 메시지 서버)');
    console.log('  - Kiro 네이티브 패턴');
  });

program.parse();

