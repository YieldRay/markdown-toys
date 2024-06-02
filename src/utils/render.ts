const clientSideHighlightScript = String.raw`<!--@@ BEGIN HIGHLIGHT @@-->
<script type="module">
import { common, createStarryNight } from "https://esm.sh/@wooorm/starry-night@3?bundle";
import { toDom } from "https://esm.sh/hast-util-to-dom@4?bundle";

const starryNight = await createStarryNight(common);
const prefix = "language-";

const nodes = Array.from(document.body.querySelectorAll("code"));

for (const node of nodes) {
const className = Array.from(node.classList).find(function (d) {
    return d.startsWith(prefix);
});
if (!className) continue;
const scope = starryNight.flagToScope(className.slice(prefix.length));
if (!scope) continue;
const tree = starryNight.highlight(node.textContent, scope);
node.replaceChildren(toDom(tree, { fragment: true }));
}
</script>
<!--@@ END   HIGHLIGHT @@-->`

export function withGfmHTML(
    html: string,
    {
        title,
        highlight: _hightlight,
    }: {
        title?: string
        highlight?: boolean
    } = {}
) {
    const highlight =
        typeof _hightlight == 'undefined'
            ? detectIfHighlightRequired(html)
            : _hightlight

    return String.raw`<!DOCTYPE html>
<html lang="en">
<head>${title ? `<title>${title}</title>` : ''}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="dns-prefetch" href="https://esm.sh/" />
    <link rel="dns-prefetch" href="https://registry.npmmirror.com/" />
    <link rel="preload" as="style" href="https://registry.npmmirror.com/github-markdown-css/latest/files"/>
    <link rel="stylesheet" href="https://registry.npmmirror.com/github-markdown-css/latest/files"/>
    <style>.markdown-body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
    @media (max-width: 767px) { .markdown-body { padding: 15px; } }</style>
</head>
<body><main class="markdown-body">
<!--@@ BEGIN CONTENT @@-->
${html}
<!--@@ END   CONTENT @@-->
</main></body>
${highlight ? clientSideHighlightScript : ''}
</html>`
}

function detectIfHighlightRequired(html: string) {
    if (typeof DOMParser === 'undefined') return false

    const parse = new DOMParser()
    const doc = parse.parseFromString(html, 'text/html')
    return !!doc.querySelector('pre > code[class^=language-]')
}
