import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface UserProfileProps {
  email: string;
  onSignOut: () => void;
}

export function UserProfile({ email, onSignOut }: UserProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem(`avatar_${email}`) || "";
  });

  // Extract name from email (everything before @)
  const userName = email.split("@")[0].replace(/[._-]/g, " ").split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  // Get initials for avatar fallback
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem(`avatar_${email}`, base64String);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium hidden sm:block">{userName}</span>
      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
        <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary transition-all">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-400 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload className="h-4 w-4 text-white" />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="outline" onClick={onSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
