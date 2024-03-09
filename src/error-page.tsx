import { useRouteError } from 'react-router-dom'
import { Blockquote, Button, Card } from 'soda-material'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = useRouteError() as any
    console.error(error)

    return (
        <div className="container p-4 mx-auto">
            <Card className="min-h-[90vh] p-4" disabled>
                <div>
                    <Blockquote variant="error" close>
                        Sorry, an unexpected error has occurred.
                    </Blockquote>
                </div>
                <div className="grid place-items-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-8">
                        <p className="text-3xl">
                            {error.statusText || error.message}
                        </p>

                        <div>
                            <Button
                                variant="text"
                                onClick={() => {
                                    location.reload()
                                }}
                            >
                                Refresh
                            </Button>
                            <Link to="/">
                                <Button variant="filled">Back Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
