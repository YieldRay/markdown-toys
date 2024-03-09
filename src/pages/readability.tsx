import { mdiClose, mdiWeb } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import {
    Blockquote,
    Button,
    Card,
    Checkbox,
    IconRippleButton,
    LinearProgressIndicator,
    Scrim,
    TextField,
} from 'soda-material'
import { readabilityFromURL } from '../utils/readability'
import { Portal } from 'soda-material/dist/utils/Portal'
import useSWR from 'swr'
import { match } from 'ts-pattern'
import { withGfmHTML } from '../utils/render'
import { html2md, md2html } from '../utils/convert'
import translate from '../utils/translate'
import { UnwrapPromise } from '../components/Promise'
import { RenderHTML } from '../components/RenderHTML'

const initURL = 'https://example.net/'

export default function HTML2MD() {
    const [url, setURL] = useState(initURL)
    const [currentURL, setCurrentURL] = useState<string | undefined>(initURL)
    const [state, setState] = useState<'html' | 'markdown' | 'preview'>(
        'markdown'
    )
    const [isTranslate, setTranslate] = useState(false)
    const { data, error, isLoading } = useSWR(currentURL, () =>
        readabilityFromURL(currentURL!)
    )

    const handlePreview = () => {
        setCurrentURL(url)
        setState('preview')
    }
    const handleToHTML = () => {
        setCurrentURL(url)
        setState('html')
    }
    const handleToMarkdown = () => {
        setCurrentURL(url)
        setState('markdown')
    }

    const key = new URLSearchParams({
        url: currentURL || '',
        state,
        t: String(isTranslate),
    }).toString()

    return (
        <div className="h-full grid grid-rows-[auto_1fr]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <TextField
                    className="flex-1 w-full"
                    variant="outlined"
                    labelText="URL"
                    value={url}
                    onChange={setURL}
                    leadingIcon={<Icon path={mdiWeb} />}
                    trailingIcon={
                        <IconRippleButton
                            path={mdiClose}
                            onClick={() => setURL('')}
                        />
                    }
                    onKeyUp={(e) => e.key === 'Enter' && setCurrentURL(url)}
                />
                <div className="flex gap-1 items-center">
                    <div
                        className="cursor-pointer select-none flex items-center gap-1"
                        onClick={() => setTranslate((x) => !x)}
                    >
                        <Checkbox checked={isTranslate} />

                        <span className="inline-flex flex-col text-xs">
                            <small>中文翻译</small>
                            <small>(Slow)</small>
                        </span>
                    </div>
                    <Button variant="filled" onClick={handlePreview}>
                        Preview
                    </Button>
                    <Button variant="tonal" onClick={handleToHTML}>
                        To HTML
                    </Button>
                    <Button variant="tonal" onClick={handleToMarkdown}>
                        To Markdown
                    </Button>
                </div>
            </div>

            {isLoading && (
                <Portal container={document.body}>
                    <Scrim center open={true}>
                        <Card
                            style={{
                                padding: '0.5rem',
                            }}
                        >
                            <div>Fetching...Please wait...</div>
                            <LinearProgressIndicator />
                        </Card>
                    </Scrim>
                </Portal>
            )}

            {error && (
                <div>
                    <Blockquote variant="error" close>
                        {String(error)}
                    </Blockquote>
                </div>
            )}

            {data &&
                match(state)
                    .with('markdown', () => (
                        <UnwrapPromise
                            key={key}
                            promise={
                                isTranslate
                                    ? html2md(data.content).then(translate)
                                    : html2md(data.content)
                            }
                            resolve={(value) => (
                                <TextField
                                    readOnly
                                    className="w-full h-full"
                                    textarea
                                    value={value}
                                />
                            )}
                        />
                    ))
                    .with('html', () => (
                        <UnwrapPromise
                            key={key}
                            promise={
                                isTranslate
                                    ? html2md(data.content)
                                          .then(translate)
                                          .then(md2html)
                                    : data.content
                            }
                            resolve={(value) => (
                                <TextField
                                    readOnly
                                    className="w-full h-full"
                                    textarea
                                    value={withGfmHTML(value)}
                                />
                            )}
                        />
                    ))
                    .with('preview', () => (
                        <UnwrapPromise
                            key={key}
                            promise={
                                isTranslate
                                    ? html2md(data.content)
                                          .then(translate)
                                          .then(md2html)
                                    : data.content
                            }
                            resolve={(value) => (
                                <RenderHTML html={withGfmHTML(value)} />
                            )}
                        />
                    ))
                    .exhaustive()}
        </div>
    )
}
