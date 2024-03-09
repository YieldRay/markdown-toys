const cache = new Map<string, string>()

export default async function translate(md: string) {
    if (cache.has(md)) return cache.get(md)!

    const translated = await fetch(
        'https://yieldray-geminitranslate.web.val.run/',
        {
            body: new URLSearchParams({ md }),
            method: 'POST',
        }
    ).then((res) => res.text())

    cache.set(md, translated)

    return translated
}
