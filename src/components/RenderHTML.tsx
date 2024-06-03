import { useEffect, useRef } from 'react'

export function RenderHTML({ html }: { html: string }) {
    const ref = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = ref.current
        if (!iframe) return

        iframe.contentDocument!.documentElement.innerHTML = html
        executeScriptsFromElement(iframe.contentDocument!.documentElement)
    }, [html])

    return (
        <iframe
            ref={ref}
            className="w-full h-full"
            src="about:blank"
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox
            sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
        />
    )
}

function executeScriptsFromElement(element: HTMLElement): void {
    const scripts = element.querySelectorAll('script')

    scripts.forEach((originalScript) => {
        const newScript = document.createElement('script')

        for (let i = 0; i < originalScript.attributes.length; i++) {
            const attr = originalScript.attributes[i]
            newScript.setAttribute(attr.name, attr.value)
        }

        if (originalScript.textContent) {
            newScript.textContent = originalScript.textContent
        }

        document.body.appendChild(newScript)
        newScript.remove()
    })
}
