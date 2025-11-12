"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { DefaultModel } from '@/shared/AiModelsShared'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children, ...props }) {


    const { user } = useUser()
    const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel)
    const [userDetail, setUserDetail] = useState()

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
            const userInfo = userSnap.data()
            setAiSelectedModels(userInfo?.selectedModelPref)
            setUserDetail(userInfo)
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
            setUserDetail(userData)

        }
    }
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>

                <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels }}>
                    <SidebarProvider>
                        <AppSidebar />


                        <div className='w-full'>
                            <AppHeader />
                            {children}
                        </div>
                    </SidebarProvider>

                </AiSelectedModelContext.Provider>
            </UserDetailContext.Provider>



        </NextThemesProvider>

    )
}

export default Provider