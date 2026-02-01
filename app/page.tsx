"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const NO_BUTTON_RUN_DISTANCE = 140; // pixels - cursor within this hides the No button

export default function ValentinePage() {
  const [showYesModal, setShowYesModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [noButtonVisible, setNoButtonVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Track cursor and hide No button when it gets close
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const noBtn = noButtonRef.current;
      if (!noBtn) return;

      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(
        e.clientX - btnCenterX,
        e.clientY - btnCenterY,
      );

      setNoButtonVisible(distance > NO_BUTTON_RUN_DISTANCE);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [noButtonVisible]); // re-attach when visibility changes so we always have correct rect

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowWrongModal(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-red-50 px-4"
    >
      {/* Soft hearts background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute left-[10%] top-[20%] text-6xl">♥</div>
        <div className="absolute right-[15%] top-[30%] text-4xl">♥</div>
        <div className="absolute bottom-[25%] left-[20%] text-5xl">♥</div>
        <div className="absolute bottom-[15%] right-[10%] text-5xl">♥</div>
      </div>

      <main className="relative z-10 flex flex-col items-center gap-12 text-center">
        <h1 className="max-w-lg font-serif text-4xl font-medium tracking-wide text-rose-900 sm:text-5xl">
          Would you be my valentine?
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Yes button */}
          <button
            type="button"
            onClick={() => setShowYesModal(true)}
            className="rounded-full bg-rose-500 px-10 py-4 text-xl font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-rose-600 hover:shadow-xl active:scale-100"
          >
            Yes
          </button>

          {/* No button - disappears when cursor is close */}
          <button
            ref={noButtonRef}
            type="button"
            onClick={handleNoClick}
            className="rounded-full border-2 border-rose-300 bg-white px-10 py-4 text-xl font-medium text-rose-700 shadow transition-all hover:border-rose-400 hover:bg-rose-50"
            style={{
              visibility: noButtonVisible ? "visible" : "hidden",
              pointerEvents: noButtonVisible ? "auto" : "none",
            }}
          >
            No
          </button>
        </div>
      </main>

      {/* Yes modal - love message + picture */}
      {showYesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowYesModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Love message"
        >
          <div
            className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full bg-rose-50">
              {/* Replace src with your own image path in /public, e.g. /valentine-photo.jpg */}
              <Image
                src="/valentines-photo.jpg"
                alt="For you"
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
                onError={(e) => {
                  // Fallback if image not added yet - show placeholder
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display =
                      "flex";
                  }
                }}
              />
              <div
                className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 text-6xl"
                aria-hidden="true"
              >
                ♥
              </div>
            </div>
            <div className="p-8 text-center">
              <p className="font-serif text-2xl font-medium text-rose-900">
                Love you, my munchkin!
              </p>
              <button
                type="button"
                onClick={() => setShowYesModal(false)}
                className="mt-6 rounded-full bg-rose-500 px-6 py-2 text-white hover:bg-rose-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wrong answer modal */}
      {showWrongModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowWrongModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Wrong answer"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl font-medium text-rose-900">
              Wrong answer, try again.
            </p>
            <button
              type="button"
              onClick={() => setShowWrongModal(false)}
              className="mt-6 rounded-full bg-rose-500 px-6 py-2 text-white hover:bg-rose-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
