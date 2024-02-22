import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'soda-material/dist/style.css'
import Root from './root.tsx'
import ErrorPage from './error-page.tsx'
import { applyThemeForSoda } from 'soda-material/dist/utils/theme.js'
import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
} from 'react-router-dom'

/**
 * Set Theme
 */
applyThemeForSoda(localStorage.getItem('soda-theme-color-hex') || '#ffffff')

const pages: RouteObject[] = Object.entries(
    import.meta.glob('./pages/*.tsx')
).map(([src, getComponent]) => ({
    path: src.replace(/.+\/(.+)\.tsx$/, '/$1'),
    async lazy() {
        const { default: Component } = (await getComponent()) as any
        return { Component }
    },
}))

pages[0].index = true

const router = createBrowserRouter([
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
