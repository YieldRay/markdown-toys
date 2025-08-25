import Defuddle from 'defuddle'

const parser = new DOMParser()

export async function readabilityFromURL(url: string) {
    const html = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    ).then((res) => res.text())
    // this code runs on the client side only
    const doc = parser.parseFromString(html, 'text/html')
    const defuddle = new Defuddle(doc, {
        url,
    })
    const result = defuddle.parse()
    return result
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
