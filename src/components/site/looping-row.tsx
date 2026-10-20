"use client";

import * as React from "react";

export interface LoopingRowHandle {
  /** Glide roughly one screen-width to the right (1) or left (-1). */
  nudge: (dir: 1 | -1) => void;
}

interface LoopingRowProps {
  items: React.ReactNode[];
  /** Width classes for each item wrapper. Widths should use `cqw` units. */
  itemClassName: string;
  /** When this changes the row jumps back to its start (e.g. filter changed). */
  resetKey?: string;
}

// Momentum decay time constant in ms: after release the speed falls to ~37%
// every TAU ms, so a fast flick glides for roughly a second.
const TAU = 325;

/**
 * A single row that scrolls forever in both directions. The items are repeated
 * and the position wraps, so dragging (mouse or touch), trackpad swiping and
 * the arrow buttons can go on without ever hitting an end.
 */
export const LoopingRow = React.forwardRef<LoopingRowHandle, LoopingRowProps>(
  function LoopingRow({ items, itemClassName, resetKey }, ref) {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const setRef = React.useRef<HTMLDivElement>(null);
    const [copies, setCopies] = React.useState(3);

    const s = React.useRef({
      x: 0,
      v: 0, // px per ms
      setW: 0,
      down: false,
      moved: false,
      suppressClick: false,
      startX: 0,
      lastX: 0,
      lastT: 0,
      raf: 0,
      lastFrame: 0,
    });

    const apply = React.useCallback(() => {
      const st = s.current;
      const track = trackRef.current;
      if (!track) return;
      if (st.setW > 0) {
        st.x = st.x % st.setW; // (-setW, 0] or (0, setW)
        if (st.x > 0) st.x -= st.setW;
      }
      track.style.transform = `translate3d(${st.x}px,0,0)`;
    }, []);

    const tick = React.useCallback(
      (t: number) => {
        const st = s.current;
        if (st.down) {
          st.raf = 0;
          return;
        }
        const dt = Math.min(Math.max(t - st.lastFrame, 0), 50);
        st.lastFrame = t;
        st.x += st.v * dt;
        st.v *= Math.exp(-dt / TAU);
        apply();
        if (Math.abs(st.v) > 0.01) {
          st.raf = requestAnimationFrame(tick);
        } else {
          st.raf = 0;
        }
      },
      [apply]
    );

    const kick = React.useCallback(() => {
      const st = s.current;
      if (st.raf) return;
      st.lastFrame = performance.now();
      st.raf = requestAnimationFrame(tick);
    }, [tick]);

    React.useImperativeHandle(
      ref,
      () => ({
        nudge: (dir) => {
          const vp = viewportRef.current;
          if (!vp) return;
          // distance travelled by a decaying velocity v0 is v0 * TAU
          s.current.v = (-dir * vp.clientWidth * 0.9) / TAU;
          kick();
        },
      }),
      [kick]
    );

    // Measure one set of items and make enough copies to always fill the view.
    const measure = React.useCallback(() => {
      const vp = viewportRef.current;
      const set = setRef.current;
      if (!vp || !set) return;
      const st = s.current;
      st.setW = set.offsetWidth;
      const need = Math.ceil(vp.clientWidth / Math.max(st.setW, 1)) + 1;
      setCopies(Math.max(2, Math.min(need, 12)));
      apply();
    }, [apply]);

    React.useLayoutEffect(() => {
      measure();
      const vp = viewportRef.current;
      const set = setRef.current;
      if (!vp || !set || typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(measure);
      ro.observe(vp);
      ro.observe(set);
      return () => ro.disconnect();
    }, [measure, items.length]);

    React.useEffect(() => {
      const st = s.current;
      st.x = 0;
      st.v = 0;
      apply();
    }, [resetKey, apply]);

    React.useEffect(() => {
      const st = s.current;
      return () => {
        if (st.raf) cancelAnimationFrame(st.raf);
      };
    }, []);

    // Copies are decoration: keep them out of the keyboard tab order.
    React.useEffect(() => {
      viewportRef.current
        ?.querySelectorAll<HTMLElement>("[data-clone] a, [data-clone] button")
        .forEach((el) => el.setAttribute("tabindex", "-1"));
    }, [copies, items]);

    // Trackpad / shift+wheel horizontal swipes. Needs a non-passive listener.
    React.useEffect(() => {
      const vp = viewportRef.current;
      if (!vp) return;
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // let the page scroll
        e.preventDefault();
        const st = s.current;
        st.v = 0;
        st.x -= e.deltaX;
        apply();
      };
      vp.addEventListener("wheel", onWheel, { passive: false });
      return () => vp.removeEventListener("wheel", onWheel);
    }, [apply]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const st = s.current;
      st.down = true;
      st.moved = false;
      st.v = 0; // grabbing stops any glide
      st.startX = st.lastX = e.clientX;
      st.lastT = performance.now();
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const st = s.current;
      if (!st.down) return;
      if (!st.moved) {
        if (Math.abs(e.clientX - st.startX) < 6) return;
        st.moved = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      const now = performance.now();
      const dx = e.clientX - st.lastX;
      const dt = now - st.lastT;
      if (dt > 0) st.v = 0.7 * (dx / dt) + 0.3 * st.v;
      st.x += dx;
      st.lastX = e.clientX;
      st.lastT = now;
      apply();
    };

    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      const st = s.current;
      if (!st.down) return;
      st.down = false;
      if (st.moved) {
        if (performance.now() - st.lastT > 80) st.v = 0; // held still before release
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        st.suppressClick = true;
        setTimeout(() => {
          st.suppressClick = false;
        }, 0);
        kick();
      }
    };

    const itemsMarkup = (clone: boolean, key: string) => (
      <div
        key={key}
        ref={clone ? undefined : setRef}
        data-clone={clone ? "" : undefined}
        aria-hidden={clone ? true : undefined}
        className="flex shrink-0 gap-6 pr-6"
      >
        {items.map((item, i) => (
          <div key={i} className={itemClassName}>
            {item}
          </div>
        ))}
      </div>
    );

    return (
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (s.current.suppressClick) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        className="-mx-6 -my-14 cursor-grab touch-pan-y select-none overflow-hidden px-6 py-14 [container-type:inline-size] active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]"
      >
        <div ref={trackRef} className="flex will-change-transform">
          {itemsMarkup(false, "set-0")}
          {Array.from({ length: copies - 1 }, (_, c) => itemsMarkup(true, `set-${c + 1}`))}
        </div>
      </div>
    );
  }
);
