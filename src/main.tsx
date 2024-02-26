import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'soda-material/dist/style.css'
import Root from './root.tsx'
import ErrorPage from './error-page.tsx'
import { ProgressIndicator, Card } from 'soda-material'
import { applyThemeForSoda } from 'soda-material/dist/utils/theme.js'
import {
    createBrowserRouter,
    createHashRouter,
    RouterProvider,
    createMemoryRouter,
    type RouteObject,
    Link,
} from 'react-router-dom'

/**
 * Set Theme
 */
applyThemeForSoda(localStorage.getItem('soda-theme-color-hex') || '#ffffff')

const pages: RouteObject[] = Object.entries(
    import.meta.glob('./pages/*.tsx')
).map(([src, getComponent]) => ({
    path: src.replace(/.+\/(.+)\.tsx$/, '/$1'),
    element: (() => {
        const Component = lazy(
            getComponent as () => Promise<{ default: React.ComponentType }>
        )
        return (
            <Suspense
                fallback={
                    <div className="w-full h-full grid place-items-center">
                        <ProgressIndicator variant="circular" />
                    </div>
                }
            >
                <Component />
            </Suspense>
        )
    })(),
}))

pages.push({
    path: '/',
    index: true,
    element: (
        <div className="grid gap-4 md:grid-cols-2 pt-2 md:pt-12">
            {pages
                .map((p) => p.path!)
                .map((path) => (
                    <Link key={path} to={path}>
                        <Card className="p-8" variant="outlined">
                            {path.slice(1)}
                        </Card>
                    </Link>
                ))}
        </div>
    ),
})

//? pick a router (https://reactrouter.com/en/main/routers/picking-a-router)
//? by process.env.ROUTER
const createRouter =
    new Map<string, typeof createBrowserRouter | typeof createHashRouter>([
        ['browser', createBrowserRouter],
        ['hash', createHashRouter],
        ['memory', createMemoryRouter],
    ]).get(process.env.ROUTER!) || createBrowserRouter

const router = createRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: pages,
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
