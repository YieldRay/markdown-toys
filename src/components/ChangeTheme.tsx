import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { applyThemeForSoda } from 'soda-material/dist/utils/theme.js'

export default function ChangeTheme() {
    const [color, setColor] = useState('#aabbcc')
    const onChange = (color: string) => {
        setColor(color)
        applyThemeForSoda(color)
        localStorage.setItem('soda-theme-color-hex', color)
    }

    return <HexColorPicker color={color} onChange={onChange} />
}
