"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, Lock } from "lucide-react"; 
import { supabase } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function-kan wuxuu iskeed u helayaa URL-ka saxda ah
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Ku dar kan Vercel Settings
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel ayaa bixisa kan
      window.location.origin; // Localhost
    
    // Hubi inuu ku bilaawdo http ama https
    url = url.includes('http') ? url : `https://${url}`;
    return url;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Halkan waxaan u bedelay dynamic URL
        redirectTo: `${getURL()}/auth/callback`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-rose-800 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-center dark:text-slate-400">
            Manage your daily bookkeeping and accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin} 
            className="w-full dark:hover:bg-slate-800 dark:text-white dark:border-slate-700"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="grid gap-3">
                <div>
                    <Label className=" my-3">Email</Label>
                    <div className="relative">
                
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
                </div>
              
              <div>
                <Label className="my-3" >Password</Label>
                <div className="relative mt-1">
                
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              </div>
             
            </div>
            <Button 
                className="w-full bg-rose-600 hover:bg-rose-700 transition-all duration-300 text-white" 
                type="submit" 
                disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}