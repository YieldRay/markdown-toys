import { LinearProgressIndicator, Scrim, Card, Blockquote } from 'soda-material'
import { Portal } from 'soda-material/dist/utils/Portal'

export default function LoadingSheet({
    open,
    children,
}: {
    open: boolean
    children: React.ReactNode
}) {
    return (
        open && (
            <Portal container={document.body}>
                <Scrim center open={open}>
                    <Card
                        style={{
                            padding: '0.5rem',
                        }}
                    >
                        <div>{children}</div>
                        <LinearProgressIndicator />
                    </Card>
                </Scrim>
            </Portal>
        )
    )
}

export function SimpleError({ error }: { error?: unknown }) {
    return (
        Boolean(error) && (
            <div>
                <Blockquote variant="error" close>
                    <div>
                        An irreparable error has occurred! Kindly attempt to
                        refresh the page.
                    </div>
                    <div>{String(error)}</div>
                </Blockquote>
            </div>
        )
    )
}
