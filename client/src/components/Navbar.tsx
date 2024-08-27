import { isAuth, logout } from "@/services/authService";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "./ui/use-toast";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme/useTheme";

export default function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    navigate({ to: "/" });
  };

  return (
    <div className="flex gap-5 justify-center items-center p-4">
      <div
        onClick={() => navigate({ to: "/" })}
        className="mr-auto font-bold text-3xl cursor-pointer select-none"
      >
        Flashy
      </div>
      {isAuth() ? (
        <>
          <Button
            onClick={() => navigate({ to: "/decks" })}
            variant={"ghost"}
            className="text-xl"
          >
            My Decks
          </Button>
          <div
            onClick={handleLogout}
            className="text-xl cursor-pointer select-none"
          >
            Logout
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => navigate({ to: "/login" })}
            className="cursor-pointer select-none"
          >
            Login
          </div>
          <Button onClick={() => navigate({ to: "/register" })}>
            Register
          </Button>
        </>
      )}
      <ModeToggle />
    </div>
  );
}

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
