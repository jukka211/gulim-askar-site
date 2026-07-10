import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "../../../sanity/lib/client";
import { urlForImage } from "../../../sanity/lib/image";
import { siteSettingsQuery } from "../../../sanity/lib/queries";
import styles from "./page.module.css";

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await client.fetch(siteSettingsQuery);

  return (
    <>
      <div className={styles.top}>
        <Link href="/">gulim askar</Link>
      </div>
      <div className={styles.bottom}>
        {settings?.email && <a href={`mailto:${settings.email}`}>e-mail</a>}
        {settings?.instagramUrl && (
          <a href={settings.instagramUrl}>instagram</a>
        )}
      </div>

      {settings?.aboutPortrait && (
        <div className={styles.section}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlForImage(settings.aboutPortrait).width(1200).url()}
            alt={`image of ${settings?.aboutName ?? "the artist"}`}
          />
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.sec}>
          <div className={styles.titleRow}>
            <div className={styles.title}>Name:</div>
            <div>{settings?.aboutName}</div>
          </div>
        </div>

        <div className={styles.sec}>
          <div className={styles.titleRow}>
            <div className={styles.title}>Origination:</div>
            <div>{settings?.aboutOrigination}</div>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.title}>Year:</div>
            <div>{settings?.aboutBirthYear}</div>
          </div>
        </div>

        {settings?.aboutBio && (
          <div className={styles.sec}>
            <div className={styles.twoColumns}>
              <div className={styles.text}>
                <PortableText value={settings.aboutBio} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
