import { useEffect, useRef, useState } from 'react'

export function RenderHTML({ html }: { html: string }) {
    const ref = useRef<HTMLIFrameElement>(null)
    const [isReady, setReady] = useState(false)

    useEffect(() => {
        const iframe = ref.current
        if (!iframe) return
        if (isReady) {
            iframe.contentDocument!.documentElement.innerHTML = html
        } else {
            iframe.onload = () => {
                setReady(true)
            }
        }
    }, [html, isReady])

    return <iframe className="w-full h-full" src="./iframe.html" ref={ref} />
}
