import { execSync } from 'node:child_process';
import net from 'node:net';
import { platform } from 'node:os';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortInUse(targetPort) {
  return new Promise((resolve) => {
    const socket = net.connect({ port: targetPort, host: '127.0.0.1' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function listListeningPids(targetPort) {
  if (platform() === 'win32') {
    try {
      const output = execSync(`netstat -ano -p tcp | findstr ":${targetPort}"`, { encoding: 'utf8' });
      const pids = new Set();

      for (const line of output.split('\n')) {
        if (!line.includes('LISTENING')) {
          continue;
        }
        const localAddress = line.trim().split(/\s+/)[1] ?? '';
        if (!localAddress.endsWith(`:${targetPort}`)) {
          continue;
        }
        const pid = line.trim().split(/\s+/).at(-1);
        if (pid && pid !== '0') {
          pids.add(pid);
        }
      }

      return [...pids];
    } catch {
      return [];
    }
  }

  try {
    const output = execSync(`lsof -ti tcp:${targetPort} -sTCP:LISTEN`, { encoding: 'utf8' });
    return output
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function killPids(pids, targetPort, label) {
  for (const pid of pids) {
    try {
      if (platform() === 'win32') {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      } else {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      }
      console.log(`[${label}] Processus ${pid} arrêté (port ${targetPort}).`);
    } catch {
      console.warn(`[${label}] Impossible d'arrêter le processus ${pid}.`);
    }
  }
}

export async function ensurePortFree(targetPort, label) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (!(await isPortInUse(targetPort))) {
      return;
    }

    if (attempt === 0) {
      console.warn(`[${label}] Le port ${targetPort} est occupé — libération en cours...`);
    }

    killPids(listListeningPids(targetPort), targetPort, label);
    await sleep(800);
  }

  if (await isPortInUse(targetPort)) {
    console.error(`[${label}] Le port ${targetPort} est toujours utilisé.`);
    console.error('Arrêtez manuellement le processus (voir README § Dépannage) puis relancez.');
    process.exit(1);
  }
}
