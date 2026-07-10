"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./Gallery.module.css";

export type GalleryTile = {
  id: string;
  imageUrl: string;
  alt: string;
  href?: string;
};

// Ported 1:1 from Codrops' "Image Trail Effects" demo 1, rewritten from
// TweenMax/TimelineMax (GSAP 2) to GSAP 3.
// https://tympanus.net/codrops/2019/08/07/image-trail-effects/
export default function Gallery({ tiles }: { tiles: GalleryTile[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imageEls = Array.from(
      container.querySelectorAll<HTMLElement>("[data-gallery-image]")
    );
    if (imageEls.length === 0) return;

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
    const distance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.hypot(x2 - x1, y2 - y1);

    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastMousePos = { ...mousePos };
    const cacheMousePos = { ...mousePos };

    const images = imageEls.map((el) => ({ el }));

    // center each image on its x/y coordinate via CSS transform percentage,
    // so positioning never depends on a JS-measured width/height (which can
    // be wrong/zero if read before the image has finished loading)
    gsap.set(imageEls, { xPercent: -50, yPercent: -50 });

    function updateMousePos(x: number, y: number) {
      mousePos = { x, y };
    }
    function onMouseMove(e: MouseEvent) {
      updateMousePos(e.clientX, e.clientY);
    }
    function onTouch(e: TouchEvent) {
      if (e.touches.length === 1) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouch);
    window.addEventListener("touchmove", onTouch);

    const threshold = window.innerWidth <= 768 ? 120 : 200;
    let imgPosition = 0;
    let zIndexVal = 1;
    let rafId: number;

    function isActive(el: HTMLElement) {
      return gsap.isTweening(el) || gsap.getProperty(el, "opacity") !== 0;
    }

    function showNextImage() {
      const img = images[imgPosition];

      gsap.killTweensOf(img.el);

      gsap
        .timeline()
        // show the image
        .set(
          img.el,
          {
            opacity: 1,
            scale: 1,
            zIndex: zIndexVal,
            x: cacheMousePos.x,
            y: cacheMousePos.y,
          },
          0
        )
        // animate position
        .to(
          img.el,
          {
            duration: 0.8,
            ease: "expo.out",
            x: mousePos.x,
            y: mousePos.y,
          },
          0
        )
        // then make it disappear
        .to(img.el, { duration: 1, ease: "power1.out", opacity: 0 }, 0.9)
        // scale down the image
        .to(img.el, { duration: 1, ease: "quint.out", scale: 0 }, 0.9);
    }

    function render() {
      const dist = distance(
        mousePos.x,
        mousePos.y,
        lastMousePos.x,
        lastMousePos.y
      );
      cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1);

      if (dist > threshold) {
        showNextImage();
        zIndexVal++;
        imgPosition = (imgPosition + 1) % images.length;
        lastMousePos = { ...mousePos };
      }

      const isIdle = !images.some((img) => isActive(img.el));
      if (isIdle && zIndexVal !== 1) {
        zIndexVal = 1;
      }

      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      gsap.killTweensOf(imageEls);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {tiles.map((tile) => {
        const img = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tile.imageUrl}
            alt={tile.alt}
            data-gallery-image
            className={styles.image}
          />
        );
        return tile.href ? (
          <Link key={tile.id} href={tile.href}>
            {img}
          </Link>
        ) : (
          <div key={tile.id}>{img}</div>
        );
      })}
    </div>
  );
}
