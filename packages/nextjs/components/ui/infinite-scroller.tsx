import React, { FC, useEffect, useRef, useState } from "react";
import { cn } from "~~/lib/utils";
import { InfiniteScrollerProps } from "~~/types";

export const InfiniteScroller: FC<InfiniteScrollerProps> = ({
  children,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach(item => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      // Apply direction and speed
      containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");

      const duration = speed === "fast" ? "20s" : speed === "normal" ? "80s" : "120s";
      containerRef.current.style.setProperty("--animation-duration", duration);

      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className,
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
    </div>
  );
};
