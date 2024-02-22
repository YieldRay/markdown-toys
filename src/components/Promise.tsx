import { useEffect, useState } from 'react'

export function UnwrapPromise<T = unknown>({
    promise,
    resolve,
    pending,
    reject,
}: {
    promise: Promise<T>
    pending?: () => React.ReactNode
    resolve?: (value: T) => React.ReactNode
    reject?: (reason: unknown) => React.ReactNode
}) {
    const [state, setState] = useState<'pending' | 'rejected' | 'resolved'>(
        'pending'
    )
    useEffect(() => {
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
    const [value, setValue] = useState<T>()
    const [reason, setReason] = useState<unknown>()

    switch (state) {
        case 'pending':
            return pending?.()
        case 'rejected':
            return reject?.(reason)
        case 'resolved':
            return resolve?.(value!)
    }
}
