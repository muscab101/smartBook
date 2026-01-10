"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, CreditCard, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"

const chartConfig = {
  income: { label: "Income", color: "#f43f5e" }, 
  expense: { label: "Expense", color: "#64748b" },
} satisfies ChartConfig

export default function FullDashboard() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 })
  const [chartData, setChartData] = useState([])
  const [cards, setCards] = useState([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadDashboardData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      setUserData({
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        image: user.user_metadata?.avatar_url,
        email: user.email
      })

      const { data: userCards } = await supabase.from('user_cards').select('*').eq('user_id', user.id)
      let currentTotalBalance = 0
      if (userCards) {
        setCards(userCards as any)
        currentTotalBalance = userCards.reduce((acc, card) => acc + Number(card.balance), 0)
      }

      const [{ data: transactions }, { data: dailyExpenses }] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('daily_expenses').select('*').eq('user_id', user.id)
      ])

      let totalInc = 0
      let totalExp = 0
      let combinedChart: any[] = []

      if (transactions) {
        totalInc = transactions.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0)
        totalExp = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0)
        combinedChart = transactions.map(t => ({
          date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          income: t.type === 'income' ? Number(t.amount) : 0,
          expense: t.type === 'expense' ? Number(t.amount) : 0
        }))
      }

      if (dailyExpenses) {
        totalExp += dailyExpenses.reduce((a, b) => a + Number(b.amount), 0)
        const formattedDaily = dailyExpenses.map(de => ({
          date: new Date(de.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          income: 0,
          expense: Number(de.amount)
        }))
        combinedChart = [...combinedChart, ...formattedDaily]
      }
      
      setStats({ income: totalInc, expense: totalExp, balance: currentTotalBalance })
      setChartData(combinedChart.slice(-15) as any)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadDashboardData()

    const channel = supabase
      .channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_cards' }, () => loadDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_expenses' }, () => loadDashboardData())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase, loadDashboardData])

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-rose-500" /></div>

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-sm">
            <AvatarImage src={userData?.image} />
            <AvatarFallback className="bg-rose-100 text-rose-600 font-bold text-xl uppercase">{userData?.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-rose-500">Management System</p>
            <h1 className="text-3xl font-semibold tracking-tight uppercase">Welcome, {userData?.name}</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">Cards Combined Balance</p>
          <p className="text-4xl font-bold text-slate-900 tracking-tighter">
              ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-sm border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold text-rose-500">${stats.income.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="rounded-sm border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold">${stats.expense.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="rounded-sm border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Active Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-semibold text-primary">{cards.length} Cards</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <Card className="lg:col-span-4 rounded-sm border shadow-none overflow-hidden">
          <CardHeader className="border-b py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Financial Flow</CardTitle>
            <Badge className="bg-rose-50 text-rose-600 border-rose-200 text-[10px]">REAL-TIME</Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="income" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#64748b" fill="#64748b" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-sm border shadow-none">
          <CardHeader className="border-b py-4 px-6">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Live Wallets</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {cards.map((card: any, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-sm hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 border rounded-sm"><CreditCard className="h-5 w-5 text-rose-500" /></div>
                  <div>
                    <p className="text-sm font-semibold uppercase">{card.card_name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{card.card_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${Number(card.balance).toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase italic">Linked</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}