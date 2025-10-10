module.exports = {
  apps: [
    {
      name: 'copexia-next',
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/copexia/copexia-next',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: { 
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_APP_URL: 'http://18.191.177.238',
        NEXT_PUBLIC_BACKEND_API_BASE_URL: 'http://18.191.177.238/api/v1',
        NEXT_PUBLIC_API_URL: 'http://18.191.177.238/api/v1',
        NEXT_PUBLIC_WHATSAPP_NUMBER: '543813571707',
        NEXT_TELEMETRY_DISABLED: '1',
        NEXT_PUBLIC_APP_ENV: 'production'
      },
      error_file: './logs/copexia-next-error.log',
      out_file: './logs/copexia-next-out.log',
      log_file: './logs/copexia-next-combined.log',
      time: true
    }
  ]
};
