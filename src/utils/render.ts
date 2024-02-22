const clientSideHighlightPreload = String.raw`
<link rel="preload" as="module" href="https://esm.sh/@wooorm/starry-night@3?bundle" />
<link rel="preload" as="module" href="https://esm.sh/hast-util-to-dom@4?bundle" />`

const clientSideHighlightScript = String.raw`<script type="module">
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
</script>`

export function withGfmHTML(
    html: string,
    {
        title,
        highlight,
    }: {
        title?: string
        highlight?: boolean
        allowDangerousHtml?: boolean
    } = {}
) {
    return String.raw`<!DOCTYPE html>
<html lang="en">
<head>${title ? `<title>${title}</title>` : ''}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preload" as="style" href="https://registry.npmmirror.com/github-markdown-css/latest/files"/>
    ${highlight ? clientSideHighlightPreload : ''}
    <link rel="stylesheet" href="https://registry.npmmirror.com/github-markdown-css/latest/files"/>
    <style>.markdown-body { box-sizing: border-box; min-width: 200px;max-width: 980px;margin: 0 auto;padding: 45px; }
    @media (max-width: 767px) { .markdown-body { padding: 15px; } }</style>
</head>
<body><article class="markdown-body">
<!--!!!!! BEGIN CONTENT !!!!!-->
${html}
<!--!!!!! END   CONTENT !!!!!-->
</article></body>
${highlight ? clientSideHighlightScript : ''}
</html>`
}
