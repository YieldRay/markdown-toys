import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'
import { execSync } from 'node:child_process'
import pkg from './package.json'

const cmd = (c: string) => {
    try {
        return execSync(c, { encoding: 'utf8' }).trim()
    } catch {
        return ''
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: './',
    define: {
        __BRANCH__: JSON.stringify(cmd('git rev-parse --abbrev-ref HEAD')),
        __HEAD__: JSON.stringify(cmd('git rev-parse HEAD')),
        __PKG__: JSON.stringify(pkg),
        'process.env': {
            ROUTER: process.env.ROUTER,
        },
    },
})
