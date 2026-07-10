"use client";

import { useState } from "react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import styles from "./WhatsOn.module.css";

export default function WhatsOn({ content }: { content: PortableTextBlock[] }) {
  const [open, setOpen] = useState(false);

  if (!content || content.length === 0) return null;

  return (
    <>
      <div className="what">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setOpen((v) => !v);
          }}
        >
          what&apos;s on
        </a>
      </div>
      {open && (
        <div className={styles.whatson} onClick={() => setOpen(false)}>
          <div className={styles.text}>
            <PortableText value={content} />
          </div>
        </div>
      )}
    </>
  );
}
