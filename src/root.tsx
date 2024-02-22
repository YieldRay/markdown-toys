import { useState } from 'react'
import {
    Divider,
    IconButton,
    NavigationDrawer,
    NavigationDrawerItem,
    TopAppBar,
} from 'soda-material'
import { useWindowSizeType } from 'soda-material/dist/hooks/use-media-query'
import {
    mdiMenu,
    mdiDotsVertical,
    mdiLanguageMarkdown,
    mdiLanguageMarkdownOutline,
    mdiFormatHeaderPound,
    mdiRead,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { Outlet, Link } from 'react-router-dom'

export default function Root({
    children,
}: { children?: React.ReactNode } = {}) {
    const isScreenExpanded = useWindowSizeType() === 'expanded'
    const [open, setOpen] = useState(isScreenExpanded)
    return (
        <>
            <TopAppBar
                leadingNavigationIcon={
                    <IconButton path={mdiMenu} onClick={() => setOpen(!open)} />
                }
                trailingIcon={<IconButton path={mdiDotsVertical} />}
            >
                <Link to="/">Markdown Toys</Link>
            </TopAppBar>
            <div className="flex h-full">
                <NavigationDrawer
                    modal={!isScreenExpanded}
                    open={open}
                    onScrimClick={() => setOpen(false)}
                    headline="功能"
                    onClick={(e: Event) => {
                        if (!isScreenExpanded) {
                            const el = e.target as HTMLElement

                            if (
                                el.classList.contains(
                                    'sd-navigation_drawer_item'
                                )
                            ) {
                                setOpen(false)
                            }
                        }
                    }}
                >
                    <Link to="/md2html">
                        <NavigationDrawerItem
                            icon={<Icon path={mdiLanguageMarkdown}></Icon>}
                        >
                            Markdown 转 HTML
                        </NavigationDrawerItem>
                    </Link>
                    <Link to="/html2md">
                        <NavigationDrawerItem
                            icon={
                                <Icon path={mdiLanguageMarkdownOutline}></Icon>
                            }
                        >
                            HTML 转 Markdown
                        </NavigationDrawerItem>
                    </Link>
                    <Link to="/render">
                        <NavigationDrawerItem
                            icon={<Icon path={mdiFormatHeaderPound}></Icon>}
                        >
                            渲染 Markdown
                        </NavigationDrawerItem>
                    </Link>
                    <Link to="/readability">
                        <NavigationDrawerItem
                            icon={<Icon path={mdiRead}></Icon>}
                        >
                            网页可读化
                        </NavigationDrawerItem>
                    </Link>
                    <Divider />
                    <small>
                        Made by <a href="https://ray.deno.dev">YieldRay</a>
                    </small>
                </NavigationDrawer>
                <main className="flex-1 h-full p-4 overflow-auto">
                    {children || <Outlet />}
                </main>
            </div>
        </>
    )
}
