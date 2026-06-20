import { TimelineEvent } from "@/types/claim";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-x-4">
          <div
            className={cn(
              index === events.length - 1 ? "h-6" : "-bottom-6",
              "absolute left-0 top-0 flex w-6 justify-center"
            )}
          >
            <div className="w-px bg-border" />
          </div>
          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-background">
            {index === 0 ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-border" />
            )}
          </div>
          <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-border">
            <div className="flex justify-between gap-x-4">
              <div className="py-0.5 text-sm font-medium text-foreground">
                {event.description}
              </div>
              <time
                dateTime={event.date}
                className="flex-none py-0.5 text-xs text-muted-foreground"
              >
                {event.date} às {event.time}
              </time>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Status: <span className="font-medium text-foreground">{event.status}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
