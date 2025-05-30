import { watch } from "rollup"
import { defaultAllowedOrigins } from "vite"

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        port: 5173,
        host: true,
        open: !isCodeSandbox, // Open if it's not a CodeSandbox
        hmr: true,
        allowedHosts: [
            'localhost', 'https://dd71-92-190-87-215.ngrok-free.app'],
        watch:
        {
            usePolling: true,
            interval: 100
        }
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
}