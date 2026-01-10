"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, Plus, DollarSign, Utensils, ShoppingBag, Car, MoreHorizontal, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function DailySpendPage() {
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [amount, setAmount] = useState("")
  const [selectedCardId, setSelectedCardId] = useState("")
  const [category, setCategory] = useState("Food")
  const [description, setDescription] = useState("")

  const { toast } = useToast()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: cardsData } = await supabase.from('user_cards').select('*').eq('user_id', user.id)
      setCards(cardsData || [])

      const { data: expenseData } = await supabase
        .from('daily_expenses')
        .select('*, user_cards(card_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      setExpenses(expenseData || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const spendAmount = Number(amount)
    const currentCard = cards.find(c => c.id === selectedCardId)

    if (!currentCard) return toast({ title: "Error", description: "Please select a card", variant: "destructive" })
    if (spendAmount <= 0) return toast({ title: "Error", description: "Amount must be greater than 0", variant: "destructive" })
    
    if (spendAmount > Number(currentCard.balance)) {
      return toast({ title: "Insufficient Balance", description: "Card balance is too low", variant: "destructive" })
    }

    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error: expenseError } = await supabase.from('daily_expenses').insert([{
        user_id: user.id,
        card_id: selectedCardId,
        amount: spendAmount,
        category,
        description
      }])

      if (!expenseError) {
        const newBalance = Number(currentCard.balance) - spendAmount
        const { error: updateError } = await supabase
          .from('user_cards')
          .update({ balance: newBalance })
          .eq('id', selectedCardId)

        if (!updateError) {
          toast({ title: "Success", description: `-$${spendAmount} deducted from ${currentCard.card_name}` })
          setAmount(""); setDescription(""); fetchData() 
        }
      }
    }
    setIsSubmitting(false)
  }

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-rose-500" /></div>

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen font-sans">
      <div className="flex flex-col gap-1 border-b pb-6 border-border">
        <h1 className="text-3xl font-semibold uppercase tracking-tighter">Daily Spending</h1>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-rose-600/80">Log expenses and auto-deduct from your balance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM SECTION */}
        <Card className="shadow-none border-border rounded-sm bg-card">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2 text-rose-600">
              <Plus className="h-4 w-4" /> New Expense
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-widest">Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                  <Input type="number" placeholder="0.00" className="pl-9 h-11 rounded-sm font-semibold border-rose-100 focus-visible:ring-rose-500" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-widest">Source Card</Label>
                <Select onValueChange={setSelectedCardId} value={selectedCardId}>
                  <SelectTrigger className="h-11 rounded-sm font-semibold border-rose-100">
                    <SelectValue placeholder="Select card" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {cards.map(card => (
                      <SelectItem key={card.id} value={card.id} className="font-semibold">
                        {card.card_name} (${Number(card.balance).toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-widest">Category</Label>
                <Select onValueChange={setCategory} defaultValue="Food">
                  <SelectTrigger className="h-11 rounded-sm font-semibold border-rose-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="Food" className="font-semibold">Food & Drinks</SelectItem>
                    <SelectItem value="Shopping" className="font-semibold">Shopping</SelectItem>
                    <SelectItem value="Transport" className="font-semibold">Transport</SelectItem>
                    <SelectItem value="Other" className="font-semibold">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-widest">Description</Label>
                <Input placeholder="e.g., Grocery Shopping" className="h-11 rounded-sm font-semibold border-rose-100" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <Button type="submit" className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-sm font-semibold text-[11px] tracking-widest shadow-lg shadow-rose-500/20" disabled={isSubmitting}>
                {isSubmitting ? "PROCESSING..." : "SUBMIT & DEDUCT"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* HISTORY SECTION */}
        <Card className="lg:col-span-2 shadow-none border-border rounded-sm bg-card">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2 text-rose-600">
              <History className="h-4 w-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {expenses.length === 0 && <p className="text-center py-12 text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">No transactions found</p>}
              {expenses.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-4 hover:bg-rose-50/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-sm border border-rose-100 flex items-center justify-center text-rose-500 bg-rose-50/50">
                      {exp.category === 'Food' && <Utensils className="h-4 w-4" />}
                      {exp.category === 'Shopping' && <ShoppingBag className="h-4 w-4" />}
                      {exp.category === 'Transport' && <Car className="h-4 w-4" />}
                      {exp.category === 'Other' && <MoreHorizontal className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm tracking-tight">{exp.description || exp.category}</p>
                      <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
                        {exp.user_cards?.card_name} • {new Date(exp.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-rose-600 text-sm">-${Number(exp.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}