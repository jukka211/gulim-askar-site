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
      <div className="top">
        <div className="gulim">
          <Link href="/">gulim askar</Link>
        </div>
      </div>
      <div className="bottom">
        <div className="about">
          {settings?.email && <a href={`mailto:${settings.email}`}>e-mail</a>}
        </div>
        <div className="center">
          {settings?.instagramUrl && (
            <div className="what">
              <a href={settings.instagramUrl}>instagram</a>
            </div>
          )}
        </div>
        <div className="index">
          <Link href="/">back</Link>
        </div>
      </div>

      {settings?.aboutPortrait && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlForImage(settings.aboutPortrait).width(1200).url()}
          alt={`image of ${settings?.aboutName ?? "the artist"}`}
          className={styles.portrait}
        />
      )}

      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.titleRow}>
            <div className={styles.title}>Name:</div>
            <div>{settings?.aboutName}</div>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.title}>Origination:</div>
            <div>{settings?.aboutOrigination}</div>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.title}>Year:</div>
            <div>{settings?.aboutBirthYear}</div>
          </div>
        </div>

        <div className={styles.twoColumns} style={{ flex: 2 }}>
          {settings?.aboutBio && <PortableText value={settings.aboutBio} />}
        </div>
      </div>
    </>
  );
}
