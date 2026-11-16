module.exports = {
  apps: [
    {
      name: 'mean-ecommerce-api',
      script: './dist/server.js',
      instances: 1, // Single instance to conserve memory on 1 OCPU / 1 GB RAM
      exec_mode: 'fork', // Fork mode uses less overhead than cluster mode on single core
      watch: false,
      max_memory_restart: '300M', // Automatically restarts if memory exceeds 300MB
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Fault tolerance
      autorestart: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
    },
  ],
};
