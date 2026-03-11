#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const OMK_STATE = join(process.cwd(), '.omk');
const MEMORY_DIR = join(OMK_STATE, 'memory');
const SESSIONS_DIR = join(MEMORY_DIR, 'sessions');
const EVENTS_FILE = join(OMK_STATE, 'events', 'events.jsonl');

interface HandoffData {
  timestamp: string;
  project: string;
  completedTasks: string[];
  decisions: string[];
  nextTasks: string[];
  filesChanged: string[];
  context: string[];
}

export function handoff() {
  console.log('🔄 세션 요약 생성 중...\n');

  // 디렉토리 확인
  if (!existsSync(SESSIONS_DIR)) {
    mkdirSync(SESSIONS_DIR, { recursive: true });
  }

  // 현재 세션 데이터 수집
  const data = collectSessionData();

  // 세션 요약 생성
  const summary = generateSummary(data);

  // 파일 저장
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const sessionFile = join(SESSIONS_DIR, `${timestamp}.md`);
  const latestFile = join(MEMORY_DIR, 'session-latest.md');

  writeFileSync(sessionFile, summary);
  writeFileSync(latestFile, summary);

  console.log(`✅ 세션 요약 저장: ${sessionFile}`);
  console.log(`✅ session-latest.md 업데이트\n`);
  console.log('📋 요약 내용:\n');
  console.log(summary);
}

function collectSessionData(): HandoffData {
  const projectName = process.cwd().split('/').pop() || 'project';
  const timestamp = new Date().toISOString();

  // 이벤트 로그에서 데이터 수집
  const events = readEvents();
  
  const completedTasks: string[] = [];
  const decisions: string[] = [];
  const filesChanged: string[] = [];
  const context: string[] = [];

  events.forEach(event => {
    if (event.type === 'task_complete') {
      completedTasks.push(event.description);
    } else if (event.type === 'decision') {
      decisions.push(event.description);
    } else if (event.type === 'file_change') {
      if (!filesChanged.includes(event.file)) {
        filesChanged.push(event.file);
      }
    } else if (event.type === 'context') {
      context.push(event.description);
    }
  });

  // Ralph 상태 확인
  const ralphState = readRalphState();
  if (ralphState) {
    context.push(`Ralph 루프: ${ralphState.iteration}회 반복`);
    if (ralphState.goal) {
      context.push(`목표: ${ralphState.goal}`);
    }
  }

  return {
    timestamp,
    project: projectName,
    completedTasks: completedTasks.length > 0 ? completedTasks : ['세션 진행 중'],
    decisions: decisions.length > 0 ? decisions : ['없음'],
    nextTasks: extractNextTasks(events),
    filesChanged: filesChanged.length > 0 ? filesChanged : ['없음'],
    context: context.length > 0 ? context : ['Oh My Kiro 세션']
  };
}

function readEvents(): any[] {
  if (!existsSync(EVENTS_FILE)) {
    return [];
  }

  const content = readFileSync(EVENTS_FILE, 'utf-8');
  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function readRalphState(): any {
  const ralphFile = join(OMK_STATE, 'state', 'ralph-active.json');
  if (!existsSync(ralphFile)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(ralphFile, 'utf-8'));
  } catch {
    return null;
  }
}

function extractNextTasks(events: any[]): string[] {
  const nextTasks: string[] = [];
  
  events.forEach(event => {
    if (event.type === 'next_task') {
      nextTasks.push(event.description);
    }
  });

  return nextTasks.length > 0 ? nextTasks : ['작업 계속'];
}

function generateSummary(data: HandoffData): string {
  const date = new Date(data.timestamp);
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].slice(0, 5);

  return `# 세션 요약

세션: ${dateStr} ${timeStr}
프로젝트: ${data.project}

## 완료된 작업
${data.completedTasks.map(task => `- ${task}`).join('\n')}

## 주요 결정
${data.decisions.map(decision => `- ${decision}`).join('\n')}

## 다음 작업
${data.nextTasks.map(task => `- [ ] ${task}`).join('\n')}

## 파일 변경
${data.filesChanged.map(file => `- ${file}`).join('\n')}

## 컨텍스트
${data.context.map(ctx => `- ${ctx}`).join('\n')}

---
생성 시간: ${data.timestamp}
`;
}
