"use client";

import type { MouseEvent, ReactNode } from "react";
import { goToClaim } from "@/lib/scroll";
import { cn } from "@/utils/cn";

interface ClaimLinkProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * A real link to #claim, so it works before hydration and without JavaScript. Once hydrated
 * it also moves focus into the form so keyboard and screen-reader users land on the field.
 */
export function ClaimLink({ children, className, id }: ClaimLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    goToClaim();
  };

  return (
    <a id={id} href="#claim" className={cn("btn", className)} onClick={onClick}>
      {children}
    </a>
  );
}
