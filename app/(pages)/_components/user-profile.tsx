"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function UserProfile({ name, email, avatarUrl }: UserProfileProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-3 mb-4 px-2">
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate dark:text-white">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}