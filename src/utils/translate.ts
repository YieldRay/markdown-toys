const cache = new Map<string, string>()

export default async function translate(md: string) {
    if (cache.has(md)) return cache.get(md)!

    try {
        const translated = await fetch(
            'https://yieldray-geminitranslatesimple.web.val.run/',
            {
                body: new URLSearchParams({ md }),
                method: 'POST',
            }
        ).then((res) => res.text())

        cache.set(md, translated)
        return translated
    } catch {
        throw new Error(
            '无法翻译，请关闭翻译开关！原因：接口受限，请稍后再试（可以尝试使用 https://yieldray-html2md.web.val.run/ ）'
        )
    }
}
