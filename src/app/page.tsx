import Link from "next/link";
import { client } from "../../sanity/lib/client";
import { urlForImage } from "../../sanity/lib/image";
import {
  homepageImagesQuery,
  siteSettingsQuery,
} from "../../sanity/lib/queries";
import Gallery, { type GalleryTile } from "@/components/Gallery";
import WhatsOn from "@/components/WhatsOn";

export const revalidate = 60;

export default async function Home() {
  const [homepageImages, settings] = await Promise.all([
    client.fetch(homepageImagesQuery),
    client.fetch(siteSettingsQuery),
  ]);

  const tiles: GalleryTile[] = homepageImages
    .filter((item: { image?: unknown }) => item.image)
    .map((item: { _id: string; image: never; projectSlug?: string }) => ({
      id: item._id,
      imageUrl: urlForImage(item.image).width(1000).url(),
      alt: "",
      href: item.projectSlug ? `/projects/${item.projectSlug}` : undefined,
    }));

  return (
    <>
      <Gallery tiles={tiles} />

      <div className="top">
        <div className="gulim">
          <Link href="/">Gulim asKar</Link>
        </div>
      </div>

      <div className="bottom">
        <div className="about">
          <Link href="/about">about</Link>
        </div>
        <div className="center">
          <WhatsOn content={settings?.whatsOn ?? []} />
          {settings?.shopUrl && (
            <div className="shop">
              <a href={settings.shopUrl}>shop originals</a>
            </div>
          )}
        </div>
        <div className="index">
          <Link href="/index-page">index</Link>
        </div>
      </div>
    </>
  );
}
