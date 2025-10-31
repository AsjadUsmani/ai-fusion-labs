import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"

const Provider = ({
    children,
    ...props
}) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}>{children}
        </NextThemesProvider>
    )
}

export default Provider
