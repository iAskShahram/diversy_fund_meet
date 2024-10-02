"use client";

import { ServerWrapper } from "@/app/_components/server-wrapper";
import { useEffect, useRef, useState } from "react";
import { MeetingCard } from "./meeting-card";

export const UpcommingMeetingsContent = () => {
  const [height, setHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (contentRef.current) {
    //   // calculate the height of the ref div in px
    //   const height = contentRef.current.getBoundingClientRect().height;
    //   console.log({ height });
    //   setHeight(height);
    // }

    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect) {
        const newHeight = entries[0].contentRect.height;
        console.log({ newHeight });
        setHeight(newHeight);
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute">
      <div
        className="flex h-full flex-1 flex-col overflow-hidden overflow-y-auto overflow-x-hidden"
        //   style={{ maxHeight: height ? `${height}px` : "10vh" }}
        ref={contentRef}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <ServerWrapper key={index}>
            <MeetingCard
              title="Board Meeting"
              date="12:00 PM - 2:00 PM"
              description="Executive Steering Committee"
            />
          </ServerWrapper>
        ))}
      </div>
    </div>
  );
};
