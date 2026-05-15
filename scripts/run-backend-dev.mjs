import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensurePortFree } from './lib/ensure-port-free.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backendDir = resolve(root, 'backend');

function readBackendPort() {
  const envPath = resolve(backendDir, '.env');
  if (!existsSync(envPath)) {
    return Number(process.env.PORT ?? 3001);
  }

  const match = readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m);
  return match ? Number(match[1]) : Number(process.env.PORT ?? 3001);
}

const port = readBackendPort();
const label = 'dev:backend';

await ensurePortFree(port, label);

const child = spawn('npm', ['run', 'start:dev'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: String(port) },
});

child.on('exit', (code) => process.exit(code ?? 0));
