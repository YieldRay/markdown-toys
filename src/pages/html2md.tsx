import { useCallback, useEffect, useRef, useState } from 'react'
import { TextField, IconButton, Switch, Snackbar } from 'soda-material'
import { mdiContentCopy, mdiSync } from '@mdi/js'
import { html2md } from '../utils/convert'
import { copy } from '../utils/copy'
import { Portal } from 'soda-material/dist/utils/Portal'

export default function HTML2MD() {
    const [isAutoSync, setAutoSync] = useState(true)
    const [html, setHtml] = useState(`<h1>HTML!</h1>`)
    const [markdown, setMarkdown] = useState('')

    const handleConvert = useCallback(async () => {
        setMarkdown(await html2md(html))
    }, [html])

    useEffect(() => {
        if (isAutoSync) handleConvert()
    }, [isAutoSync, handleConvert])

    const timerRef = useRef<number | undefined>(undefined)
    const [isSnackbarOpen, setSnackbarOpen] = useState(false)
    const showCopied = () => {
        copy(markdown)
        setSnackbarOpen(true)
        clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => setSnackbarOpen(false), 3000)
    }

    return (
        <div className="grid grid-rows-[1fr_auto_1fr] md:grid-rows-[1fr] md:grid-cols-[1fr_auto_1fr] gap-1 h-full">
            <TextField
                textarea
                labelText="HTML"
                placeholder="Enter HTML here"
                value={html}
                onChange={setHtml}
            />
            <div className="flex flex-row md:flex-col justify-center items-center gap-2">
                <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={handleConvert}
                >
                    <IconButton path={mdiSync} />
                    <small>Convert</small>
                </div>
                <div className="flex flex-col items-center">
                    <Switch checked={isAutoSync} onChange={setAutoSync} />
                    <small className="leading-3 py-1">
                        Auto
                        <br />
                        Sync
                    </small>
                </div>
                <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={showCopied}
                >
                    <IconButton path={mdiContentCopy} />
                    <small className="leading-3 py-1 text-center">
                        Copy
                        <br />
                        Markdown
                    </small>
                </div>
            </div>
            <TextField
                textarea
                labelText="Markdown"
                placeholder="Generated Markdown"
                value={markdown}
            />

            <Portal container={document.body}>
                <Snackbar
                    fixed
                    open={isSnackbarOpen}
                    full
                    onCloseClick={() => setSnackbarOpen(false)}
                >
                    Copied!
                </Snackbar>
            </Portal>
        </div>
    )
}
