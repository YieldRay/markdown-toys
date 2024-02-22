/**
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/open)
 * @param url
 * A string indicating the URL or path of the resource to be loaded. If an empty string (`""`) is specified or this parameter is omitted, a blank page is opened into the targeted browsing context.
 * @param target
 * A string, without whitespace, specifying the [name](https://developer.mozilla.org/docs/Web/API/Window/name) of the browsing context the resource is being loaded into. If the name doesn't identify an existing context, a new context is created and given the specified name. The special [`target` keywords](https://developer.mozilla.org/docs/Web/HTML/Element/a#target), `_self`, `_blank`, `_parent`, and `_top`, can also be used.
 *
 * This `name` can be used as the target attribute of [<a>](https://developer.mozilla.org/docs/Web/HTML/Element/a#target) or [<form>](https://developer.mozilla.org/docs/Web/HTML/Element/form#target) elements.
 * @param features
 * A string containing a comma-separated list of window features in the form `name=value` — or for boolean features, just name. These features include options such as the window's default size and position, whether or not to open a minimal popup window, and so forth.
 * @returns [WindowProxy](https://developer.mozilla.org/docs/Glossary/WindowProxy)
 */
export function openWindow(
    url?: string | URL,
    target?: string | '_self' | '_blank' | '_parent' | '_top',
    features?: {
        [name: string]: string | number | boolean | undefined
        /**
         * If this feature is enabled, it requests that a minimal popup window be used. The UI features included in the popup window will be automatically decided by the browser, generally including an address bar only.
         *
         * If `popup` is not enabled, and there are no window features declared, the new browsing context will be a tab.
         */
        popup?: 'yes' | true | 'true' | 1 | '1' | ''
        /**
         * Specifies the width of the content area, including scrollbars. The minimum required value is 100.
         */
        width?: number
        /**
         * Specifies the height of the content area, including scrollbars. The minimum required value is 100.
         */
        height?: number
        /**
         * Specifies the distance in pixels from the left side of the work area as defined by the user's operating system where the new window will be generated.
         */
        left?: number
        /**
         * Specifies the distance in pixels from the top side of the work area as defined by the user's operating system where the new window will be generated.
         */
        top?: number
        /**
         * If this feature is set, the new window will not have access to the originating window via [Window.opener](https://developer.mozilla.org/docs/Web/API/Window/opener) and returns `null`.
         *
         * When `noopener` is used, non-empty target names, other than `_top`, `_self`, and `_parent`, are treated like _blank in terms of deciding whether to open a new browsing context.
         */
        noopener?: true | 'true' | 1 | '1' | ''
        /**
         * If this feature is set, the browser will omit the [Referer](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer) header, as well as set noopener to true. See [rel="noreferrer"](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/noreferrer) for more information.
         */
        noreferrer?: true | 'true' | 1 | '1' | ''
    }
): WindowProxy | null {
    return window.open(
        url,
        target,
        features
            ? Object.entries(features)
                  .map(([k, v]) => (v ? `${k}=${v}` : k))
                  .join(',')
            : undefined
    )
}
