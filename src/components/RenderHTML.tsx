import { useEffect, useRef, useState } from 'react'

const iframeSrc = URL.createObjectURL(
    new Blob([`<h1>Loading...</h1>`], { type: 'text/html' })
)

export function RenderHTML({ html }: { html: string }) {
    const ref = useRef<HTMLIFrameElement>(null)
    const [isReady, setReady] = useState(false)

    useEffect(() => {
        const iframe = ref.current
        if (!iframe) return
        if (isReady) {
            iframe.contentDocument!.documentElement.innerHTML = html
            executeScriptsFromElement(iframe.contentDocument!.documentElement)
        } else {
            iframe.onload = () => {
                setReady(true)
            }
        }
    }, [html, isReady])

    return (
        <iframe
            className="w-full h-full"
            src={iframeSrc}
            ref={ref}
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
