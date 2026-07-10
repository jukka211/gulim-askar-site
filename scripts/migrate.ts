/**
 * One-off migration: reads content out of the original static HTML site
 * (one level up from this repo) and writes it into Sanity.
 * Safe to re-run: projects/settings use fixed _ids (createOrReplace), and
 * Sanity dedupes re-uploaded image assets by content hash.
 *
 * Usage: npm run migrate   (requires NEXT_PUBLIC_SANITY_PROJECT_ID,
 * NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in web/.env.local)
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import * as cheerio from "cheerio";

const SITE_ROOT = path.resolve(__dirname, "../../");

loadEnv({ path: path.resolve(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in web/.env.local"
  );
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-09",
  useCdn: false,
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function textToBlocks(html: string) {
  const paragraphs = html
    .split(/<br\s*\/?>/i)
    .map((p) => p.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

  return paragraphs.map((text) => ({
    _type: "block",
    _key: cryptoRandomKey(),
    style: "normal",
    children: [{ _type: "span", _key: cryptoRandomKey(), text, marks: [] }],
    markDefs: [],
  }));
}

function cryptoRandomKey() {
  return Math.random().toString(36).slice(2, 10);
}

async function uploadImage(absPath: string) {
  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload("image", stream, {
    filename: path.basename(absPath),
  });
  return asset._id;
}

const PROJECT_FOLDERS = [
  "project-02",
  "project-03",
  "project-04",
  "project-05",
  "project-06",
  "project-07",
  "project-08",
  "project-09",
  "project-10",
];

async function migrateProject(folder: string, order: number) {
  const htmlPath = path.join(
    SITE_ROOT,
    folder,
    `project-page-${folder.split("-")[1]}.html`
  );
  if (!fs.existsSync(htmlPath)) {
    console.warn(`skip ${folder}: no ${htmlPath}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, "utf-8");
  const $ = cheerio.load(html);

  const secs = $(".container .sec");
  const title = secs.eq(0).find(".title-2").first().text().trim();
  const descriptionHtml = secs.eq(1).find(".text").html() ?? "";
  const material = secs.eq(2).find(".title-row").eq(0).find(".title-2").text().trim();
  const year = secs.eq(2).find(".title-row").eq(1).find(".title-2").text().trim();

  const imgSrcs = $(".image-gallery img")
    .map((_, el) => $(el).attr("src"))
    .get()
    .filter(Boolean) as string[];

  console.log(`\n${folder}: "${title}" (${imgSrcs.length} images)`);

  const galleryRefs: { _type: "image"; _key: string; asset: { _type: "reference"; _ref: string } }[] = [];
  for (const src of imgSrcs) {
    const absImgPath = path.join(SITE_ROOT, folder, src);
    if (!fs.existsSync(absImgPath)) {
      console.warn(`  missing image on disk: ${absImgPath}`);
      continue;
    }
    const assetId = await uploadImage(absImgPath);
    galleryRefs.push({
      _type: "image",
      _key: cryptoRandomKey(),
      asset: { _type: "reference", _ref: assetId },
    });
  }

  const doc = {
    _id: folder,
    _type: "project",
    title,
    slug: { _type: "slug", current: slugify(title) || folder },
    order,
    material,
    year,
    description: textToBlocks(descriptionHtml),
    gallery: galleryRefs,
    ...(galleryRefs[0]
      ? {
          indexThumbnail: {
            _type: "image",
            asset: { _type: "reference", _ref: galleryRefs[0].asset._ref },
          },
        }
      : {}),
  };

  await client.createOrReplace(doc);
  console.log(`  saved ${folder} -> slug "${doc.slug.current}"`);
}

async function migrateAboutAndSettings() {
  const htmlPath = path.join(SITE_ROOT, "about-page", "about-page.html");
  if (!fs.existsSync(htmlPath)) {
    console.warn("skip about page: file not found");
    return;
  }
  const html = fs.readFileSync(htmlPath, "utf-8");
  const $ = cheerio.load(html);

  const rows = $(".container .title-row");
  const getValue = (label: string) =>
    rows
      .filter((_, el) => $(el).find(".title").text().trim().startsWith(label))
      .first()
      .find(".title-2")
      .text()
      .trim();

  const aboutName = getValue("Name");
  const aboutOrigination = getValue("Origination");
  const aboutBirthYear = getValue("Year");

  const bioTexts = $(".two-columns .text")
    .map((_, el) => $(el).html() ?? "")
    .get();
  const aboutBio = bioTexts.flatMap((t) => textToBlocks(t));

  const email = $('a[href^="mailto:"]').first().attr("href")?.replace("mailto:", "");
  const instagramUrl = $('a[href*="instagram.com"]').first().attr("href");

  const portraitPath = path.join(SITE_ROOT, "about-page", "portrait.jpg");
  let aboutPortrait: unknown = undefined;
  if (fs.existsSync(portraitPath)) {
    const assetId = await uploadImage(portraitPath);
    aboutPortrait = { _type: "image", asset: { _type: "reference", _ref: assetId } };
  }

  // "what's on" banner from the homepage — dated event listings that are
  // very likely stale by now; imported as a starting point to edit in Studio.
  const indexHtmlPath = path.join(SITE_ROOT, "index.html");
  let whatsOn: unknown[] = [];
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
    const $$ = cheerio.load(indexHtml);
    const whatsOnHtml = $$(".whatson .text").html() ?? "";
    whatsOn = textToBlocks(whatsOnHtml);
  }

  const shopUrl = "https://shop.gulimaskar.com";

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    aboutName,
    aboutOrigination,
    aboutBirthYear,
    aboutBio,
    ...(aboutPortrait ? { aboutPortrait } : {}),
    email,
    instagramUrl,
    shopUrl,
    whatsOn,
  });

  console.log(`\nsiteSettings saved (name="${aboutName}")`);
}

async function main() {
  console.log(`Migrating into Sanity project ${projectId} / dataset ${dataset}`);

  let order = 1;
  for (const folder of PROJECT_FOLDERS) {
    await migrateProject(folder, order);
    order++;
  }

  await migrateAboutAndSettings();

  console.log(
    "\nDone. NOTE: project-01, project-11, \"project-07 - Kopie\", and the " +
      "homepage's own images/ folder were not present in the source and were " +
      "not migrated — see the migration summary for details."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
