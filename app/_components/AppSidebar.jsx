"use client";
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { SignInButton, useUser } from "@clerk/nextjs";
import { Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import UsageCreditProgress from "./UsageCreditProgress";

export function AppSidebar() {
    const { theme, setTheme } = useTheme();
    const { user } = useUser();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-2">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <Image src={'/logo.svg'} alt="logo" width={40} height={40} />
                            <h2 className="font-bold text-xl">AI Fusion</h2>
                        </div>
                        <div className="flex items-center">
                            {theme == 'light' ? <Button variant={'ghost'} onClick={() => setTheme('dark')} className={`w-8 h-8`}>{<Sun />}</Button> : <Button variant={'ghost'} onClick={() => setTheme('light')} className={`w-8 h-8`}>{<Moon />}</Button>}
                        </div>
                    </div>
                    <div>
                        {user ? <Button className='mt-5 w-full'>+ New Chat</Button> : <SignInButton>
                            <Button className='mt-5 w-full'>+ New Chat</Button>
                        </SignInButton>}
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="p-2">
                        <h2 className="text-xl font-bold pt-5">Chat</h2>
                        {!user && <p className="text-sm text-gray-500">Sign in to chat with multiple AI Models.</p>}
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter >
                <div className="mb-10 p-2">
                    {
                        user ?
                            <div>
                                <UsageCreditProgress />
                                <Button className={`w-full mb-3`}><Zap /> Upgrade Plan</Button>
                                <Button variant={`ghost`} className="flex items-center w-full">
                                    <User2 />
                                    <h2>Settings</h2>
                                </Button>
                            </div>
                            : <SignInButton mode="modal">
                                <Button className={`w-full`}>Sign In/Sign Up</Button>
                            </SignInButton>
                    }
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}