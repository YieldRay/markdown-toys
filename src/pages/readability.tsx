import { mdiClose, mdiWeb } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { Button, Checkbox, IconRippleButton, TextField } from 'soda-material'
import useSWRImmutable from 'swr/immutable'
import useSWR from 'swr'
import { match } from 'ts-pattern'
import { readabilityFromURL, isURL } from '../utils/readability'
import { withGfmHTML } from '../utils/render'
import { html2md, md2html } from '../utils/convert'
import translate from '../utils/translate'
import { UnwrapPromise } from '../components/Promise'
import { RenderHTML } from '../components/RenderHTML'
import { useSearchParams } from 'react-router-dom'
import LoadingSheet, { SimpleError } from '../components/LoadingSheet'

const INIT_URL = 'https://example.net/'
const STATE = ['html', 'markdown', 'preview'] as const

export default function HTML2MD() {
    const [searchParams, setSearchParams] = useSearchParams()
    const _url = searchParams.has('url') ? searchParams.get('url')! : INIT_URL
    const _state = STATE.includes(searchParams.get('state') as any)
        ? (searchParams.get('state') as (typeof STATE)[number])
        : 'markdown'
    const _translate = searchParams.get('translate') === 'true'

    const [url, setURL] = useState(_url)
    const [currentURL, setCurrentURL] = useState<string | undefined>(_url)
    const [state, setState] = useState<(typeof STATE)[number]>(_state)
    const [isTranslate, setTranslate] = useState(_translate)

    const {
        data: readabilityData,
        error: readabilityError,
        isLoading: readabilityLoading,
    } = useSWR(isURL(currentURL) && currentURL, () =>
        readabilityFromURL(currentURL!)
    )

    const {
        data: translatedMarkdown,
        error: translateError,
        isLoading: translateLoading,
    } = useSWRImmutable(
        () => isTranslate && readabilityData?.content,
        async () => await translate(await html2md(readabilityData!.content))
    )

    const updateURL = () => {
        if (url !== currentURL) setCurrentURL(url)
    }
    const handlePreview = () => {
        updateURL()
        setState('preview')
    }
    const handleToHTML = () => {
        updateURL()
        setState('html')
    }
    const handleToMarkdown = () => {
        updateURL()
        setState('markdown')
    }

    useEffect(() => {
        const key = new URLSearchParams({
            url: currentURL || '',
            state,
            translate: String(isTranslate),
        }).toString()
        if (searchParams.toString() !== key) setSearchParams(key)
    }, [currentURL, url, isTranslate, state, searchParams, setSearchParams])

    const withLayout = (children: React.ReactNode) => (
        <div className="h-full grid grid-rows-[auto_1fr]">
            {
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
                        onKeyUp={(e) => e.key === 'Enter' && updateURL()}
                    />
                    <div className="flex gap-1 items-center">
                        <div
                            className="cursor-pointer select-none flex items-center gap-1"
                            onClick={() => setTranslate((x) => !x)}
                        >
                            <Checkbox checked={isTranslate} />

                            <span className="inline-flex flex-col text-xs text-balance">
                                <small>中文翻译</small>
                                <small>(Slow)</small>
                            </span>
                        </div>
                        <Button variant="filled" onClick={handlePreview}>
                            Preview
                        </Button>
                        <Button variant="tonal" onClick={handleToHTML}>
                            to HTML
                        </Button>
                        <Button
                            variant="tonal"
                            onClick={handleToMarkdown}
                            className="break-none"
                        >
                            to Markdown
                        </Button>
                    </div>
                </div>
            }
            {children}
        </div>
    )

    if (readabilityError || translateError)
        return withLayout(
            <>
                <SimpleError error={readabilityError} />
                <SimpleError error={translateError} />
            </>
        )

    if (readabilityLoading || translateLoading)
        return withLayout(
            <>
                <LoadingSheet open={readabilityLoading}>
                    Fetching...Please wait...
                </LoadingSheet>
                <LoadingSheet open={translateLoading}>
                    Translating...Please wait...
                </LoadingSheet>
            </>
        )

    return withLayout(
        <>
            {isTranslate
                ? match(state)
                      .with('markdown', () => (
                          <TextField
                              readOnly
                              className="w-full h-full"
                              textarea
                              value={translatedMarkdown!}
                          />
                      ))
                      .with('html', () => (
                          <UnwrapPromise
                              promise={md2html(translatedMarkdown!)}
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
                              promise={md2html(translatedMarkdown!)}
                              resolve={(value) => (
                                  <RenderHTML html={withGfmHTML(value)} />
                              )}
                          />
                      ))
                      .exhaustive()
                : //? NOT translate

                  match(state)
                      .with('markdown', () => (
                          <UnwrapPromise
                              promise={html2md(readabilityData!.content)}
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
                              value={withGfmHTML(readabilityData!.content)}
                          />
                      ))
                      .with('preview', () => (
                          <RenderHTML
                              html={withGfmHTML(readabilityData!.content)}
                          />
                      ))
                      .exhaustive()}
        </>
    )
}
