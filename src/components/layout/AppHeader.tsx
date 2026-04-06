import { Bell, User, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const { user, isDemo, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const displayName =
  user?.displayName ||
  user?.email?.split("@")[0] ||
  (isDemo ? "Demo Doctor" : "User");

const displayOrg =
  user?.email ||
  (isDemo ? "Demo Mode" : "");

  return (
    <header className="h-14 flex items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <div className="text-right hidden sm:block">
            <p className="font-medium leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayOrg}</p>
          </div>
          {user?.photoURL ? (
  <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" />
) : (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
    <User className="h-4 w-4" />
  </div>
)}
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
