#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const pkgDir = path.resolve(__dirname, '..');
const skillName = 'wxpost-skill';
const skillPath = path.join(pkgDir, 'SKILL.md');
const readmePath = path.join(pkgDir, 'README.md');
const copyEntries = [
  'SKILL.md',
  'README.md',
  'agents',
  'references',
];

function printHelp() {
  const lines = [
    '@rongyan/wxpost-skill',
    '',
    `包目录: ${pkgDir}`,
    `SKILL.md: ${skillPath}`,
    `README.md: ${readmePath}`,
    '',
    '用法:',
    '  npx @rongyan/wxpost-skill',
    '  npx @rongyan/wxpost-skill install --target codex',
    '  npx @rongyan/wxpost-skill install --target claude',
    '  npx @rongyan/wxpost-skill install --target codex --dir /custom/skills',
    '',
    '说明:',
    '  install 会把技能文件复制到目标技能目录下的 wxpost-skill 子目录中。',
    '  实际发文时建议优先使用 npx @rongyan/wxpost-cli@latest。',
  ];
  process.stdout.write(lines.join('\n') + '\n');
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const part = argv[i];
    if (part.startsWith('--')) {
      const key = part.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i += 1;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(part);
    }
  }
  return args;
}

function resolveBaseDir(target, customDir) {
  if (customDir) {
    return path.resolve(customDir);
  }
  if (target === 'claude') {
    return path.join(os.homedir(), '.claude', 'skills');
  }
  const codexHome = process.env.CODEX_HOME;
  if (codexHome) {
    return path.join(codexHome, 'skills');
  }
  return path.join(os.homedir(), '.codex', 'skills');
}

function copySkill(targetDir) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of copyEntries) {
    const src = path.join(pkgDir, entry);
    const dest = path.join(targetDir, entry);
    fs.cpSync(src, dest, { recursive: true });
  }
}

function runInstall(args) {
  const target = args.target;
  if (target !== 'codex' && target !== 'claude') {
    process.stderr.write('请使用 --target codex 或 --target claude\n');
    process.exit(1);
  }

  const baseDir = resolveBaseDir(target, args.dir);
  const targetDir = path.join(baseDir, skillName);
  copySkill(targetDir);

  const lines = [
    '安装完成',
    `目标环境: ${target}`,
    `技能目录: ${targetDir}`,
    '',
    '建议下一步:',
    '1. 重启或刷新对应运行环境的技能发现',
    '2. 用“使用 wxpost-skill ...”或“$wxpost-skill”开始调用',
    '3. 实际发文前确认已安装 @rongyan/wxpost-cli',
  ];
  process.stdout.write(lines.join('\n') + '\n');
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];

if (!cmd || cmd === 'help' || cmd === '--help' || args.help) {
  printHelp();
} else if (cmd === 'install') {
  runInstall(args);
} else {
  process.stderr.write(`未知命令: ${cmd}\n\n`);
  printHelp();
  process.exit(1);
}
