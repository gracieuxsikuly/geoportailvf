import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function run(label, script) {
  const child = spawn('npm', ['run', script], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) process.exit(code);
  });
  return child;
}

console.log('[dev] Démarrage backend (:3001) + frontend (:3000)…\n');
run('backend', 'dev:backend');
run('frontend', 'dev:frontend');
