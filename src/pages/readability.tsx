import { mdiClose, mdiWeb } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import {
    Blockquote,
    Button,
    Card,
    CircularProgressIndicator,
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
import { html2md } from '../utils/convert'
import { UnwrapPromise } from '../components/Promise'
import { RenderHTML } from '../components/RenderHTML'

export default function HTML2MD() {
    const [url, setURL] = useState('https://ray.deno.dev')
    const [currentURL, setCurrentURL] = useState<string | undefined>(
        'https://ray.deno.dev'
    )
    const [state, setState] = useState<'html' | 'markdown' | 'preview'>(
        'markdown'
    )
    const { data, error, isLoading } = useSWR(currentURL, () =>
        readabilityFromURL(currentURL!)
    )
    const handleClick = () => setCurrentURL(url)
    const handlePreview = () => {
        handleClick()
        setState('preview')
    }
    const handleToHTML = () => {
        handleClick()
        setState('html')
    }
    const handleToMarkdown = () => {
        handleClick()
        setState('markdown')
    }

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
                            onClick={() => setURL('https://')}
                        />
                    }
                    onKeyUp={(e) => e.key === 'Enter' && handleClick()}
                />
                <div className="flex gap-1">
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
                <Blockquote variant="error" close>
                    {String(error)}
                </Blockquote>
            )}

            {data &&
                match(state)
                    .with('markdown', () => (
                        <UnwrapPromise
                            promise={html2md(data.content)}
                            pending={() => (
                                <div className="w-full h-full grid place-items-center">
                                    <CircularProgressIndicator />
                                </div>
                            )}
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
                        <TextField
                            readOnly
                            className="w-full h-full"
                            textarea
                            value={withGfmHTML(data.content)}
                        />
                    ))
                    .with('preview', () => (
                        <RenderHTML html={withGfmHTML(data.content)} />
                    ))
                    .exhaustive()}
        </div>
    )
}
