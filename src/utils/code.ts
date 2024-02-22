/**
 * the [greenlet](https://github.com/developit/greenlet) library should be easier than this to use
 *
 * Prefer high-level libraries like (if possible):
 * https://github.com/GoogleChromeLabs/comlink
 * https://github.com/andywer/threads.js
 */
export function createWorkerFromCode(code: string, options?: WorkerOptions) {
    const blob = new Blob([code], { type: 'application/javascript' })
    const scriptURL = URL.createObjectURL(blob)

    const worker = new Worker(scriptURL, options)
    const terminate = worker.terminate.bind(worker)
    worker.terminate = () => {
        URL.revokeObjectURL(scriptURL)
        terminate()
    }
    return worker
}

/**
 * note that you need manually call URL.revokeObjectURL()
 */
export function createIframeFromHTML(code: string) {
    const blob = new Blob([code], { type: 'text/html' })
    const iframeURL = URL.createObjectURL(blob)

    const iframe = document.createElement('iframe')
    iframe.src = iframeURL
    return iframe
}
