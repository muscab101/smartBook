"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  BarChart3, 
  ShieldCheck,
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import logo from "@/public/logo.png"

const adminNavItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: <Users className="w-4 h-4" />
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: <CreditCard className="w-4 h-4" />
  },
  {
    title: "Financial Reports",
    href: "/admin/reports",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: <Settings className="w-4 h-4" />
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r border-border bg-card flex flex-col sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="bg-rose-600 p-1.5 rounded-sm">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-tighter">Admin Panel</h2>
          <p className="text-[9px] text-rose-600 font-bold uppercase tracking-widest">SmartBook v2</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
          Main Menu
        </p>
        
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-sm transition-all group",
                isActive 
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(isActive ? "text-rose-600" : "text-muted-foreground group-hover:text-foreground")}>
                  {item.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-tight">{item.title}</span>
              </div>
              {isActive && <div className="h-4 w-1 bg-rose-600 rounded-full" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section (Admin Profile/Logout) */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center gap-3 px-4 py-2">
           <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs">
             AD
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-[11px] font-black truncate uppercase">Admin User</p>
             <p className="text-[9px] text-muted-foreground truncate">admin@smartbook.com</p>
           </div>
           <Bell className="w-4 h-4 text-muted-foreground" />
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-sm"
          onClick={() => {/* Sign out logic */}}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-tight">Logout</span>
        </Button>
      </div>
    </aside>
  )
}