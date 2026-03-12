import { existsSync, mkdirSync, copyFileSync, readdirSync, writeFileSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOME = homedir();

interface SetupOptions {
  local?: boolean;
  force?: boolean;
  agentsOnly?: boolean;
  promptsOnly?: boolean;
  steeringOnly?: boolean;
}

export async function setup(options: SetupOptions = {}) {
  const scope = options.local ? 'local' : 'global';
  const basePath = scope === 'global' 
    ? join(HOME, '.kiro')
    : join(process.cwd(), '.kiro');

  console.log(`🚀 Oh My Kiro v2 설치 중 (${scope})...\n`);

  // 디렉토리 생성
  const dirs = [
    basePath,
    join(basePath, 'agents'),
    join(basePath, 'prompts'),
    join(basePath, 'steering'),
    join(basePath, 'steering', 'skills'),
    join(basePath, 'steering', 'guides'),
    join(basePath, 'steering', 'standards'),
    join(basePath, 'mcp')
  ];

  if (scope === 'local') {
    dirs.push(join(basePath, 'settings'));
  }

  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // 에이전트 설치
  if (!options.promptsOnly && !options.steeringOnly) {
    await installAgents(basePath, options.force);
  }

  // 프롬프트 설치
  if (!options.agentsOnly && !options.steeringOnly) {
    await installPrompts(basePath, options.force);
  }

  // Steering 설치
  if (!options.agentsOnly && !options.promptsOnly) {
    await installSteering(basePath, options.force);
  }

  // MCP 서버 설치
  if (!options.agentsOnly && !options.promptsOnly && !options.steeringOnly) {
    await installMcp(basePath, options.force);
  }

  // 로컬 설치 추가 작업
  if (scope === 'local') {
    await installAgentsMd(process.cwd(), options.force);
    await createCliSettings(basePath, options.force);
    await createMcpSettings(basePath, options.force);
  }

  console.log(`\n✅ Oh My Kiro v2 설치 완료!\n`);
  console.log('다음 단계:');
  console.log('  1. kiro-cli chat');
  console.log('  2. 작업 시작 (자동으로 default 에이전트 활성화)');
  console.log('  3. 워커 간 통신: send_message, read_messages 도구 사용\n');
  console.log('  3. 스킬 사용: $team, $autopilot, $plan, $tdd\n');
}

async function installAgents(basePath: string, force?: boolean) {
  const sourceDir = join(__dirname, '..', '..', 'agents');
  const targetDir = join(basePath, 'agents');

  if (!existsSync(sourceDir)) {
    console.error('❌ agents 디렉토리를 찾을 수 없습니다.');
    return;
  }

  const agents = readdirSync(sourceDir).filter(f => f.endsWith('.json'));
  
  for (const agent of agents) {
    const src = join(sourceDir, agent);
    const dest = join(targetDir, agent);
    
    if (!force && existsSync(dest)) {
      console.log(`⊘ ${agent} (이미 존재, --force로 덮어쓰기)`);
      continue;
    }
    
    copyFileSync(src, dest);
    console.log(`✓ 에이전트: ${agent}`);
  }
}

async function installPrompts(basePath: string, force?: boolean) {
  const sourceDir = join(__dirname, '..', '..', 'prompts');
  const targetDir = join(basePath, 'prompts');

  if (!existsSync(sourceDir)) {
    console.error('❌ prompts 디렉토리를 찾을 수 없습니다.');
    return;
  }

  const prompts = readdirSync(sourceDir).filter(f => f.endsWith('.md'));
  
  for (const prompt of prompts) {
    const src = join(sourceDir, prompt);
    const dest = join(targetDir, prompt);
    
    if (!force && existsSync(dest)) {
      console.log(`⊘ ${prompt} (이미 존재)`);
      continue;
    }
    
    copyFileSync(src, dest);
    console.log(`✓ 프롬프트: ${prompt}`);
  }
}

async function installSteering(basePath: string, force?: boolean) {
  const sourceDir = join(__dirname, '..', '..', 'steering');
  const targetDir = join(basePath, 'steering');

  if (!existsSync(sourceDir)) {
    console.error('❌ steering 디렉토리를 찾을 수 없습니다.');
    return;
  }

  // Core steering files
  const coreFiles = ['orchestration.md', 'ralph-loop.md'];
  for (const file of coreFiles) {
    const src = join(sourceDir, file);
    const dest = join(targetDir, file);
    
    if (existsSync(src)) {
      if (!force && existsSync(dest)) {
        console.log(`⊘ ${file} (이미 존재)`);
        continue;
      }
      copyFileSync(src, dest);
      console.log(`✓ Steering: ${file}`);
    }
  }

  // Skills
  const skillsDir = join(sourceDir, 'skills');
  if (existsSync(skillsDir)) {
    const skills = readdirSync(skillsDir).filter(f => f.endsWith('.md'));
    for (const skill of skills) {
      const src = join(skillsDir, skill);
      const dest = join(targetDir, 'skills', skill);
      
      if (!force && existsSync(dest)) {
        console.log(`⊘ skills/${skill} (이미 존재)`);
        continue;
      }
      copyFileSync(src, dest);
      console.log(`✓ Skill: ${skill}`);
    }
  }

  // Guides
  const guidesDir = join(sourceDir, 'guides');
  if (existsSync(guidesDir)) {
    const guides = readdirSync(guidesDir).filter(f => f.endsWith('.md'));
    for (const guide of guides) {
      const src = join(guidesDir, guide);
      const dest = join(targetDir, 'guides', guide);
      
      if (!force && existsSync(dest)) {
        console.log(`⊘ guides/${guide} (이미 존재)`);
        continue;
      }
      copyFileSync(src, dest);
      console.log(`✓ Guide: ${guide}`);
    }
  }

  // Standards
  const standardsDir = join(sourceDir, 'standards');
  if (existsSync(standardsDir)) {
    const standards = readdirSync(standardsDir).filter(f => f.endsWith('.md'));
    for (const standard of standards) {
      const src = join(standardsDir, standard);
      const dest = join(targetDir, 'standards', standard);
      
      if (!force && existsSync(dest)) {
        console.log(`⊘ standards/${standard} (이미 존재)`);
        continue;
      }
      copyFileSync(src, dest);
      console.log(`✓ Standard: ${standard}`);
    }
  }
}

async function installAgentsMd(projectRoot: string, force?: boolean) {
  const dest = join(projectRoot, 'AGENTS.md');
  
  if (!force && existsSync(dest)) {
    console.log(`⊘ AGENTS.md (이미 존재)`);
    return;
  }

  const content = `# Project Agents

This project uses Oh My Kiro v2 orchestration system.

## Orchestrator (omk_orchestrator)

The omk_orchestrator agent orchestrates work using:
- **Subagent delegation** via use_subagent
- **Ralph loop** for verification and iteration
- **Skills** for complex workflows (\`$team\`, \`$autopilot\`, \`$plan\`, \`$tdd\`)
- **Steering files** for guidance
- **Worker communication** via MCP message server

## Available Subagents

- **executor**: Code implementation, refactoring (opus-4.6)
- **debugger**: Bug fixing, error resolution (opus-4.6)
- **tester**: Test design and execution (sonnet-4.5)
- **reviewer**: Code review, quality checks (sonnet-4.5)
- **architect**: System design, architecture (opus-4.6)
- **planner**: Task planning, breakdown (sonnet-4.5)
- **writer**: Documentation, README (haiku-4.5)

## Skills

\`\`\`bash
$team 3:executor <task>      # Parallel execution (opus-4.6)
$autopilot <feature>          # End-to-end implementation (opus-4.6)
$plan <task>                  # Detailed planning (sonnet-4.5)
$tdd <feature>                # Test-driven development (sonnet-4.5)
\`\`\`

## Worker Communication

Workers can communicate via MCP message server:
- \`send_message(to="worker", message="...")\`
- \`read_messages(worker="self")\`
- Messages stored in \`.kiro/messages/\`

## Ralph Loop

All tasks automatically run through Ralph loop:
1. Execute task
2. Verify results (tests, checks)
3. If issues found, fix and repeat
4. Continue until complete (max 5 iterations)
`;

  writeFileSync(dest, content);
  console.log(`✓ AGENTS.md (프로젝트 루트)`);
}

async function createCliSettings(basePath: string, force?: boolean) {
  const settingsDir = join(basePath, 'settings');
  const cliJsonPath = join(settingsDir, 'cli.json');

  let cliSettings: any = {};

  if (existsSync(cliJsonPath)) {
    if (!force) {
      console.log(`⊘ cli.json (이미 존재)`);
      return;
    }
    cliSettings = JSON.parse(readFileSync(cliJsonPath, 'utf-8'));
  }

  cliSettings['chat.defaultAgent'] = 'omk_orchestrator';

  writeFileSync(cliJsonPath, JSON.stringify(cliSettings, null, 2));
  console.log(`✓ cli.json (default 에이전트 설정)`);
}

async function createMcpSettings(basePath: string, force?: boolean) {
  const settingsDir = join(basePath, 'settings');
  const mcpJsonPath = join(settingsDir, 'mcp.json');
  
  if (!force && existsSync(mcpJsonPath)) {
    console.log(`⊘ mcp.json (이미 존재)`);
    return;
  }

  const mcpServerPath = join(basePath, 'mcp', 'dist', 'message-server.js');
  
  const settings = {
    mcpServers: {
      'omk-messages': {
        command: 'node',
        args: [mcpServerPath],
        env: {
          OMK_WORK_DIR: process.cwd()
        }
      }
    }
  };

  writeFileSync(mcpJsonPath, JSON.stringify(settings, null, 2));
  console.log(`✓ mcp.json (메시지 서버 활성화)`);
}

async function installMcp(basePath: string, force?: boolean) {
  const mcpSourceDir = join(__dirname, '..', '..', 'mcp');
  const mcpTargetDir = join(basePath, 'mcp');

  if (!existsSync(mcpSourceDir)) {
    console.error('❌ mcp 디렉토리를 찾을 수 없습니다.');
    return;
  }

  // Copy TypeScript source
  const files = ['message-server.ts', 'package.json', 'tsconfig.json'];
  
  for (const file of files) {
    const src = join(mcpSourceDir, file);
    const dest = join(mcpTargetDir, file);
    
    if (!existsSync(src)) {
      continue;
    }
    
    if (!force && existsSync(dest)) {
      console.log(`⊘ mcp/${file} (이미 존재)`);
      continue;
    }
    
    copyFileSync(src, dest);
    console.log(`✓ MCP: ${file}`);
  }

  console.log('\n📦 MCP 서버 빌드 필요:');
  console.log(`   cd ${mcpTargetDir}`);
  console.log(`   npm install && npm run build\n`);
}

export async function doctor() {
  console.log('🔍 Oh My Kiro v2 설치 확인...\n');

  const checks = [
    { name: 'Kiro CLI', path: join(HOME, '.kiro'), required: true },
    { name: '글로벌 에이전트', path: join(HOME, '.kiro', 'agents', 'default.json'), required: false },
    { name: '글로벌 Steering', path: join(HOME, '.kiro', 'steering', 'orchestration.md'), required: false },
    { name: '로컬 에이전트', path: join(process.cwd(), '.kiro', 'agents', 'default.json'), required: false },
    { name: '로컬 Steering', path: join(process.cwd(), '.kiro', 'steering', 'orchestration.md'), required: false },
    { name: 'AGENTS.md', path: join(process.cwd(), 'AGENTS.md'), required: false }
  ];

  let allGood = true;

  for (const check of checks) {
    const exists = existsSync(check.path);
    const status = exists ? '✓' : (check.required ? '✗' : '○');
    const label = exists ? '설치됨' : (check.required ? '없음' : '미설치');
    
    console.log(`${status} ${check.name}: ${label}`);
    
    if (check.required && !exists) {
      allGood = false;
    }
  }

  console.log();

  if (!allGood) {
    console.log('❌ 필수 항목이 설치되지 않았습니다.');
    console.log('   먼저 Kiro CLI를 설치하세요: https://kiro.dev/docs/cli/installation\n');
  } else {
    console.log('✅ 설치 확인 완료!\n');
  }
}
