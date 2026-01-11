"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Plus, Wallet, Loader2, Trash2, AlertCircle, ShieldCheck } from "lucide-react"

// Shadcn Components
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
// --- TOAST LIFTED OUT ---
// import { cn } from "@/lib/utils"

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userPlan, setUserPlan] = useState("free") 
  
  // Form State
  const [cardName, setCardName] = useState("")
  const [cardType, setCardType] = useState("Visa")
  const [initialBalance, setInitialBalance] = useState("")
  const [cardLimit, setCardLimit] = useState("") 

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()
      
      if (profile) setUserPlan(profile.plan)

      const { data: userCards } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setCards(userCards || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const getMaxCards = () => {
    if (userPlan === 'premium') return 10
    if (userPlan === 'standard') return 5
    return 3 
  }

  const MAX_CARDS_LIMIT = getMaxCards()
  const usagePercentage = (cards.length / MAX_CARDS_LIMIT) * 100
  const isLimitReached = cards.length >= MAX_CARDS_LIMIT

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      if (isLimitReached) {
        alert(`Limit Reached: Upgrade your plan to add more than ${MAX_CARDS_LIMIT} cards.`)
        setIsSubmitting(false)
        setIsOpen(false)
        return
      }

      const { error } = await supabase
        .from('user_cards')
        .insert([{
          user_id: user.id,
          card_name: cardName,
          card_type: cardType,
          balance: Number(initialBalance) || 0,
          spending_limit: Number(cardLimit) || 0 
        }])

      if (!error) {
        setIsOpen(false)
        setCardName(""); setInitialBalance(""); setCardLimit(""); fetchData() 
      }
    }
    setIsSubmitting(false)
  }

  const deleteCard = async (id: string) => {
    if(!confirm("Delete this card permanently?")) return;
    const { error } = await supabase.from('user_cards').delete().eq('id', id)
    if (!error) {
      setCards(cards.filter(c => c.id !== id))
    }
  }

  if (loading) return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
    </div>
  )

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen transition-colors font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-rose-100/50">
        <div className="space-y-4 w-full md:w-1/2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">My Wallets</h1>
            <Badge className="bg-rose-600 rounded-sm text-[10px] uppercase font-semibold px-2 py-0.5 shadow-sm">
              {userPlan} Plan
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Usage Status</span>
              <span className={isLimitReached ? "text-rose-600" : "text-emerald-600"}>
                {cards.length} / {MAX_CARDS_LIMIT} USED
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-sm overflow-hidden">
               <div 
                 className={`h-full transition-all duration-700 ${isLimitReached ? 'bg-rose-600' : 'bg-rose-500'}`} 
                 style={{ width: `${usagePercentage}%` }}
               />
            </div>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className={`rounded-sm h-11 px-6 font-semibold transition-all ${isLimitReached ? 'opacity-50 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20'}`}
              disabled={isLimitReached}
            >
              <Plus className="mr-2 h-4 w-4" /> {isLimitReached ? "Limit Reached" : "Add New Card"}
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-sm sm:max-w-[425px] font-semibold border-rose-100">
            <form onSubmit={handleAddCard}>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Create New Card</DialogTitle>
                <DialogDescription className="text-xs">Fill in the details for your new wallet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider" htmlFor="name">Wallet Name</Label>
                  <Input id="name" placeholder="Salary Account" className="rounded-sm h-10 font-semibold border-rose-100" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider" htmlFor="type">Card Type</Label>
                  <Select onValueChange={setCardType} defaultValue={cardType}>
                    <SelectTrigger className="rounded-sm h-10 w-full font-semibold border-rose-100">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm">
                      <SelectItem value="Visa" className="font-semibold">Visa</SelectItem>
                      <SelectItem value="Mastercard" className="font-semibold">Mastercard</SelectItem>
                      <SelectItem value="Lloyds" className="font-semibold">Lloyds</SelectItem>
                      <SelectItem value="Cash" className="font-semibold">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider" htmlFor="balance">Balance ($)</Label>
                    <Input id="balance" type="number" placeholder="0.00" className="rounded-sm h-10 font-semibold border-rose-100" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider" htmlFor="limit">Warning At ($)</Label>
                    <Input id="limit" type="number" placeholder="50" className="rounded-sm h-10 font-semibold border-rose-200" value={cardLimit} onChange={(e) => setCardLimit(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-sm h-11 w-full bg-rose-500 hover:bg-rose-600 font-semibold uppercase text-xs tracking-widest" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Confirm & Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upgrade Banner */}
      {isLimitReached && userPlan !== 'premium' && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center justify-between">
           <div className="flex items-center gap-3">
             <ShieldCheck className="h-5 w-5 text-rose-600" />
             <p className="text-xs font-semibold text-rose-900">
               You've reached your {userPlan} limit. Upgrade to add more wallets!
             </p>
           </div>
           <Button variant="link" className="text-rose-600 font-semibold text-xs underline">Upgrade Now</Button>
        </div>
      )}

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => {
          const isLowBalance = card.spending_limit > 0 && Number(card.balance) <= Number(card.spending_limit);

          return (
            <Card key={card.id} className="rounded-sm border-none overflow-hidden group relative shadow-md">
              <div className={cn(
                "h-60 p-6 flex flex-col justify-between text-white relative overflow-hidden",
                card.card_type === 'Visa' ? 'bg-gradient-to-br from-slate-800 to-slate-950' :
                card.card_type === 'Mastercard' ? 'bg-gradient-to-br from-rose-500 to-rose-700' :
                card.card_type === 'Lloyds' ?'bg-gradient-to-br from-amber-400 to-orange-600' :'bg-gradient-to-br from-emerald-500 to-emerald-700' 
              )}>
                
                {isLowBalance && (
                  <div className="absolute inset-x-0 top-0 bg-yellow-400/90 text-black text-[10px] font-bold py-1.5 flex items-center justify-center gap-2 z-20 animate-pulse">
                    <AlertCircle className="h-3.5 w-3.5" />
                    LOW BALANCE WARNING
                  </div>
                )}

                <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex justify-between items-start z-10 pt-2">
                  <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md relative shadow-inner border border-yellow-500/30">
                     <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                       {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-black/40" />)}
                     </div>
                  </div>
                  <Badge className="rounded-full bg-white/20 text-[10px] backdrop-blur-md border-none px-3 font-semibold">
                    {card.card_type}
                  </Badge>
                </div>

                <div className="z-10 mt-2">
                  <p className="text-[10px] opacity-70 font-semibold lowercase tracking-wider mb-1">Total Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-3xl font-bold tracking-tight", isLowBalance ? "text-yellow-300" : "text-white")}>
                      ${Number(card.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs opacity-50 font-light">USD</span>
                  </div>
                </div>

                <div className="flex justify-between items-end z-10 pt-4 border-t border-white/10">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-medium opacity-60">CARD HOLDER</p>
                    <p className="text-sm font-semibold tracking-wide truncate max-w-[150px]">
                      {card.card_name}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     <div className="flex -space-x-3 opacity-90 mb-1">
                        <div className={`h-8 w-8 rounded-full ${card.card_type === 'Mastercard' ? 'bg-orange-500' : 'bg-white/20'}`} />
                        <div className={`h-8 w-8 rounded-full ${card.card_type === 'Mastercard' ? 'bg-red-500' : 'bg-white/10'} backdrop-blur-sm`} />
                     </div>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-white/40 hover:text-rose-400 hover:bg-white/10 rounded-full"
                        onClick={() => deleteCard(card.id)}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  )
}