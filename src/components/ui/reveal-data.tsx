"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevealDataProps {
  masked: string;
  full: string;
  className?: string;
}

export function RevealData({ masked, full, className }: RevealDataProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setRevealed(!revealed)}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-sm cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors",
        className
      )}
      title={revealed ? "Ocultar" : "Clique para revelar"}
    >
      <span>{revealed ? full : masked}</span>
      {revealed ? (
        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );
}
