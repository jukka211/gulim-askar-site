import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "../../../../sanity/lib/client";
import { urlForImage } from "../../../../sanity/lib/image";
import {
  projectBySlugQuery,
  projectSlugsQuery,
  projectsListQuery,
} from "../../../../sanity/lib/queries";
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
  const [project, projectList] = await Promise.all([
    client.fetch(projectBySlugQuery, { slug }),
    client.fetch<{ slug: string }[]>(projectsListQuery),
  ]);

  if (!project) notFound();

  const currentIndex = projectList.findIndex((p) => p.slug === slug);
  const nextSlug =
    currentIndex === -1
      ? undefined
      : projectList[(currentIndex + 1) % projectList.length]?.slug;

  return (
    <>
      <div className={styles.top}>
        <Link href="/">gulim askar</Link>
      </div>
      <div className={styles.bottom}>
        <Link href="/about">about</Link>
        {nextSlug && <Link href={`/projects/${nextSlug}`}>next</Link>}
      </div>

      <div className={styles.imageGallery}>
        {(project.gallery ?? []).map((image: ProjectImage) => (
          <div className={styles.section} key={image._key}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlForImage(image).width(1400).url()}
              alt={image.alt ?? ""}
            />
          </div>
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.sec}>
          <div className={styles.titleRow}>
            <div className={styles.title}>Title:</div>
            <div>{project.title}</div>
          </div>
        </div>

        {project.description && (
          <div className={styles.sec}>
            <div className={styles.twoColumns}>
              <div className={styles.text}>
                <PortableText value={project.description} />
              </div>
            </div>
          </div>
        )}

        <div className={styles.sec}>
          <div className={styles.twoColumns}>
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
        </div>
      </div>
    </>
  );
}
