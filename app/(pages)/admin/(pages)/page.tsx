// "use client"

// import { useEffect, useState } from "react"
// import { createBrowserClient } from "@supabase/ssr"
// import { 
//   Users, 
//   CreditCard, 
//   DollarSign, 
//   ShieldAlert,
//   Loader2,
//   TrendingUp,
//   Search
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { cn } from "@/lib/utils"

// export default function AdminPage() {
//   const [loading, setLoading] = useState(true)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [stats, setStats] = useState({ users: 0, standard: 0, premium: 0 })
//   const [users, setUsers] = useState<any[]>([])
//   const [searchTerm, setSearchTerm] = useState("")

//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

//   useEffect(() => {
//     const checkAdminAndFetchData = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
      
//       if (!user) {
//         window.location.href = "/login"
//         return
//       }

//       // Hubi haddii uu yahay Admin
//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('is_admin')
//         .eq('id', user.id)
//         .single()

//       if (!profile?.is_admin) {
//         setIsAdmin(false)
//         setLoading(false)
//         return
//       }

//       setIsAdmin(true)

//       // Soo qaado Dhamaan Users-ka
//       const { data: allUsers } = await supabase
//         .from('profiles')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (allUsers) {
//         setUsers(allUsers)
//         setStats({
//           users: allUsers.length,
//           standard: allUsers.filter(u => u.plan === 'standard').length,
//           premium: allUsers.filter(u => u.plan === 'premium').length,
//         })
//       }
//       setLoading(false)
//     }

//     checkAdminAndFetchData()
//   }, [supabase])

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center">
//       <Loader2 className="animate-spin h-10 w-10 text-rose-600" />
//     </div>
//   )

//   if (!isAdmin) return (
//     <div className="h-screen flex flex-col items-center justify-center space-y-4">
//       <ShieldAlert className="h-16 w-16 text-rose-600" />
//       <h1 className="text-2xl font-bold">Access Denied</h1>
//       <p className="text-muted-foreground">Ma lihid oggolaansho aad ku gashid boggan.</p>
//     </div>
//   )

//   const filteredUsers = users.filter(u => 
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-black uppercase tracking-tight">Admin Control</h1>
//           <p className="text-muted-foreground font-medium">Maaree isticmaalayaasha iyo dakhliga barnaamijka.</p>
//         </div>
//         <Badge variant="outline" className="px-4 py-1 border-rose-200 text-rose-600 font-bold">
//           System Online
//         </Badge>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard title="Total Users" value={stats.users} icon={<Users />} color="text-blue-600" />
//         <StatCard title="Standard Plans" value={stats.standard} icon={<TrendingUp />} color="text-rose-600" />
//         <StatCard title="Premium Plans" value={stats.premium} icon={<DollarSign />} color="text-emerald-600" />
//       </div>

//       {/* Users Table */}
//       <Card className="rounded-sm border-border shadow-sm">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-bold uppercase tracking-tighter">User Directory</CardTitle>
//           <div className="relative w-64">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input 
//               placeholder="Search email..." 
//               className="pl-8 rounded-sm h-9 border-rose-100 focus-visible:ring-rose-500" 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader className="bg-muted/50">
//               <TableRow>
//                 <TableHead className="font-bold uppercase text-[10px]">User</TableHead>
//                 <TableHead className="font-bold uppercase text-[10px]">Plan</TableHead>
//                 <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
//                 <TableHead className="font-bold uppercase text-[10px]">Joined Date</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.map((u) => (
//                 <TableRow key={u.id} className="hover:bg-rose-50/30 transition-colors">
//                   <TableCell className="font-medium">{u.email}</TableCell>
//                   <TableCell>
//                     <Badge className={cn(
//                       "rounded-sm text-[10px] font-bold uppercase",
//                       u.plan === 'premium' ? "bg-emerald-500" : u.plan === 'standard' ? "bg-blue-500" : "bg-slate-500"
//                     )}>
//                       {u.plan || 'free'}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-emerald-500" />
//                       <span className="text-xs font-semibold">Active</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-xs text-muted-foreground">
//                     {new Date(u.created_at).toLocaleDateString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// function StatCard({ title, value, icon, color }: any) {
//   return (
//     <Card className="rounded-sm border-border">
//       <CardContent className="pt-6">
//         <div className="flex items-center justify-between">
//           <div className="space-y-1">
//             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
//             <p className="text-3xl font-black">{value}</p>
//           </div>
//           <div className={cn("p-3 bg-muted rounded-sm", color)}>
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }