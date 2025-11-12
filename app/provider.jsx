"use client"
import React, { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'

function Provider({ children, ...props }) {


    const { user } = useUser()

    useEffect(() => {
        if (user) {
            CreateNewUser()
        }
    }, [user])

    const CreateNewUser = async () => {
        //1. If the user exists 
        const userRef = doc(db, "user", user?.primaryEmailAddress?.emailAddress)
        //2. Get the document
        const userSnap = await getDoc(userRef)
        //3. Check if user is there
        if (userSnap.exists()) {
            console.log("Existing User")
            return;
        } else {
            //4 If the user doesnt exist save that information 
            const userData = {
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                createdAt: new Date(),
                remainingMsg: 5,  // Only for the free user
                plan: 'Free',
                credits: 1000  // Paid users
            }

            //5 Then add the information 
            await setDoc(userRef, userData)
            console.log("New User data saved")

        }



    }
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}>
            <SidebarProvider>
                <AppSidebar />


                <div className='w-full'>
                    <AppHeader />
                    {children}
                </div>
            </SidebarProvider>

        </NextThemesProvider>

    )
}

export default Provider