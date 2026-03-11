#!/usr/bin/env node

import { existsSync, appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OMK_STATE = join(process.cwd(), '.omk');
const EVENTS_DIR = join(OMK_STATE, 'events');
const EVENTS_FILE = join(EVENTS_DIR, 'events.jsonl');

export interface Event {
  timestamp: string;
  type: 'task_start' | 'task_complete' | 'decision' | 'file_change' | 'context' | 'next_task' | 'error' | 'ralph_iteration';
  description: string;
  file?: string;
  metadata?: Record<string, any>;
}

export function captureEvent(event: Omit<Event, 'timestamp'>) {
  // 디렉토리 확인
  if (!existsSync(EVENTS_DIR)) {
    mkdirSync(EVENTS_DIR, { recursive: true });
  }

  const fullEvent: Event = {
    ...event,
    timestamp: new Date().toISOString()
  };

  // JSONL 형식으로 추가
  appendFileSync(EVENTS_FILE, JSON.stringify(fullEvent) + '\n');
}

export function captureTaskStart(description: string) {
  captureEvent({
    type: 'task_start',
    description
  });
}

export function captureTaskComplete(description: string) {
  captureEvent({
    type: 'task_complete',
    description
  });
}

export function captureDecision(description: string, metadata?: Record<string, any>) {
  captureEvent({
    type: 'decision',
    description,
    metadata
  });
}

export function captureFileChange(file: string, description: string) {
  captureEvent({
    type: 'file_change',
    description,
    file
  });
}

export function captureContext(description: string) {
  captureEvent({
    type: 'context',
    description
  });
}

export function captureNextTask(description: string) {
  captureEvent({
    type: 'next_task',
    description
  });
}

export function captureError(description: string, metadata?: Record<string, any>) {
  captureEvent({
    type: 'error',
    description,
    metadata
  });
}

export function captureRalphIteration(iteration: number, action: string, result: string) {
  captureEvent({
    type: 'ralph_iteration',
    description: `반복 ${iteration}: ${action}`,
    metadata: {
      iteration,
      action,
      result
    }
  });
}
