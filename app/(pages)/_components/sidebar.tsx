"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { LayoutDashboard, CreditCard, CalendarDays, LogOut, CircleDollarSign, MessageSquare } from "lucide-react" 
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import logo from "@/public/logo.png"

export function AppSidebar() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname() 
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [supabase])

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Cards", url: "/cards", icon: CreditCard },
    { title: "Daily Spend", url: "/daily-spend", icon: CircleDollarSign },
    
    { title: "AI Assistant", url: "/chat", icon: MessageSquare },
    { title: "Planning", url: "/planning", icon: CalendarDays }, // Menu-ga Cusub
  ]

  return (
    <Sidebar className="bg-[#f3f0f1] dark:bg-slate-950 border-r-0 transition-colors duration-300">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="App Logo" width={150} height={150} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={cn(
                    "w-full h-11 px-4 transition-all rounded-sm relative group", 
                    isActive 
                      ? "text-rose-600 font-bold pl-8 bg-transparent" 
                      : "text-slate-700 dark:text-white hover:bg-white/50 dark:hover:bg-slate-900"
                  )}
                >
                  <a href={item.url} className="flex items-center gap-3">
                    {isActive && (
                      <div className="absolute left-2 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    )}
                    
                    <item.icon className={cn(
                      "h-5 w-5", 
                      isActive ? "text-rose-600" : "text-slate-500 dark:text-white"
                    )} />
                    
                    <span className="font-medium">
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-400/50 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-white/40 dark:bg-slate-900/50 rounded-sm overflow-hidden">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10 rounded-sm">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url} 
                alt={user?.email || "user"} 
              />
              <AvatarFallback className="rounded-sm bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold text-lg uppercase">
                {user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate leading-none mb-1 text-slate-800 dark:text-white">
              {user?.user_metadata?.full_name || "User Account"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate leading-none dark:text-slate-400">
              {user?.email}
            </span>
          </div>

          <button 
            onClick={() => supabase.auth.signOut()} 
            className="ml-auto p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}