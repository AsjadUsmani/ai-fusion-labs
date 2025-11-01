'use client'
import React, { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'

const Provider = ({
    children,
    ...props
}) => {
    const {user} = useUser();

    const createNewUser = async() => {
        const userRef = doc(db, 'users', user?.primaryEmailAddress.emailAddress)
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            console.log("Existes user.")
            return;
        } else {
            const userData = {
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                createdAt: new Date(),
                remainingMsg: 5,
                plan: 'Free',
                credits: 1000 
            }
            await setDoc(userRef, userData);
            console.log("New User Data Saved");
        }
    }
    useEffect(() => {
        if(user){
            createNewUser();
        }
    }, [user]);
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
