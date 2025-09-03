module.exports = {
    apps: [
        {
            script: '/usr/src/perpetuus-api/node_modules/.bin/ts-node',
            args: '/usr/src/perpetuus-api/src/index.ts',
            name: 'CONT-ESC',
            instances: 'max',
            max_memory_restart: '600M',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production'
            },
            watch_delay: 1000,
            wait_ready: true
        }
    ]
};
