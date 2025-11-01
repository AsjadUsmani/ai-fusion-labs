import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

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
            {...props}>
            <SidebarProvider>
                <div className="flex w-full">
                    {/* Sidebar on the left */}
                    <AppSidebar />

                    {/* Main content on the right */}
                    <div className="flex flex-col w-full">
                        <AppHeader />
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </NextThemesProvider>
    )
}

export default Provider
