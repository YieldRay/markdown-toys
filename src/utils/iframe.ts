/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @param attrs https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attributes
 * @returns https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement
 */
export function newIframeElement(
    attrs?: Partial<Record<keyof HTMLIFrameElement, string>>
): HTMLIFrameElement {
    const iframe = document.createElement('iframe')
    if (attrs) {
        for (const [k, v] of Object.entries(attrs)) {
            iframe.setAttribute(k, v)
        }
    }
    return iframe
}

export function postMessageTo(
    window: Window,
    message: any,
    transfer?: Transferable[],
    targetOrigin?: string
): void
export function postMessageTo(
    worker: Worker | MessagePort,
    message: any,
    transfer?: Transferable[]
): void
export function postMessageTo(
    target: Window | Worker | MessagePort,
    message: any,
    transfer: Transferable[] = [],
    targetOrigin = '*'
) {
    if (target instanceof Worker || target instanceof MessagePort) {
        target.postMessage(message, transfer)
    } else {
        target.postMessage(message, targetOrigin, transfer)
    }
}
