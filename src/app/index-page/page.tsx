import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { urlForImage } from "../../../sanity/lib/image";
import { projectsListQuery, siteSettingsQuery } from "../../../sanity/lib/queries";
import styles from "./page.module.css";

export const revalidate = 60;

type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  year?: string;
  indexThumbnail?: never;
};

export default async function IndexPage() {
  const [projects, settings] = await Promise.all([
    client.fetch<ProjectListItem[]>(projectsListQuery),
    client.fetch(siteSettingsQuery),
  ]);

  return (
    <>
      <div className={styles.top}>
        <Link href="/">gulim askar</Link>
      </div>

      <div className={styles.containerList}>
        {projects.map((project) => (
          <div className={styles.list} key={project._id}>
            <span>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </span>
            {project.indexThumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlForImage(project.indexThumbnail).width(100).height(100).url()}
                alt=""
                className={styles.thumb}
              />
            )}
            <span className={styles.year}>{project.year}</span>
          </div>
        ))}
      </div>

      <div className="bottom">
        <div className="about">
          <Link href="/about">about me</Link>
        </div>
        <div className="center">
          {settings?.shopUrl && (
            <div className="shop">
              <a href={settings.shopUrl}>shop</a>
            </div>
          )}
        </div>
        <div className="index">
          <Link href="/">home</Link>
        </div>
      </div>
    </>
  );
}
