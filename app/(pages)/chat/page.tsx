"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Haye! Waxaan ahay Smart Book AI. Sideen kuu caawin karaa maanta?" }
  ])
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Gudaha handleSend function-ka:
const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userMessage = { role: "user", content: input };
  const newMessages = [...messages, userMessage];
  
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    
    if (data.error) throw new Error(data.error);

    setMessages((prev) => [...prev, data]);
  } catch (error) {
    setMessages((prev) => [...prev, { 
      role: "assistant", 
      content: "Waan ka xumahay, cilad ayaa dhacday. Fadlan mar kale isku day." 
    }]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Financial advisor powered by AI</p>
        </div>
        <Badge variant="secondary" className="bg-rose-100 text-rose-600 border-none px-3 py-1">
          PRO MEMBER ⭐
        </Badge>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 overflow-hidden flex flex-col border-none bg-slate-50/50 dark:bg-slate-900/50">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-4",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-slate-800" : "bg-rose-500 shadow-lg shadow-rose-200"
              )}>
                {msg.role === "user" ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
              </div>
              
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-rose-600 text-white rounded-tr-none" 
                  : "bg-white dark:bg-slate-800 border rounded-tl-none text-slate-800 dark:text-slate-100"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="h-9 w-9 rounded-full bg-rose-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t">
          <div className="relative max-w-3xl mx-auto flex items-center gap-3">
            <div className="absolute left-3 text-rose-500">
              <Sparkles size={18} />
            </div>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Weydii AI-ga wax ku saabsan kharashaadkaaga..."
              className="pl-10 h-12 bg-slate-50 border-none focus-visible:ring-rose-500"
            />
            <Button 
              onClick={handleSend}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 h-12 px-6"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3">
            AI-gu wuxuu samayn karaa khaladaad. Hubi xogta muhiimka ah.
          </p>
        </div>
      </Card>
    </div>
  )
}