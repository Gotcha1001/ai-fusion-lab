"use client"
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
    const { theme, setTheme } = useTheme()
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-3">
                    <div className="flex justify-between items-center gap-1">
                        <div className="">
                            <Image src={"/1.jpg"} alt="Logo" height={200} width={200} className="rounded-lg" />
                        </div>  <div>
                            {theme === "light" ? <Button
                                onClick={() => setTheme('dark')}
                                variant="ghost"><Sun className="text-yellow-400" /></Button> : <Button
                                    onClick={() => setTheme("light")}
                                    variant="ghost"><Moon className="text-yellow-400" /></Button>}
                        </div>
                    </div>
                    <Button size={"lg"} variant={"work"} className="mt-7 w-full">+ New Chat</Button>
                </div>


            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="p-3">
                        <h2 className="font-bold text-lg">Chat</h2>
                        <p className="text-sm text-gray-400">Sign in to start chatting with multiple AI Models</p>
                    </div>

                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <div className="p-3 mb-10">
                    <Button variant={"work2"} className={"w-full"} size={"lg"}>Sign In/Sign Up</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}