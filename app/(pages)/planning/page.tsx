"use client"

import React from 'react'
import { Rocket, Clock, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PlanningPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 space-y-8 text-center font-sans">
      {/* Icon Section */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-rose-50 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-sm border border-rose-100 shadow-sm">
          <Rocket className="h-12 w-12 text-rose-500" />
        </div>
      </div>

      {/* Text Section */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-semibold tracking-tighter uppercase text-slate-900">
          Coming Soon
        </h1>
        <div className="h-1 w-20 bg-rose-500 mx-auto rounded-full" />
        <p className="text-sm font-semibold text-rose-600 uppercase tracking-widest pt-2">
          Advanced Financial Planning
        </p>
        <p className="text-muted-foreground text-sm font-semibold leading-relaxed">
          We are developing a powerful tool to help you forecast savings, set financial goals, and automate your future budgets.
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-rose-50/50 rounded-sm border border-rose-100">
        <Clock className="h-4 w-4 text-rose-500" />
        <span className="text-[10px] font-semibold uppercase tracking-tighter text-rose-700">
          Feature Under Construction
        </span>
      </div>

      {/* Action Button */}
      <Button 
        variant="ghost" 
        className="rounded-sm text-rose-600 font-semibold hover:bg-rose-50 gap-2"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </div>
  )
}