"use client";
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

export function AppSidebar() {
    const { theme, setTheme } = useTheme();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-2">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <Image src={'/logo.svg'} width={40} height={40} />
                            <h2 className="font-bold text-xl">AI Fusion</h2>
                        </div>
                        <div className="flex items-center">
                            {theme == 'light' ? <Button variant={'ghost'} onClick={() => setTheme('dark')} className={`w-8 h-8`}>{<Sun />}</Button> : <Button variant={'ghost'} onClick={() => setTheme('light')} className={`w-8 h-8`}>{<Moon />}</Button>}
                        </div>
                    </div>
                    <div>
                        <Button className='mt-5 w-full'>+ New Chat</Button>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="p-2">
                        <h2 className="text-xl font-bold pt-5">Chat</h2>
                        <p className="text-sm text-gray-500">Sign in to chat with multiple AI Models.</p>
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter >
                <div className="mb-10 p-2">
                    <Button className={`w-full`}>Sign In/Sign Up</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}