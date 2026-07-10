import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "../../../../sanity/lib/client";
import { urlForImage } from "../../../../sanity/lib/image";
import {
  projectBySlugQuery,
  projectSlugsQuery,
  siteSettingsQuery,
} from "../../../../sanity/lib/queries";
import WhatsOn from "@/components/WhatsOn";
import styles from "./page.module.css";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(projectSlugsQuery);
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

type ProjectImage = { _key: string; alt?: string };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    client.fetch(projectBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ]);

  if (!project) notFound();

  return (
    <>
      <div className="top">
        <div className="gulim">
          <Link href="/">gulim askar</Link>
        </div>
      </div>
      <div className="bottom">
        <div className="about">
          <Link href="/about">about</Link>
        </div>
        <div className="center">
          <WhatsOn content={settings?.whatsOn ?? []} />
        </div>
        <div className="index">
          <Link href="/index-page">index</Link>
        </div>
      </div>

      <div className={styles.gallery}>
        {(project.gallery ?? []).map((image: ProjectImage) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image._key}
            src={urlForImage(image).width(1400).url()}
            alt={image.alt ?? ""}
          />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.titleRow}>
          <div className={styles.title}>Title:</div>
          <div>{project.title}</div>
        </div>

        {project.description && (
          <div className={styles.twoColumns}>
            <div className={styles.text}>
              <PortableText value={project.description} />
            </div>
          </div>
        )}

        <div className={styles.desc}>
          {project.material && (
            <div className={styles.titleRow}>
              <div className={styles.title}>Material:</div>
              <div>{project.material}</div>
            </div>
          )}
          {project.year && (
            <div className={styles.titleRow}>
              <div className={styles.title}>Year:</div>
              <div>{project.year}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
