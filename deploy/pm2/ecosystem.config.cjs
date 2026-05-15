// Agrégat PM2 : lance backend + frontend depuis la racine du projet.
//   pm2 start deploy/pm2/ecosystem.config.cjs
const path = require('node:path');
const root = path.resolve(__dirname, '..', '..');

module.exports = {
  apps: [
    {
      name: 'virunga-backend',
      script: path.join(root, 'backend', 'dist', 'main.js'),
      cwd: path.join(root, 'backend'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'virunga-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: path.join(root, 'frontend'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production', PORT: '3000' },
    },
  ],
};
