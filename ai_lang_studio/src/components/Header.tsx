import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Bell, Share2, Terminal, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 rounded-lg p-2 text-white">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AI Lang Studio</h1>
            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] gap-1 px-2 py-0.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              ATA Cockpit
            </Badge>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-800">
            <Share2 className="w-4 h-4" />
            Share Workspace
          </Button>
          
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Avatar className="w-8 h-8 border border-slate-800">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;