"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => Promise<void> | void;
  onMoveDown: () => Promise<void> | void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  const [pending, setPending] = React.useState(false);

  async function run(fn: () => Promise<void> | void) {
    setPending(true);
    await fn();
    setPending(false);
  }

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-5 w-7"
        disabled={disableUp || pending}
        onClick={() => run(onMoveUp)}
        aria-label="Move up"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-5 w-7"
        disabled={disableDown || pending}
        onClick={() => run(onMoveDown)}
        aria-label="Move down"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
