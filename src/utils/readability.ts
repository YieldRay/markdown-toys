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

    const replace = (u: string) => {
        if (u.startsWith(location.href)) {
            return u.replace(location.href, url)
        } else {
            return u.replace(location.origin, new URL(url).origin)
        }
    }

    doc.querySelectorAll('a').forEach((a) => {
        if (!a.href) return
        a.href = replace(a.href)
        a.target = '_blank'
    })
    doc.querySelectorAll('img').forEach((img) => {
        if (!img.src) return
        img.src = replace(img.src)
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
