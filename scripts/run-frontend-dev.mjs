import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensurePortFree } from './lib/ensure-port-free.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const frontendDir = resolve(root, 'frontend');
const port = Number(process.env.PORT ?? 3000);
const label = 'dev:frontend';

await ensurePortFree(port, label);

const child = spawn('npx', ['next', 'dev', '-p', String(port)], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: String(port) },
});

child.on('exit', (code) => process.exit(code ?? 0));
