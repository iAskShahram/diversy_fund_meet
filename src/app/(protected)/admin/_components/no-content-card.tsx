import { cn } from "@/lib/utils";
import React from "react";

export const NoContentCard = ({
  children,
  heading,
  description,
  className,
}: {
  heading: string;
  description: string[];
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex h-[30rem] items-center justify-center", className)}>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-2xl font-extrabold">{heading}</div>
        {description.map((line) => (
          <div key={line} className="text-sm text-muted-foreground">
            {line}
          </div>
        ))}
        {children}
      </div>
    </div>
  );
};
