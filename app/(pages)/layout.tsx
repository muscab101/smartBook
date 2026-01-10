import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
// import { Navbar } from "@/components/dashboard/navbar"
import { AppSidebar } from "./_components/sidebar"
import { Navbar } from "./_components/navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Navbar-ka waxaa ku jira badhanka lagu laalaabo sidebar-ka (SidebarTrigger) */}
          <header className="h-16 border-b flex items-center px-4 justify-between sticky top-0 bg-background/95 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-border mx-2" />
              <h2 className="font-semibold text-sm">Overview</h2>
            </div>
            <Navbar /> {/* Kani waa navbar-kaagii ModeToggle-ka lahaa */}
          </header>
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}