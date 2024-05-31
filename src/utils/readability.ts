import { Readability } from '@mozilla/readability'

export async function readability(document: Document) {
    const reader = new Readability(document, {})
    const article = reader.parse()
    return article
}

const parser = new DOMParser()

export async function readabilityFromURL(url: string) {
    const html = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    ).then((res) => res.text())
    const doc = parser.parseFromString(html, 'text/html')

    doc.querySelectorAll('a').forEach((a) => {
        if (a.href) {
            if (a.href.startsWith(location.href)) {
                a.href = a.href.replace(location.href, url)
            } else {
                a.href = a.href.replace(location.origin, new URL(url).origin)
            }
            a.target = '_blank'
        }
    })

    return readability(doc)
}

export function isURL(url?: string) {
    if (!url) return false
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
