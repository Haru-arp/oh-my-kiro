import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, symlinkSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { StateManager } from '../state/manager.js';
import { listAgents } from '../agents/definitions.js';
import { handoff } from './handoff.js';

export { handoff };

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOME = homedir();
const KIRO_HOME = join(HOME, '.kiro');
const KIRO_SKILLS = join(KIRO_HOME, 'skills');
const KIRO_AGENTS = join(KIRO_HOME, 'agents');
const KIRO_STEERING = join(KIRO_HOME, 'steering');
const OMK_STATE = join(process.cwd(), '.omk');

export async function setup(options: { force?: boolean; scope?: 'user' | 'project' } = {}) {
  console.log('🚀 Oh My Kiro 설치 중...\n');

  // Kiro 디렉토리 확인
  if (!existsSync(KIRO_HOME)) {
    console.error('❌ Kiro CLI가 설치되지 않았습니다.');
    console.error('   먼저 Kiro CLI를 설치하세요.');
    return;
  }

  const scope = options.scope || 'project';
  
  // Kiro 디렉토리 생성
  const dirs = [
    KIRO_SKILLS,
    KIRO_AGENTS,
    KIRO_STEERING,
    OMK_STATE,
    join(OMK_STATE, 'state'),
    join(OMK_STATE, 'plans'),
    join(OMK_STATE, 'logs'),
    join(OMK_STATE, 'skills'),  // 로컬 스킬 디렉토리
    join(OMK_STATE, 'memory'),  // 메모리 디렉토리
    join(OMK_STATE, 'memory', 'sessions'),  // 세션 히스토리
    join(OMK_STATE, 'events')  // 이벤트 로그
  ];

  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`✓ 생성: ${dir}`);
    }
  });

  // 프로젝트에 .kiro 심볼릭 링크 생성 (Kiro가 steering 읽을 수 있도록)
  const projectKiroLink = join(process.cwd(), '.kiro');
  if (!existsSync(projectKiroLink)) {
    try {
      symlinkSync(KIRO_HOME, projectKiroLink, 'dir');
      console.log(`✓ 생성: ${projectKiroLink} -> ${KIRO_HOME}`);
    } catch (e) {
      console.log(`⚠️  심볼릭 링크 생성 실패 (권한 문제일 수 있음)`);
      console.log(`   수동으로 실행: ln -s ${KIRO_HOME} ${projectKiroLink}`);
    }
  }

  // 스킬 설치 (심볼릭 링크)
  const skillsDir = join(__dirname, '..', '..', 'skills');
  if (existsSync(skillsDir)) {
    const skills = readdirSync(skillsDir);
    
    for (const skill of skills) {
      const src = join(skillsDir, skill);
      const dest = join(KIRO_SKILLS, skill);
      
      if (existsSync(src) && !existsSync(dest)) {
        try {
          symlinkSync(src, dest);
          console.log(`✓ 스킬 설치: ${skill}`);
        } catch (e) {
          // 심볼릭 링크 실패 시 복사
          const skillFile = join(src, 'SKILL.md');
          if (existsSync(skillFile)) {
            mkdirSync(dest, { recursive: true });
            copyFileSync(skillFile, join(dest, 'SKILL.md'));
            console.log(`✓ 스킬 복사: ${skill}`);
          }
        }
      }
    }
  }

  // 에이전트 설치 (JSON 파일)
  const agentsDir = join(__dirname, '..', '..', 'agents');
  if (existsSync(agentsDir)) {
    const agents = readdirSync(agentsDir).filter(f => f.endsWith('.json'));
    
    for (const agent of agents) {
      const src = join(agentsDir, agent);
      const dest = join(KIRO_AGENTS, agent);
      
      copyFileSync(src, dest);
      console.log(`✓ 에이전트 설치: ${agent.replace('.json', '')}`);
    }
  }

  // Steering 문서 설치
  const steeringDir = join(__dirname, '..', '..', 'steering');
  if (existsSync(steeringDir)) {
    const docs = readdirSync(steeringDir).filter(f => f.endsWith('.md'));
    
    for (const doc of docs) {
      const src = join(steeringDir, doc);
      const dest = join(KIRO_STEERING, doc);
      
      copyFileSync(src, dest);
      console.log(`✓ Steering 설치: ${doc}`);
    }
  }

  // 설정 파일 생성
  const configPath = join(OMK_STATE, 'config.json');
  if (!existsSync(configPath) || options.force) {
    const config = {
      version: '0.1.0',
      scope,
      team: {
        max_workers: 6,
        default_role: 'executor',
        phases: ['team-plan', 'team-prd', 'team-exec', 'team-verify', 'team-fix'],
        max_fix_attempts: 3
      },
      agents: {
        architect: { 
          complexity: 'high', 
          focus: 'analysis',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'code', 'grep', 'use_subagent'],
          resources: ['.omk/steering/PROJECT.md', '.omk/config.json']
        },
        planner: { 
          complexity: 'medium', 
          focus: 'planning',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'code', 'use_subagent'],
          resources: ['.omk/steering/PROJECT.md']
        },
        executor: { 
          complexity: 'medium', 
          focus: 'implementation',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'fs_write', 'execute_bash', 'code', 'use_subagent'],
          resources: ['.omk/steering/PROJECT.md', '.omk/state/']
        },
        debugger: { 
          complexity: 'medium', 
          focus: 'debugging',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'execute_bash', 'code', 'grep'],
          resources: ['.omk/steering/PROJECT.md', '.omk/logs/']
        },
        verifier: { 
          complexity: 'low', 
          focus: 'verification',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'execute_bash', 'code'],
          resources: ['.omk/steering/PROJECT.md']
        },
        'test-engineer': {
          complexity: 'medium',
          focus: 'testing',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'fs_write', 'execute_bash', 'code'],
          resources: ['.omk/steering/PROJECT.md', 'tests/', '__tests__/']
        },
        'security-reviewer': {
          complexity: 'high',
          focus: 'security',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'code', 'grep'],
          resources: ['.omk/steering/PROJECT.md']
        },
        explore: {
          complexity: 'low',
          focus: 'exploration',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'code', 'grep', 'glob'],
          resources: []
        },
        writer: {
          complexity: 'low',
          focus: 'documentation',
          model: 'claude-opus-4.6',
          allowedTools: ['fs_read', 'fs_write', 'code'],
          resources: ['docs/', 'README.md']
        }
      },
      modes: {
        ralph: {
          max_iterations: 10,
          verification_required: true
        },
        autopilot: {
          auto_verify: true,
          auto_fix: true
        }
      }
    };
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✓ 설정 생성: config.json`);
  }

  // notepad 생성
  const notepadPath = join(OMK_STATE, 'notepad.md');
  if (!existsSync(notepadPath)) {
    writeFileSync(notepadPath, '# 세션 노트\n\n');
    console.log(`✓ 노트패드 생성`);
  }

  // session-latest.md 템플릿 생성
  const sessionLatestPath = join(OMK_STATE, 'memory', 'session-latest.md');
  if (!existsSync(sessionLatestPath)) {
    const projectName = process.cwd().split('/').pop() || 'project';
    const template = `# 세션 메모리

세션: 새 세션
프로젝트: ${projectName}

## 현재 작업
- 새 세션 시작

## 주요 결정
- 없음

## 다음 작업
- [ ] 작업 시작

## 컨텍스트
- Oh My Kiro 설치 완료
- 모든 에이전트 및 스킬 사용 가능
`;
    writeFileSync(sessionLatestPath, template);
    console.log(`✓ 메모리 템플릿 생성`);
  }

  console.log('\n✅ 설치 완료!');
  console.log('\n다음 단계:');
  console.log('  1. omk doctor - 설치 확인');
  console.log('  2. kiro-cli chat - Kiro 시작');
  console.log('  3. $team, $autopilot 등 스킬 사용');
  console.log('\nSteering 문서: ~/.kiro/steering/PROJECT.md');
}

export async function doctor() {
  console.log('🔍 Oh My Kiro 설치 확인 중...\n');

  const checks = [
    { 
      name: 'Kiro CLI', 
      test: () => existsSync(join(HOME, '.kiro')),
      fix: 'Kiro CLI를 먼저 설치하세요'
    },
    { 
      name: 'Skills 디렉토리', 
      test: () => existsSync(KIRO_SKILLS),
      fix: '"omk setup" 실행'
    },
    { 
      name: 'Agents 디렉토리', 
      test: () => existsSync(KIRO_AGENTS),
      fix: '"omk setup" 실행'
    },
    { 
      name: 'Steering 디렉토리', 
      test: () => existsSync(KIRO_STEERING),
      fix: '"omk setup" 실행'
    },
    { 
      name: 'State 디렉토리', 
      test: () => existsSync(OMK_STATE),
      fix: '"omk setup" 실행'
    },
    { 
      name: '설정 파일', 
      test: () => existsSync(join(OMK_STATE, 'config.json')),
      fix: '"omk setup" 실행'
    }
  ];

  let allPassed = true;
  for (const check of checks) {
    const passed = check.test();
    console.log(`${passed ? '✓' : '✗'} ${check.name}`);
    if (!passed) {
      console.log(`  → ${check.fix}`);
      allPassed = false;
    }
  }

  if (existsSync(KIRO_SKILLS)) {
    console.log('\n설치된 스킬:');
    const skills = readdirSync(KIRO_SKILLS);
    skills.forEach(skill => {
      console.log(`  • ${skill}`);
    });
  }

  if (existsSync(KIRO_AGENTS)) {
    console.log('\n설치된 에이전트:');
    const agents = readdirSync(KIRO_AGENTS).filter(f => f.endsWith('.md'));
    agents.forEach(agent => {
      console.log(`  • ${agent.replace('.md', '')}`);
    });
  }

  if (existsSync(KIRO_STEERING)) {
    console.log('\nSteering 문서:');
    const docs = readdirSync(KIRO_STEERING).filter(f => f.endsWith('.md'));
    docs.forEach(doc => {
      console.log(`  • ${doc}`);
    });
  }

  const stateManager = new StateManager();
  const activeModes = stateManager.getActiveModes();
  if (activeModes.length > 0) {
    console.log('\n활성 모드:');
    activeModes.forEach(mode => {
      console.log(`  • ${mode.mode} (시작: ${new Date(mode.started_at).toLocaleString()})`);
    });
  }

  console.log(allPassed ? '\n✅ 모든 확인 통과!' : '\n⚠️  일부 확인 실패');
}

export async function listAgentsCommand() {
  console.log('📋 Available Agents\n');
  
  const configPath = join(OMK_STATE, 'config.json');
  let customAgents = {};
  
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    customAgents = config.agents || {};
  }

  const agents = listAgents(customAgents);
  
  agents.forEach(agent => {
    console.log(`${agent.name}`);
    console.log(`  Complexity: ${agent.complexity}`);
    console.log(`  Focus: ${agent.focus}`);
    console.log(`  ${agent.description}\n`);
  });
}

export async function statusCommand() {
  const stateManager = new StateManager();
  const activeModes = stateManager.getActiveModes();

  console.log('\n📊 Oh My Kiro Status\n');

  if (activeModes.length === 0) {
    console.log('ℹ️  No active modes');
    return;
  }

  activeModes.forEach(mode => {
    console.log(`${mode.mode.toUpperCase()}`);
    console.log(`  Started: ${new Date(mode.started_at).toLocaleString()}`);
    console.log(`  Data: ${JSON.stringify(mode.data, null, 2)}\n`);
  });
}

export async function addSkill(repoUrl: string, options: { skill?: string; local?: boolean } = {}) {
  console.log('📦 스킬 설치 중...\n');

  const HOME = homedir();
  const KIRO_SKILLS = join(HOME, '.kiro', 'skills');
  const LOCAL_SKILLS = join(process.cwd(), '.omk', 'skills');

  // 로컬 설치 시 .omk/skills/ 사용
  const targetDir = options.local ? LOCAL_SKILLS : KIRO_SKILLS;

  if (!options.local && !existsSync(KIRO_SKILLS)) {
    console.error('❌ Kiro CLI가 설치되지 않았습니다.');
    return;
  }

  // 로컬 설치 시 .omk 디렉토리 생성
  if (options.local && !existsSync(LOCAL_SKILLS)) {
    mkdirSync(LOCAL_SKILLS, { recursive: true });
  }

  try {
    // GitHub URL에서 저장소 정보 추출
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      console.error('❌ 유효하지 않은 GitHub URL입니다.');
      return;
    }

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    // 임시 디렉토리에 클론
    const tempDir = join(HOME, '.omk', 'temp', `${repoName}-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });

    console.log(`📥 저장소 클론 중: ${owner}/${repoName}`);
    
    const { execSync } = await import('child_process');
    execSync(`git clone --depth 1 ${repoUrl} ${tempDir}`, { stdio: 'inherit' });

    // 특정 스킬만 설치
    if (options.skill) {
      const skillPath = join(tempDir, 'skills', options.skill);
      const destPath = join(targetDir, options.skill);

      if (!existsSync(skillPath)) {
        console.error(`❌ 스킬을 찾을 수 없습니다: ${options.skill}`);
        return;
      }

      if (existsSync(destPath)) {
        console.log(`⚠️  스킬이 이미 존재합니다: ${options.skill}`);
        console.log('   덮어쓰려면 --force 옵션을 사용하세요.');
        return;
      }

      // 스킬 복사
      const copyRecursive = (src: string, dest: string) => {
        mkdirSync(dest, { recursive: true });
        const entries = readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
          const srcPath = join(src, entry.name);
          const destPath = join(dest, entry.name);
          
          if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      };

      copyRecursive(skillPath, destPath);
      const scope = options.local ? '로컬' : '전역';
      console.log(`✓ 스킬 설치 완료 (${scope}): ${options.skill}`);
      console.log(`  위치: ${destPath}`);
      console.log(`\n💡 바로 사용 가능:`);
      console.log(`   $${options.skill} "작업"`);
    } else {
      // 전체 스킬 디렉토리 설치
      const skillsPath = join(tempDir, 'skills');
      
      if (!existsSync(skillsPath)) {
        console.error('❌ skills 디렉토리를 찾을 수 없습니다.');
        return;
      }

      const skills = readdirSync(skillsPath);
      let installed = 0;

      for (const skill of skills) {
        const srcPath = join(skillsPath, skill);
        const destPath = join(targetDir, skill);

        if (existsSync(destPath)) {
          console.log(`⊘ 건너뜀 (이미 존재): ${skill}`);
          continue;
        }

        const copyRecursive = (src: string, dest: string) => {
          mkdirSync(dest, { recursive: true });
          const entries = readdirSync(src, { withFileTypes: true });
          
          for (const entry of entries) {
            const srcPath = join(src, entry.name);
            const destPath = join(dest, entry.name);
            
            if (entry.isDirectory()) {
              copyRecursive(srcPath, destPath);
            } else {
              copyFileSync(srcPath, destPath);
            }
          }
        };

        copyRecursive(srcPath, destPath);
        console.log(`✓ 설치: ${skill}`);
        installed++;
      }

      const scope = options.local ? '로컬' : '전역';
      console.log(`\n✅ ${installed}개 스킬 설치 완료 (${scope})!`);
      console.log(`\n💡 바로 사용 가능 (재시작 불필요)`);
    }

    // 임시 디렉토리 정리
    execSync(`rm -rf ${tempDir}`, { stdio: 'ignore' });

  } catch (error: any) {
    console.error('❌ 설치 실패:', error.message);
  }
}

export async function cancelCommand(mode?: string) {
  const stateManager = new StateManager();

  if (mode) {
    stateManager.completeMode(mode);
    console.log(`✓ 취소: ${mode}`);
  } else {
    const activeModes = stateManager.getActiveModes();
    activeModes.forEach(m => {
      stateManager.completeMode(m.mode);
      console.log(`✓ 취소: ${m.mode}`);
    });
  }
}

export async function listSkills() {
  const HOME = homedir();
  const KIRO_SKILLS = join(HOME, '.kiro', 'skills');
  const LOCAL_SKILLS = join(process.cwd(), '.omk', 'skills');

  console.log('📚 설치된 스킬\n');

  // 전역 스킬
  if (existsSync(KIRO_SKILLS)) {
    const globalSkills = readdirSync(KIRO_SKILLS);
    if (globalSkills.length > 0) {
      console.log('🌍 전역 스킬 (~/.kiro/skills/):');
      globalSkills.forEach(skill => {
        console.log(`  • ${skill}`);
      });
      console.log();
    }
  }

  // 로컬 스킬
  if (existsSync(LOCAL_SKILLS)) {
    const localSkills = readdirSync(LOCAL_SKILLS);
    if (localSkills.length > 0) {
      console.log('📁 로컬 스킬 (.omk/skills/):');
      localSkills.forEach(skill => {
        console.log(`  • ${skill}`);
      });
      console.log();
    }
  }

  console.log('💡 사용법: $스킬이름 "작업"');
  console.log('💡 우선순위: 로컬 > 전역');
}

export async function updateCommand(options: { force?: boolean } = {}) {
  console.log('🔄 Oh My Kiro 업데이트 중...\n');

  const { execSync } = await import('child_process');
  const HOME = homedir();
  const OMK_INSTALL = join(HOME, '.omk', 'install');

  try {
    // Oh My Kiro 설치 위치 확인
    let omkPath = OMK_INSTALL;
    
    // npm link로 설치된 경우 실제 경로 찾기
    try {
      const npmRoot = execSync('npm root -g', { encoding: 'utf-8' }).trim();
      const linkedPath = join(npmRoot, 'oh-my-kiro');
      if (existsSync(linkedPath)) {
        omkPath = linkedPath;
      }
    } catch (e) {
      // npm root 실패 시 기본 경로 사용
    }

    if (!existsSync(omkPath)) {
      console.log('📦 Oh My Kiro를 처음 설치합니다...');
      
      // Git 클론
      mkdirSync(OMK_INSTALL, { recursive: true });
      console.log('📥 저장소 클론 중...');
      execSync(`git clone https://github.com/your-username/oh-my-kiro.git ${OMK_INSTALL}`, { stdio: 'inherit' });
      
      // 빌드
      console.log('\n🔨 빌드 중...');
      execSync('npm install && npm run build', { cwd: OMK_INSTALL, stdio: 'inherit' });
      
      console.log('\n✅ 설치 완료!');
      console.log('💡 이제 omk setup을 실행하세요.');
      return;
    }

    // 업데이트
    console.log('📥 최신 버전 확인 중...');
    
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: omkPath, encoding: 'utf-8' }).trim();
    const currentCommit = execSync('git rev-parse HEAD', { cwd: omkPath, encoding: 'utf-8' }).trim();
    
    console.log(`현재: ${currentBranch} (${currentCommit.slice(0, 7)})`);
    
    // Git pull
    execSync('git fetch origin', { cwd: omkPath, stdio: 'inherit' });
    
    const latestCommit = execSync(`git rev-parse origin/${currentBranch}`, { cwd: omkPath, encoding: 'utf-8' }).trim();
    
    if (currentCommit === latestCommit && !options.force) {
      console.log('\n✅ 이미 최신 버전입니다!');
      return;
    }
    
    console.log('\n📥 업데이트 다운로드 중...');
    execSync(`git pull origin ${currentBranch}`, { cwd: omkPath, stdio: 'inherit' });
    
    // 빌드
    console.log('\n🔨 빌드 중...');
    execSync('npm install && npm run build', { cwd: omkPath, stdio: 'inherit' });
    
    console.log('\n✅ 업데이트 완료!');
    console.log(`최신: ${currentBranch} (${latestCommit.slice(0, 7)})`);
    
    // 재설치 권장
    console.log('\n💡 변경사항을 적용하려면:');
    console.log('   omk setup --force');
    
  } catch (error: any) {
    console.error('❌ 업데이트 실패:', error.message);
    console.log('\n💡 수동 업데이트:');
    console.log('   cd ~/.omk/install');
    console.log('   git pull');
    console.log('   npm install && npm run build');
    console.log('   omk setup --force');
  }
}
