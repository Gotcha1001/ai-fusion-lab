// "use client"
// import { Button } from "@/components/ui/button"
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarHeader,
// } from "@/components/ui/sidebar"
// import { SignInButton, useUser } from "@clerk/nextjs"
// import { Bolt, Moon, Sun, User2, Zap } from "lucide-react"
// import { useTheme } from "next-themes"
// import Image from "next/image"
// import UsageCreditProgress from "./UsageCreditProgress"

// export function AppSidebar() {
//     const { theme, setTheme } = useTheme()

//     const { user } = useUser()
//     return (
//         <Sidebar>
//             <SidebarHeader>
//                 <div className="p-3">
//                     <div className="flex justify-between items-center gap-1">
//                         <div className="">
//                             <Image src={"/1.jpg"} alt="Logo" height={200} width={200} className="rounded-lg" />
//                         </div>  <div>
//                             {theme === "light" ? <Button
//                                 onClick={() => setTheme('dark')}
//                                 variant="ghost"><Sun className="text-yellow-400" /></Button> : <Button
//                                     onClick={() => setTheme("light")}
//                                     variant="ghost"><Moon className="text-yellow-400" /></Button>}
//                         </div>
//                     </div>
//                     {user ? <Button size={"lg"} variant={"work"} className="mt-7 w-full">+ New Chat</Button>
//                         :
//                         <SignInButton>
//                             <Button size={"lg"} variant={"work"} className="mt-7 w-full">+ New Chat</Button>
//                         </SignInButton>
//                     }
//                 </div>


//             </SidebarHeader>
//             <SidebarContent>
//                 <SidebarGroup>
//                     <div className="p-3">
//                         <h2 className="font-bold text-lg">Chat</h2>
//                         {!user && <p className="text-sm text-gray-400">Sign in to start chatting with multiple AI Models</p>}
//                     </div>

//                 </SidebarGroup>

//             </SidebarContent>
//             <SidebarFooter>
//                 <div className="p-3 mb-10">
//                     {!user ? <SignInButton mode="modal">
//                         <Button variant={"work2"} className={"w-full"} size={"lg"}>Sign In/Sign Up</Button>
//                     </SignInButton>
//                         :
//                         <div>
//                             <UsageCreditProgress />
//                             <Button className={"w-full mb-3"}><Zap />Upgrade Plan</Button>
//                             <Button className="flex w-full"><User2 /><h2>Settings</h2></Button>
//                         </div>

//                     }

//                 </div>
//             </SidebarFooter>
//         </Sidebar>
//     )
// }



"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { SignInButton, useUser } from "@clerk/nextjs"
import { Bolt, Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import UsageCreditProgress from "./UsageCreditProgress"

export function AppSidebar() {
    const { theme, setTheme } = useTheme()
    const { user } = useUser()

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-3">
                    <div className="flex justify-between items-center gap-1">
                        <div>
                            <Image
                                src={"/1.jpg"}
                                alt="Logo"
                                height={200}
                                width={200}
                                className="rounded-lg"
                            />
                        </div>
                        <div>
                            {mounted && (
                                theme === "light" ? (
                                    <Button onClick={() => setTheme("dark")} variant="ghost">
                                        <Sun className="text-yellow-400" />
                                    </Button>
                                ) : (
                                    <Button onClick={() => setTheme("light")} variant="ghost">
                                        <Moon className="text-yellow-400" />
                                    </Button>
                                )
                            )}
                        </div>
                    </div>

                    {user ? (
                        <Button size={"lg"} variant={"work"} className="mt-7 w-full">
                            + New Chat
                        </Button>
                    ) : (
                        <SignInButton>
                            <Button size={"lg"} variant={"work"} className="mt-7 w-full">
                                + New Chat
                            </Button>
                        </SignInButton>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <div className="p-3">
                        <h2 className="font-bold text-lg">Chat</h2>
                        {!user && (
                            <p className="text-sm text-gray-400">
                                Sign in to start chatting with multiple AI Models
                            </p>
                        )}
                    </div>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-3 mb-10">
                    {!user ? (
                        <SignInButton mode="modal">
                            <Button variant={"work2"} className={"w-full"} size={"lg"}>
                                Sign In/Sign Up
                            </Button>
                        </SignInButton>
                    ) : (
                        <div>
                            <UsageCreditProgress />
                            <Button className={"w-full mb-3"}>
                                <Zap />
                                Upgrade Plan
                            </Button>
                            <Button className="flex w-full">
                                <User2 />
                                <h2>Settings</h2>
                            </Button>
                        </div>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
