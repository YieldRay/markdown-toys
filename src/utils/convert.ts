import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export async function html2md(html: string) {
    const file = await unified()
        .use(rehypeParse)
        .use(remarkGfm)
        .use(rehypeRemark)
        .use(remarkStringify)
        .process(html)

    return file.toString()
}

export async function md2html(
    markdown: string,
    { allowDangerousHtml = false }: { allowDangerousHtml?: boolean } = {}
) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml })
        .use(rehypeStringify, { allowDangerousHtml })
        .process(markdown)

    return file.toString()
}
