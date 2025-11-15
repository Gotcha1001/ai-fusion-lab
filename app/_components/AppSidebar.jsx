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



// "use client"

// import { useEffect, useState } from "react"
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
// import { collection, getDocs, query, where } from "firebase/firestore"
// import { db } from "@/config/FirebaseConfig"
// import moment from "moment/moment"
// import { Separator } from "@/components/ui/separator"
// import Link from "next/link"

// export function AppSidebar() {
//     const { theme, setTheme } = useTheme()
//     const { user } = useUser()

//     const [chatHistory, setChatHistory] = useState([])


//     useEffect(() => {
//         user && GetChatHistory()
//     }, [user])

//     const GetChatHistory = async () => {
//         const q = query(collection(db, "chatHistory"), where("userEmail", '==', user?.primaryEmailAddress.emailAddress))
//         const querySnapshot = await getDocs(q)

//         querySnapshot.forEach((doc) => {
//             console.log("CHAT:", doc.id, doc.data())
//             setChatHistory(prev => [...prev, doc.data()])
//         })
//     }

//     const [mounted, setMounted] = useState(false)
//     useEffect(() => setMounted(true), [])

//     const GetLastUserMessageFromChat = (chat) => {

//         const allMessages = Object.values(chat.messages).flat()
//         const userMessages = allMessages.filter(msg => msg.role == 'user')

//         const lastUserMsg = userMessages[userMessages.length - 1].content || null;

//         const lastUpdated = chat.lastUpdated || Date.now()
//         const formattedDate = moment(lastUpdated).fromNow()

//         return {
//             chatId: chat.chatId,
//             message: lastUserMsg,
//             lastMsgDate: formattedDate
//         }
//     }


//     return (
//         <Sidebar>
//             <SidebarHeader>
//                 <div className="p-3">
//                     <div className="flex justify-between items-center gap-1">
//                         <div>
//                             <Image
//                                 src={"/1.jpg"}
//                                 alt="Logo"
//                                 height={200}
//                                 width={200}
//                                 className="rounded-lg"
//                             />
//                         </div>
//                         <div>
//                             {mounted && (
//                                 theme === "light" ? (
//                                     <Button onClick={() => setTheme("dark")} variant="ghost">
//                                         <Sun className="text-yellow-400" />
//                                     </Button>
//                                 ) : (
//                                     <Button onClick={() => setTheme("light")} variant="ghost">
//                                         <Moon className="text-yellow-400" />
//                                     </Button>
//                                 )
//                             )}
//                         </div>
//                     </div>

//                     {user ? (
//                         <Button size={"lg"} variant={"work"} className="mt-7 w-full">
//                             + New Chat
//                         </Button>
//                     ) : (
//                         <SignInButton>
//                             <Button size={"lg"} variant={"work"} className="mt-7 w-full">
//                                 + New Chat
//                             </Button>
//                         </SignInButton>
//                     )}
//                 </div>
//             </SidebarHeader>

//             <SidebarContent>
//                 <SidebarGroup>
//                     <div className="p-3">
//                         <h2 className="font-bold text-lg">Chat</h2>
//                         {!user && (
//                             <p className="text-sm text-gray-400">
//                                 Sign in to start chatting with multiple AI Models
//                             </p>
//                         )}
//                         {chatHistory.map((chat, index) => (
//                             <div key={index} >
//                                 <Link href={'?chatId=' + chat.chatId} className="mt-2  p-3">
//                                     <h2 className="text-sm text-gray-500 text-center capitalize">
//                                         {GetLastUserMessageFromChat(chat).lastMsgDate}
//                                     </h2>
//                                     <Separator className="my-3" />
//                                     <h2 className="text-lg p-2 rounded-lg hover:bg-radial from-purple-500 to-indigo-900 cursor-pointer line-clamp-1">
//                                         {GetLastUserMessageFromChat(chat).message}
//                                     </h2>
//                                     <Separator className="my-3" />
//                                 </Link>

//                             </div>
//                         ))}
//                     </div>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter>
//                 <div className="p-3 mb-10">
//                     {!user ? (
//                         <SignInButton mode="modal">
//                             <Button variant={"work2"} className={"w-full"} size={"lg"}>
//                                 Sign In/Sign Up
//                             </Button>
//                         </SignInButton>
//                     ) : (
//                         <div>
//                             <UsageCreditProgress />
//                             <Button className={"w-full mb-3"}>
//                                 <Zap />
//                                 Upgrade Plan
//                             </Button>
//                             <Button className="flex w-full">
//                                 <User2 />
//                                 <h2>Settings</h2>
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </SidebarFooter>
//         </Sidebar>
//     )
// }



// "use client"

// import { useEffect, useState } from "react"
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
// import { collection, getDocs, query, where } from "firebase/firestore"
// import { db } from "@/config/FirebaseConfig"
// import moment from "moment/moment"
// import { Separator } from "@/components/ui/separator"
// import Link from "next/link"
// import { useRouter } from "next/navigation"

// export function AppSidebar() {
//     const { theme, setTheme } = useTheme()
//     const { user } = useUser()
//     const router = useRouter()

//     const [chatHistory, setChatHistory] = useState([])


//     useEffect(() => {
//         user && GetChatHistory()
//     }, [user])

//     const GetChatHistory = async () => {
//         // Clear previous history before fetching
//         setChatHistory([])

//         const q = query(collection(db, "chatHistory"), where("userEmail", '==', user?.primaryEmailAddress.emailAddress))
//         const querySnapshot = await getDocs(q)

//         const chats = []
//         querySnapshot.forEach((doc) => {
//             console.log("CHAT:", doc.id, doc.data())
//             chats.push(doc.data())
//         })

//         // Set all chats at once
//         setChatHistory(chats)
//     }

//     const [mounted, setMounted] = useState(false)
//     useEffect(() => setMounted(true), [])

//     const GetLastUserMessageFromChat = (chat) => {

//         const allMessages = Object.values(chat.messages).flat()
//         const userMessages = allMessages.filter(msg => msg.role == 'user')

//         const lastUserMsg = userMessages[userMessages.length - 1]?.content || "New Chat";

//         const lastUpdated = chat.lastUpdated || Date.now()
//         const formattedDate = moment(lastUpdated).fromNow()

//         return {
//             chatId: chat.chatId,
//             message: lastUserMsg,
//             lastMsgDate: formattedDate
//         }
//     }

//     const handleNewChat = () => {
//         // Navigate to home without chatId parameter to start fresh
//         router.push('/')
//     }


//     return (
//         <Sidebar>
//             <SidebarHeader>
//                 <div className="p-3">
//                     <div className="flex justify-between items-center gap-1">
//                         <div>
//                             <Image
//                                 src={"/1.jpg"}
//                                 alt="Logo"
//                                 height={200}
//                                 width={200}
//                                 className="rounded-lg"
//                             />
//                         </div>
//                         <div>
//                             {mounted && (
//                                 theme === "light" ? (
//                                     <Button onClick={() => setTheme("dark")} variant="ghost">
//                                         <Sun className="text-yellow-400" />
//                                     </Button>
//                                 ) : (
//                                     <Button onClick={() => setTheme("light")} variant="ghost">
//                                         <Moon className="text-yellow-400" />
//                                     </Button>
//                                 )
//                             )}
//                         </div>
//                     </div>

//                     {user ? (
//                         <Button onClick={handleNewChat} size={"lg"} variant={"work"} className="mt-7 w-full">
//                             + New Chat
//                         </Button>
//                     ) : (
//                         <SignInButton>
//                             <Button size={"lg"} variant={"work"} className="mt-7 w-full">
//                                 + New Chat
//                             </Button>
//                         </SignInButton>
//                     )}
//                 </div>
//             </SidebarHeader>

//             <SidebarContent>
//                 <SidebarGroup>
//                     <div className="p-3">
//                         <h2 className="font-bold text-lg">Chat</h2>
//                         {!user && (
//                             <p className="text-sm text-gray-400">
//                                 Sign in to start chatting with multiple AI Models
//                             </p>
//                         )}
//                         {chatHistory.map((chat, index) => (
//                             <div key={chat.chatId || index} >
//                                 <Link href={'?chatId=' + chat.chatId} className="mt-2  p-3">
//                                     <h2 className="text-sm text-gray-500 text-center capitalize">
//                                         {GetLastUserMessageFromChat(chat).lastMsgDate}
//                                     </h2>
//                                     <Separator className="my-3" />
//                                     <h2 className="text-lg p-2 rounded-lg hover:bg-radial from-purple-500 to-indigo-900 cursor-pointer line-clamp-1">
//                                         {GetLastUserMessageFromChat(chat).message}
//                                     </h2>
//                                     <Separator className="my-3" />
//                                 </Link>

//                             </div>
//                         ))}
//                     </div>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter>
//                 <div className="p-3 mb-10">
//                     {!user ? (
//                         <SignInButton mode="modal">
//                             <Button variant={"work2"} className={"w-full"} size={"lg"}>
//                                 Sign In/Sign Up
//                             </Button>
//                         </SignInButton>
//                     ) : (
//                         <div>
//                             <UsageCreditProgress />
//                             <Button className={"w-full mb-3"}>
//                                 <Zap />
//                                 Upgrade Plan
//                             </Button>
//                             <Button className="flex w-full">
//                                 <User2 />
//                                 <h2>Settings</h2>
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </SidebarFooter>
//         </Sidebar>
//     )
// }



"use client"

import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { SignInButton, useAuth, useUser } from "@clerk/nextjs"
import { Bolt, Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import UsageCreditProgress from "./UsageCreditProgress"
import { collection, getDocs, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "@/config/FirebaseConfig"
import moment from "moment/moment"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext"
import PricingModal from "./PricingModal"


export function AppSidebar() {
    const { theme, setTheme } = useTheme()
    const { user } = useUser()
    const router = useRouter()


    const { has } = useAuth()


    const [chatHistory, setChatHistory] = useState([])
    const [freeMsgCount, setFreeMsgCount] = useState(0)

    const { messages, setMessages, aiSelectedModels } = useContext(AiSelectedModelContext)

    useEffect(() => {
        if (!user?.primaryEmailAddress?.emailAddress) {
            setChatHistory([])
            return
        }
        const q = query(
            collection(db, "chatHistory"),
            where("userEmail", "==", user.primaryEmailAddress.emailAddress),
            orderBy("lastUpdated", "desc") // newest on top
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chats = []
            snapshot.forEach((doc) => {
                chats.push(doc.data())
            })
            setChatHistory(chats)
        }, (err) => {
            console.error("Chat history error:", err)
        })
        // user && GetRemainingTokenMsgs()
        return () => unsubscribe() // cleanup
    }, [user])

    useEffect(() => {
        GetRemainingTokenMsgs()
    }, [messages])

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const GetLastUserMessageFromChat = (chat) => {

        const allMessages = Object.values(chat.messages).flat()
        const userMessages = allMessages.filter(msg => msg.role == 'user')

        const lastUserMsg = userMessages[userMessages.length - 1]?.content || "New Chat";

        const lastUpdated = chat.lastUpdated || Date.now()
        const formattedDate = moment(lastUpdated).fromNow()

        return {
            chatId: chat.chatId,
            message: lastUserMsg,
            lastMsgDate: formattedDate
        }
    }

    const handleNewChat = () => {
        // Navigate to home without chatId parameter to start fresh
        router.push('/')
    }

    const GetRemainingTokenMsgs = async () => {

        const result = await axios.get('/api/user-remaining-msg')
        console.log("🍄TOKENS:", result)
        setFreeMsgCount(result.data?.remainingToken)
    }


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
                        <Link href={'/'}>
                            <Button onClick={handleNewChat} size={"lg"} variant={"work"} className="mt-7 w-full">
                                + New Chat
                            </Button>
                        </Link>

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
                        {chatHistory.map((chat, index) => (
                            <div key={chat.chatId || index} >
                                <Link href={'?chatId=' + chat.chatId} className="mt-2  p-3">
                                    <h2 className="text-sm text-gray-500 text-center capitalize">
                                        {GetLastUserMessageFromChat(chat).lastMsgDate}
                                    </h2>
                                    <Separator className="my-2" />
                                    <h2 className="text-lg p-2 rounded-lg hover:bg-radial from-purple-500 to-indigo-950 cursor-pointer line-clamp-1 bg-purple-700">
                                        {GetLastUserMessageFromChat(chat).message}
                                    </h2>
                                    <Separator className="" />
                                </Link>

                            </div>
                        ))}
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
                            {!has({ plan: 'unlimited_plan' }) &&

                                <div>
                                    <UsageCreditProgress remainingToken={freeMsgCount} />
                                    <PricingModal>
                                        <Button className={"w-full mb-3"}>
                                            <Zap />
                                            Upgrade Plan
                                        </Button>

                                    </PricingModal>
                                </div>
                            }

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