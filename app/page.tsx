"use client"

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Check, 
  ArrowRight, 
  Wallet, 
  PieChart, 
  Receipt, 
  TrendingUp, 
  ShieldCheck, 
  BellRing,
  LogOut,
  LayoutDashboard 
} from "lucide-react"
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle'
import GridBackground from '@/components/GridBackground'
import Image from 'next/image'
import logo from "@/public/logo.png"

const features = [
  {
    title: "Expense Tracking",
    description: "Easily log your daily expenses and categorize them to see where your money goes.",
    icon: <Receipt className="w-6 h-6 text-rose-500" />,
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Real-time Balance",
    description: "Get an instant overview of your total balance across all your accounts and wallets.",
    icon: <Wallet className="w-6 h-6 text-rose-500" />,
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Visual Analytics",
    description: "Beautiful charts and graphs to help you understand your spending patterns over time.",
    icon: <PieChart className="w-6 h-6 text-rose-500" />,
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Income Management",
    description: "Track multiple income sources and monitor your financial growth effortlessly.",
    icon: <TrendingUp className="w-6 h-6 text-rose-500" />,
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Secure Data",
    description: "Bank-grade encryption ensures your financial data stays private and protected.",
    icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Smart Notifications",
    description: "Receive alerts for unusual spending or when you reach your monthly budget limits.",
    icon: <BellRing className="w-6 h-6 text-rose-500" />,
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
];

function PriceFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-rose-100 dark:bg-rose-900/30 p-0.5 rounded-sm">
        <Check className="w-3 h-3 text-rose-600 dark:text-rose-400" />
      </div>
      <span className="text-sm font-semibold text-foreground/80">{text}</span>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const handlePurchase = (plan: string) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/checkout?plan=${plan.toLowerCase()}`);
    }
  };

  if (loading) return null;

  return (
    <GridBackground>
      <div className="min-h-screen text-foreground font-sans">
        
        {/* --- Header --- */}
        <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border sticky top-0 bg-background/60 backdrop-blur-xl z-50">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="App Logo" width={150} height={150} />
          </div>
          
          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
            <a href="#" className="hover:text-rose-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-rose-600 transition-colors">Pricing</a>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            
            {!user ? (
              <>
                <Button onClick={() => router.push('/login')} variant="ghost" className="font-bold text-[11px] uppercase tracking-wider rounded-sm">Login</Button>
                <Button onClick={() => router.push('/login')} className="bg-rose-600 hover:bg-rose-700 text-white rounded-sm px-5 transition-all font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-rose-500/20">
                  Get Started
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-border">
                  <Button 
                    onClick={() => router.push('/dashboard')} 
                    variant="outline" 
                    className="hidden sm:flex items-center gap-2 rounded-sm border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px] uppercase tracking-wider"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>

                  <div className="flex items-center gap-2 bg-muted/50 p-1 pr-3 rounded-sm border border-border">
                    <Avatar className="h-8 w-8 rounded-sm border border-background shadow-sm">
                      <AvatarImage src={user?.user_metadata?.avatar_url} className="rounded-sm" />
                      <AvatarFallback className="bg-rose-600 text-white text-[10px] font-bold rounded-sm">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button 
                      onClick={handleSignOut}
                      className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Logout
                    </button>
                  </div>
              </div>
            )}
          </div>
        </nav>

        {/* --- Hero Section --- */}
        <section className="relative pt-24 pb-20 flex flex-col items-center text-center px-6">
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 mb-8 rounded-sm px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest">
            Finance Management v2.0
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            MANAGE MONEY <br /> 
            <span className="text-rose-600">WITHOUT STRESS.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg font-semibold leading-relaxed mb-10">
            SmartBook is the minimalist tool for tracking your daily expenses, managing cards, and hitting your savings goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push('/login')} className="bg-rose-600 hover:bg-rose-700 text-white h-12 px-8 rounded-sm font-bold uppercase text-[11px] tracking-widest transition-transform active:scale-95 shadow-lg shadow-rose-500/20">
              Start Free Today <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" className="h-12 px-8 rounded-sm font-bold uppercase text-[11px] tracking-widest border-border hover:bg-rose-50 hover:text-rose-600 transition-colors">
              Live Demo
            </Button>
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section id="features" className="py-24 border-t border-border bg-slate-50/50 dark:bg-slate-900/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="p-8 bg-card border border-border rounded-sm hover:border-rose-500/50 transition-colors group shadow-sm">
                  <div className={`w-12 h-12 ${f.bgColor} flex items-center justify-center rounded-sm mb-6`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-semibold">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section id="pricing" className="py-24 relative bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Transparent Pricing</h2>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em] text-rose-600">No Hidden Fees • Instant Access</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Personal */}
              <div className="bg-card border border-border rounded-sm p-8 flex flex-col group hover:bg-rose-50/30 transition-colors">
                <Badge className="w-fit bg-muted text-muted-foreground mb-6 rounded-sm px-3 py-1 uppercase text-[10px] font-bold">Personal</Badge>
                <div className="mb-8">
                  <span className="text-5xl font-black">$0</span>
                  <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest">Free Forever</p>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  <PriceFeature text="3 Active Wallets" />
                  <PriceFeature text="50 transactions/mo" />
                  <PriceFeature text="Email Support" />
                </div>
                <Button onClick={() => handlePurchase("Free")} variant="outline" className="w-full h-11 rounded-sm font-bold uppercase text-[10px] tracking-widest border-2 hover:border-rose-500 hover:text-rose-500 transition-all">Get Started</Button>
              </div>

              {/* Standard */}
              <div className="bg-background border-[3px] border-rose-600 rounded-sm p-8 flex flex-col relative z-10 shadow-2xl shadow-rose-500/10 scale-105">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-4 py-1 rounded-sm uppercase tracking-[0.2em]">Recommended</div>
                <Badge className="w-fit bg-rose-600 text-white mb-6 rounded-sm px-3 py-1 uppercase text-[10px] font-bold">Standard</Badge>
                <div className="mb-8">
                  <span className="text-5xl font-black">$12</span>
                  <p className="text-[10px] text-rose-600 mt-2 font-black uppercase tracking-widest">Most Popular</p>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  <PriceFeature text="5 Active Wallets" />
                  <PriceFeature text="Unlimited transactions" />
                  <PriceFeature text="PDF/CSV Export" />
                  <PriceFeature text="Real-time Sync" />
                </div>
                <Button onClick={() => handlePurchase("Standard")} className="w-full h-11 rounded-sm font-bold bg-rose-600 hover:bg-rose-700 text-white uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/30">Go Standard</Button>
              </div>

              {/* Premium */}
              <div className="bg-card border border-border rounded-sm p-8 flex flex-col group hover:bg-rose-50/30 transition-colors">
                <Badge className="w-fit bg-slate-900 text-white mb-6 rounded-sm px-3 py-1 uppercase text-[10px] font-bold">Premium</Badge>
                <div className="mb-8">
                  <span className="text-5xl font-black">$29</span>
                  <p className="text-[10px] text-rose-600 mt-2 font-black uppercase tracking-widest font-bold">Full Business Power</p>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  <PriceFeature text="10 Active Wallets" />
                  <PriceFeature text="Custom Categories" />
                  <PriceFeature text="Tax Tools" />
                  <PriceFeature text="24/7 Priority Support" />
                </div>
                <Button onClick={() => handlePurchase("Premium")} className="w-full h-11 rounded-sm font-bold bg-slate-900 hover:bg-rose-600 text-white uppercase text-[10px] tracking-widest transition-colors">Get Premium</Button>
              </div>

            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-12 border-t border-border bg-slate-50 dark:bg-slate-900/20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-rose-600 rounded-sm" />
                <span className="text-sm font-black uppercase tracking-widest">SmartBook</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                © 2024 SmartBook Finance. All rights reserved.
              </p>
            </div>
        </footer>
      </div>
    </GridBackground> 
  )
}