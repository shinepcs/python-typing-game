// Style reminder: 터미널 아케이드 — 화면 전체를 하나의 날카로운 코드 조종석으로 사용한다.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import GameCanvas from "./components/GameCanvas";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <GameCanvas />
      </TooltipProvider>
    </ThemeProvider>
  );
}
