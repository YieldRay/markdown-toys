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
                    <div>无法恢复的错误！请尝试刷新页面</div>
                    <div>{String(error)}</div>
                </Blockquote>
            </div>
        )
    )
}
