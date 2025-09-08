"use client";
// components/CompareSlider.js
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./CompareSlider.module.css";

/**
 * Before/After comparison slider
 * - Works with IMAGES (leftSrc/rightSrc) or REAL NODES (left/right).
 * - Draggable, keyboard accessible, responsive.
 */
export default function CompareSlider({
  /* IMAGE MODE (optional) */
  leftSrc,
  leftAlt = "Before",
  rightSrc,
  rightAlt = "After",

  /* NODE MODE (optional) */
  left = null,   // ReactNode
  right = null,  // ReactNode

  initialPercent = 50,
  maxWidth = 1200,
  aspectRatio = "16 / 9", // set to 'auto' for node mode if your content defines its own height
  minHeight = 260,        // used only when aspectRatio === 'auto'
  snap = 0,               // e.g. 5 to snap to 0/100 when near edges (px threshold)
  ariaLabel = "Before and after comparison",
  leftLabel = "Before",
  rightLabel = "After",
}) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState(0); // container width in px
  const [pos, setPos] = useState(0);     // handle x in px

  const usingImages = Boolean(leftSrc && rightSrc);
  const usingNodes = Boolean(left || right);

  const clamp = useCallback((x) => Math.max(0, Math.min(x, width)), [width]);

  const percentToPx = useCallback(
    (p) => Math.max(0, Math.min(100, p)) * 0.01 * width,
    [width]
  );

  const getClientX = (e) => {
    if (e.touches?.length) return e.touches[0].clientX;
    if (e.changedTouches?.length) return e.changedTouches[0].clientX;
    return e.clientX;
  };

  const eventToX = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return 0;
      const x = getClientX(e) - rect.left;
      return clamp(x);
    },
    [clamp]
  );

  // Recompute width on resize
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.getBoundingClientRect().width;
      const ratio = width > 0 ? pos / width : initialPercent / 100;
      setWidth(w);
      setPos(clamp(ratio * w));
    };
    update();

    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    const re = () => update();
    window.addEventListener("orientationchange", re);
    window.addEventListener("resize", re);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", re);
      window.removeEventListener("resize", re);
    };
  }, [initialPercent, pos, width, clamp]);

  // Initialize pos after first width measurement
  useEffect(() => {
    if (width > 0 && pos === 0) {
      setPos(percentToPx(initialPercent));
    }
  }, [width, pos, initialPercent, percentToPx]);

  // Global handlers while dragging
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => {
      e.preventDefault();
      setPos(eventToX(e));
    };
    const onEnd = () => setDragging(false);

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [dragging, eventToX]);

  // Start drag
  const startDrag = (e) => {
    setDragging(true);
    setPos(eventToX(e));
  };

  // Click track to jump
  const jumpTo = (e) => {
    setPos(eventToX(e));
  };

  // Keyboard control
  const onKeyDown = (e) => {
    const step = Math.max(4, Math.round(width * 0.02));
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => clamp(p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => clamp(p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(width);
    }
  };

  // Optional edge snapping
  useEffect(() => {
    if (!snap || dragging) return;
    if (pos < snap) setPos(0);
    else if (width - pos < snap) setPos(width);
  }, [snap, pos, width, dragging]);

  const percent = width > 0 ? Math.round((pos / width) * 100) : initialPercent;

  return (
    <div className={styles.wrapper} style={{ "--maxWidth": `${maxWidth}px` }}>
      <div
        ref={containerRef}
        className={`${styles.container} ${aspectRatio === "auto" ? styles.minH : ""}`}
        style={{
          aspectRatio: aspectRatio !== "auto" ? aspectRatio : undefined,
          "--minHeight": `${minHeight}px`,
        }}
        onMouseDown={jumpTo}
        onTouchStart={jumpTo}
        role="group"
        aria-label={ariaLabel}
      >
        <div className={styles.canvas}>
          {/* --- BASE (LEFT) --- */}
          <div className={styles.base}>
            {usingImages ? (
              <img
                src={leftSrc}
                alt={leftAlt}
                className={styles.baseImg}
                draggable={false}
              />
            ) : (
              <div className={styles.baseNode} aria-label={leftAlt || leftLabel}>
                {left}
              </div>
            )}
          </div>

          {/* --- OVERLAY (RIGHT), clipped to knob position --- */}
          <div
            className={styles.overlayClip}
            style={{ width: `${pos}px` }}
            aria-hidden="true"
          >
            <div className={styles.overlayInner}>
              {usingImages ? (
                <img
                  src={rightSrc}
                  alt="" /* decorative duplicate; announced via legend */
                  className={styles.overlayImg}
                  draggable={false}
                />
              ) : (
                <div className={styles.overlayNode}>
                  {right}
                </div>
              )}
            </div>
          </div>

          {/* --- SLIDER HANDLE --- */}
          <div
            className={styles.slider}
            style={{ left: `${pos}px` }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            <button
              className={styles.knob}
              aria-label={`Reveal amount: ${percent}%`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              role="slider"
              onKeyDown={onKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span>{leftLabel}</span>
        <span>{percent}%</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
