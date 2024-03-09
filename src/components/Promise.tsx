import { useEffect, useState } from 'react'
import { Blockquote, CircularProgressIndicator } from 'soda-material'

export function UnwrapPromise<T = unknown>({
    promise,
    resolve,
    pending,
    reject,
}: {
    promise: Promise<T> | T
    pending?: () => React.ReactNode
    resolve?: (value: T) => React.ReactNode
    reject?: (reason: unknown) => React.ReactNode
}) {
    const [state, setState] = useState<'pending' | 'rejected' | 'resolved'>(
        promise instanceof Promise ? 'pending' : 'resolved'
    )
    useEffect(() => {
        if (!(promise instanceof Promise)) {
            return
        }

        promise.then(
            (value) => {
                setValue(value)
                setState('resolved')
            },
            (reason: unknown) => {
                setReason(reason)
                setState('rejected')
            }
        )
    }, [promise])

    const [value, setValue] = useState<T | undefined>(
        promise instanceof Promise ? undefined : promise
    )

    const [reason, setReason] = useState<unknown>()

    switch (state) {
        case 'pending':
            return pending ? (
                pending()
            ) : (
                <div className="w-full h-full grid place-items-center">
                    <CircularProgressIndicator />
                </div>
            )
        case 'rejected':
            return reject ? (
                reject(reason)
            ) : (
                <div>
                    <Blockquote variant="error">{String(reason)}</Blockquote>
                </div>
            )
        case 'resolved':
            return resolve?.(value!)
    }
}
