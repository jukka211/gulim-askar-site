"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Gallery.module.css";

export type GalleryTile = {
  id: string;
  imageUrl: string;
  alt: string;
  href: string;
};

export default function Gallery({ tiles }: { tiles: GalleryTile[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const images = Array.from(
      container.querySelectorAll<HTMLElement>("[data-gallery-image]")
    );
    if (images.length === 0) return;

    let displayDistance = window.innerWidth <= 768 ? 100 : 250;
    const nDisplay = window.innerWidth <= 768 ? 6 : 8;

    function updateDisplayDistance() {
      displayDistance = window.matchMedia("(max-width: 768px)").matches
        ? 75
        : 250;
    }
    updateDisplayDistance();
    window.addEventListener("resize", updateDisplayDistance);

    let globalIndex = 0;
    let lastMousePosition = { x: 0, y: 0 };

    function activatePic(img: HTMLElement, x: number, y: number) {
      for (const el of images) {
        el.style.transform = "translate(-50%, -50%) scale(0.5)";
      }
      img.dataset.status = "active";
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.zIndex = String(globalIndex);
      img.style.transform = "translate(-50%, -50%) scale(1.05)";
      lastMousePosition = { x, y };
    }

    function computeDistance(x: number, y: number) {
      return Math.hypot(x - lastMousePosition.x, y - lastMousePosition.y);
    }

    function handleMoveEvent(x: number, y: number) {
      if (computeDistance(x, y) > displayDistance) {
        const activePic = images[globalIndex % images.length];
        const inactivePic = images[(globalIndex - nDisplay) % images.length];

        activatePic(activePic, x, y);
        if (inactivePic) {
          inactivePic.dataset.status = "inactive";
        }
        globalIndex++;
      }
    }

    function onMouseMove(e: MouseEvent) {
      handleMoveEvent(e.clientX, e.clientY);
    }
    function onTouch(e: TouchEvent) {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleMoveEvent(touch.clientX, touch.clientY);
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouch);
    window.addEventListener("touchmove", onTouch);

    return () => {
      window.removeEventListener("resize", updateDisplayDistance);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {tiles.map((tile) => (
        <Link key={tile.id} href={tile.href}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tile.imageUrl}
            alt={tile.alt}
            data-gallery-image
            data-status="inactive"
            className={styles.image}
          />
        </Link>
      ))}
    </div>
  );
}
