import { useRef, useState } from 'react'
import {
    BottomSheet,
    type BottomSheetHandle,
    Divider,
    IconButton,
    NavigationDrawer,
    NavigationDrawerItem,
    TopAppBar,
    TooltipHolder,
    PlainTooltip,
    Menu,
    MenuItem,
    PopoverHolder,
    Scrim,
    Dialog,
    Button,
    Table,
} from 'soda-material'
import { useWindowSizeType } from 'soda-material/dist/hooks/use-media-query'
import { useFullscreen } from 'soda-material/dist/hooks/use-fullscreen'
import {
    mdiMenu,
    mdiDotsVertical,
    mdiLanguageMarkdown,
    mdiLanguageMarkdownOutline,
    mdiFormatHeaderPound,
    mdiRead,
    mdiFullscreenExit,
    mdiFullscreen,
    mdiPaletteOutline,
    mdiInformationOutline,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import ChangeTheme from './components/ChangeTheme'

export default function Root({
    children,
}: { children?: React.ReactNode } = {}) {
    const isScreenExpanded = useWindowSizeType() === 'expanded'
    const [open, setOpen] = useState(isScreenExpanded)
    const bshRef = useRef<BottomSheetHandle>(null)
    const fullscreenRef = useRef(document.documentElement)
    const [fullscreen, setFullscreen] = useFullscreen(fullscreenRef)
    const [dialogOpen, setDialogOpen] = useState(false)
    const location = useLocation()

    function DrawerItem({
        to,
        path,
        children,
    }: {
        to: string
        path: string
        children: React.ReactNode
    }) {
        return (
            <Link
                to={to}
                onClick={() => {
                    if (!isScreenExpanded) setOpen(false)
                }}
            >
                <NavigationDrawerItem
                    icon={<Icon path={path} />}
                    active={location.pathname === to}
                >
                    {children}
                </NavigationDrawerItem>
            </Link>
        )
    }

    return (
        <>
            <TopAppBar
                leadingNavigationIcon={
                    <IconButton path={mdiMenu} onClick={() => setOpen(!open)} />
                }
                trailingIcon={
                    <>
                        <TooltipHolder
                            trigger={
                                <IconButton
                                    path={
                                        fullscreen
                                            ? mdiFullscreenExit
                                            : mdiFullscreen
                                    }
                                    onClick={() => {
                                        setFullscreen(!fullscreen)
                                    }}
                                />
                            }
                            content={<PlainTooltip>fullscreen</PlainTooltip>}
                        />
                        <PopoverHolder
                            trigger={<IconButton path={mdiDotsVertical} />}
                            placement="bottom-end"
                            content={
                                <Menu>
                                    <MenuItem
                                        leadingIcon={
                                            <Icon path={mdiPaletteOutline} />
                                        }
                                        onClick={() => bshRef.current?.show()}
                                    >
                                        Theme
                                    </MenuItem>
                                    <MenuItem
                                        leadingIcon={
                                            <Icon
                                                path={mdiInformationOutline}
                                            />
                                        }
                                        onClick={() => setDialogOpen(true)}
                                    >
                                        Info
                                    </MenuItem>
                                </Menu>
                            }
                        />
                    </>
                }
            >
                <Link to="/">Markdown Toys</Link>
            </TopAppBar>
            <div className="flex h-full">
                <NavigationDrawer
                    modal={!isScreenExpanded}
                    open={open}
                    onScrimClick={() => setOpen(false)}
                    headline="Navigation"
                >
                    <DrawerItem to="/md2html" path={mdiLanguageMarkdown}>
                        Markdown to HTML
                    </DrawerItem>
                    <DrawerItem to="/html2md" path={mdiLanguageMarkdownOutline}>
                        HTML to Markdown
                    </DrawerItem>
                    <DrawerItem to="/render" path={mdiFormatHeaderPound}>
                        Render Markdown
                    </DrawerItem>
                    <DrawerItem to="/readability" path={mdiRead}>
                        Website Readability
                    </DrawerItem>

                    <Divider />
                    <small>
                        Made by{' '}
                        <a
                            href="https://ray.deno.dev"
                            target="_blank"
                            className="text-blue-500"
                        >
                            YieldRay
                        </a>
                    </small>
                    <br />
                    <small>
                        Powered by{' '}
                        <a
                            href="https://github.com/YieldRay/soda"
                            target="_blank"
                            className="text-blue-500"
                        >
                            soda-material
                        </a>
                    </small>
                    <br />
                    <small>
                        Source code available at{' '}
                        <a
                            href="https://github.com/YieldRay/markdown-toys"
                            target="_blank"
                            className="text-blue-500"
                        >
                            Github
                        </a>
                    </small>
                </NavigationDrawer>
                <main className="flex-1 h-full p-4 overflow-auto">
                    {children || <Outlet />}
                </main>
            </div>
            {/*  */}
            <BottomSheet
                fixed
                ref={bshRef}
                onScrimClick={() => bshRef.current?.hide()}
            >
                <div className="min-h-[50vh] p-8 grid place-items-center">
                    <span className="font-bold text-sm my-2">
                        Pick your theme
                    </span>
                    <ChangeTheme />
                </div>
            </BottomSheet>
            <Scrim
                center
                zIndex={999}
                open={dialogOpen}
                onScrimClick={() => setDialogOpen(false)}
            >
                <Dialog
                    headline="Build Info"
                    buttons={
                        <Button
                            variant="text"
                            onClick={() => setDialogOpen(false)}
                        >
                            Close
                        </Button>
                    }
                >
                    <Table>
                        <caption>
                            dependencies&nbsp;
                            <code>
                                {__BRANCH__ + '@' + __HEAD__.slice(0, 7)}
                            </code>
                        </caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Version</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(__PKG__.dependencies).map(
                                ([name, version]) => (
                                    <tr key={name}>
                                        <td>{name}</td>
                                        <td>{version as string}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                </Dialog>
            </Scrim>
        </>
    )
}
