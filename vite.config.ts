import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import pkg from './package.json' assert { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    define: {
        __BRANCH__: JSON.stringify(
            execSync('git rev-parse --abbrev-ref HEAD', {
                encoding: 'utf8',
            }).trim()
        ),
        __HEAD__: JSON.stringify(
            execSync('git rev-parse HEAD', { encoding: 'utf8' })
        ),
        __PKG__: JSON.stringify(pkg),
        'process.env': {
            ROUTER: process.env.ROUTER,
        },
    },
})
