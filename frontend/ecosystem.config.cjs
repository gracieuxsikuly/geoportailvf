module.exports = {
  apps: [
    {
      name: 'virunga-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
