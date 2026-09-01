import "dotenv/config";
import { PrismaClient, StockStatus } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * METRONARY Database Seeder (Deterministic & Idempotent)
 *
 * Rules:
 * 1. Strictly deterministic IDs (e.g. prod-fearless, var-digital-s, guide-cargo-shorts).
 * 2. Real confirmed product data ONLY (prices: null, descriptions: null, stock: UNKNOWN).
 * 3. Exact confirmed shorts measurements (S: 52/44/30, M: 56/48/33, L: 61/54/36). No XL.
 * 4. Tops have ZERO variants seeded.
 * 5. Uses upserts so running multiple times causes zero data duplication.
 */

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.trim() === "") {
    console.error("[METRONARY SEED] Cannot run seed: DATABASE_URL is not set.");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("[METRONARY SEED] Starting idempotent database seed...");

  // ─── 1. SEED REUSABLE SIZE GUIDE ───
  console.log("[METRONARY SEED] Seeding Cargo Shorts Size Guide...");
  const sizeGuide = await prisma.sizeGuide.upsert({
    where: { id: "guide-cargo-shorts" },
    update: {
      name: "Cargo Shorts Size Guide",
      unit: "CM",
    },
    create: {
      id: "guide-cargo-shorts",
      name: "Cargo Shorts Size Guide",
      unit: "CM",
    },
  });

  // Columns: LENGTH, WAIST, LEG OPENING
  const columnsData = [
    { id: "col-cargo-length", key: "length", label: "LENGTH", sortOrder: 0 },
    { id: "col-cargo-waist", key: "waist", label: "WAIST", sortOrder: 1 },
    { id: "col-cargo-leg", key: "legOpening", label: "LEG OPENING", sortOrder: 2 },
  ];

  for (const col of columnsData) {
    await prisma.sizeGuideColumn.upsert({
      where: {
        guideId_key: {
          guideId: sizeGuide.id,
          key: col.key,
        },
      },
      update: {
        label: col.label,
        sortOrder: col.sortOrder,
      },
      create: {
        id: col.id,
        guideId: sizeGuide.id,
        key: col.key,
        label: col.label,
        sortOrder: col.sortOrder,
      },
    });
  }

  // Rows: S, M, L
  const rowsData = [
    { id: "row-cargo-s", label: "S", sortOrder: 0 },
    { id: "row-cargo-m", label: "M", sortOrder: 1 },
    { id: "row-cargo-l", label: "L", sortOrder: 2 },
  ];

  for (const row of rowsData) {
    await prisma.sizeGuideRow.upsert({
      where: {
        guideId_label: {
          guideId: sizeGuide.id,
          label: row.label,
        },
      },
      update: {
        sortOrder: row.sortOrder,
      },
      create: {
        id: row.id,
        guideId: sizeGuide.id,
        label: row.label,
        sortOrder: row.sortOrder,
      },
    });
  }

  // Cells: Exact verified CM measurements
  const cellsData = [
    // S: 52, 44, 30
    { id: "cell-s-length", rowId: "row-cargo-s", columnId: "col-cargo-length", value: "52" },
    { id: "cell-s-waist", rowId: "row-cargo-s", columnId: "col-cargo-waist", value: "44" },
    { id: "cell-s-leg", rowId: "row-cargo-s", columnId: "col-cargo-leg", value: "30" },
    // M: 56, 48, 33
    { id: "cell-m-length", rowId: "row-cargo-m", columnId: "col-cargo-length", value: "56" },
    { id: "cell-m-waist", rowId: "row-cargo-m", columnId: "col-cargo-waist", value: "48" },
    { id: "cell-m-leg", rowId: "row-cargo-m", columnId: "col-cargo-leg", value: "33" },
    // L: 61, 54, 36
    { id: "cell-l-length", rowId: "row-cargo-l", columnId: "col-cargo-length", value: "61" },
    { id: "cell-l-waist", rowId: "row-cargo-l", columnId: "col-cargo-waist", value: "54" },
    { id: "cell-l-leg", rowId: "row-cargo-l", columnId: "col-cargo-leg", value: "36" },
  ];

  for (const cell of cellsData) {
    await prisma.sizeGuideCell.upsert({
      where: {
        rowId_columnId: {
          rowId: cell.rowId,
          columnId: cell.columnId,
        },
      },
      update: {
        value: cell.value,
      },
      create: {
        id: cell.id,
        rowId: cell.rowId,
        columnId: cell.columnId,
        value: cell.value,
      },
    });
  }

  // ─── 2. SEED 10 VERIFIED CATALOG PRODUCTS ───
  console.log("[METRONARY SEED] Seeding 10 catalog products...");

  const SEED_PRODUCTS = [
    {
      id: "prod-fearless",
      slug: "fearless",
      workingName: "FEARLESS",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/fearless.png",
      hasAlpha: true,
      gradientKey: "fearless",
      active: true,
      featured: true,
      badge: "DROP 01",
      sortOrder: 0,
      tags: ["tee", "graphic", "fearless"],
      sizeGuideId: null,
      images: ["/products/fearless.png"],
      variants: [],
    },
    {
      id: "prod-orange-work-shirt",
      slug: "orange-work-shirt",
      workingName: "CAMP-COLLAR WORK SHIRT",
      officialName: null,
      category: "tops",
      silhouette: "Work Shirt",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/orange-work-shirt.png",
      hasAlpha: true,
      gradientKey: "orange-work-shirt",
      active: true,
      featured: true,
      badge: "NEW SILHOUETTE",
      sortOrder: 1,
      tags: ["shirt", "camp-collar", "orange", "workwear"],
      sizeGuideId: null,
      images: ["/products/orange-work-shirt.png"],
      variants: [],
    },
    {
      id: "prod-1973",
      slug: "1973",
      workingName: "1973",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/1973.png",
      hasAlpha: true,
      gradientKey: "1973",
      active: true,
      featured: true,
      badge: "ARCHIVE",
      sortOrder: 2,
      tags: ["tee", "1973", "black", "graphic"],
      sizeGuideId: null,
      images: ["/products/1973.png"],
      variants: [],
    },
    {
      id: "prod-look-at-sky",
      slug: "look-at-sky",
      workingName: "LOOK AT THE SKY",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/look-at-sky.png",
      hasAlpha: true,
      gradientKey: "look-at-sky",
      active: true,
      featured: true,
      badge: null,
      sortOrder: 3,
      tags: ["tee", "graphic", "black"],
      sizeGuideId: null,
      images: ["/products/look-at-sky.png"],
      variants: [],
    },
    {
      id: "prod-old-boy-w",
      slug: "old-boy-w",
      workingName: "OLD BOY WHITE",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/old-boy-w.png",
      hasAlpha: true,
      gradientKey: "old-boy-w",
      active: true,
      featured: true,
      badge: null,
      sortOrder: 4,
      tags: ["tee", "white"],
      sizeGuideId: null,
      images: ["/products/old-boy-w.png"],
      variants: [],
    },
    {
      id: "prod-old-boy",
      slug: "old-boy",
      workingName: "OLD BOY",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/old-boy.png",
      hasAlpha: true,
      gradientKey: "old-boy",
      active: true,
      featured: false,
      badge: null,
      sortOrder: 5,
      tags: ["tee", "black", "graphic"],
      sizeGuideId: null,
      images: ["/products/old-boy.png"],
      variants: [],
    },
    {
      id: "prod-time",
      slug: "time",
      workingName: "TIME",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/time.png",
      hasAlpha: true,
      gradientKey: "time",
      active: true,
      featured: false,
      badge: null,
      sortOrder: 6,
      tags: ["tee", "time", "graphic"],
      sizeGuideId: null,
      images: ["/products/time.png"],
      variants: [],
    },
    {
      id: "prod-decorative",
      slug: "decorarive",
      workingName: "DECORATIVE",
      officialName: null,
      category: "tops",
      silhouette: "Graphic Tee",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/decorarive.png",
      hasAlpha: true,
      gradientKey: "decorarive",
      active: true,
      featured: false,
      badge: null,
      sortOrder: 7,
      tags: ["tee", "decorative", "graphic"],
      sizeGuideId: null,
      images: ["/products/decorarive.png"],
      variants: [],
    },
    {
      id: "prod-digital-camo-shorts",
      slug: "digital-camo-shorts",
      workingName: "DIGITAL CAMO SHORTS",
      officialName: null,
      category: "shorts",
      silhouette: "Cargo Shorts",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/digital-camo-shorts.png",
      hasAlpha: true,
      gradientKey: "digital-camo-shorts",
      active: true,
      featured: true,
      badge: "COLLECTION",
      sortOrder: 8,
      tags: ["shorts", "camo", "digital", "bottoms"],
      sizeGuideId: "guide-cargo-shorts",
      images: ["/products/digital-camo-shorts.png"],
      variants: [
        {
          id: "var-digital-s",
          size: "S",
          sku: "METRO-SHRT-DIGI-S",
          stockStatus: StockStatus.UNKNOWN,
          stockQuantity: null,
          measurements: { length: "52 cm", waist: "44 cm", legOpening: "30 cm" },
          sortOrder: 0,
        },
        {
          id: "var-digital-m",
          size: "M",
          sku: "METRO-SHRT-DIGI-M",
          stockStatus: StockStatus.UNKNOWN,
          stockQuantity: null,
          measurements: { length: "56 cm", waist: "48 cm", legOpening: "33 cm" },
          sortOrder: 1,
        },
        {
          id: "var-digital-l",
          size: "L",
          sku: "METRO-SHRT-DIGI-L",
          stockStatus: StockStatus.UNKNOWN,
          stockQuantity: null,
          measurements: { length: "61 cm", waist: "54 cm", legOpening: "36 cm" },
          sortOrder: 2,
        },
      ],
    },
    {
      id: "prod-desert-camo-shorts",
      slug: "desert-camo-shorts",
      workingName: "DESERT CAMO SHORTS",
      officialName: null,
      category: "shorts",
      silhouette: "Cargo Shorts",
      description: null,
      priceMinor: null,
      currency: "EGP",
      thumbnail: "/products/desert-camo-shorts.png",
      hasAlpha: true,
      gradientKey: "desert-camo-shorts",
      active: true,
      featured: true,
      badge: "COLLECTION",
      sortOrder: 9,
      tags: ["shorts", "desert", "camo", "bottoms"],
      sizeGuideId: "guide-cargo-shorts",
      images: ["/products/desert-camo-shorts.png"],
      variants: [
        {
          id: "var-desert-s",
          size: "S",
          sku: "METRO-SHRT-DSRT-S",
          stockStatus: StockStatus.UNKNOWN,
          stockQuantity: null,
          measurements: { length: "52 cm", waist: "44 cm", legOpening: "30 cm" },
          sortOrder: 0,
        },
        {
          id: "var-desert-m",
          size: "M",
          sku: "METRO-SHRT-DSRT-M",
          stockStatus: StockStatus.UNKNOWN,
          stockQuantity: null,
          measurements: { length: "56 cm", waist: "48 cm", legOpening: "33 cm" },
          sortOrder: 1,
        },
        {
          id: "var-desert-l",
          size: "L",
          sku: "METRO-SHRT-DSRT-L",
          stockStatus: StockStatus.UNKNOWN,
          stockQuantity: null,
          measurements: { length: "61 cm", waist: "54 cm", legOpening: "36 cm" },
          sortOrder: 2,
        },
      ],
    },
  ];

  for (const item of SEED_PRODUCTS) {
    // 1. Upsert Product
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        slug: item.slug,
        workingName: item.workingName,
        officialName: item.officialName,
        category: item.category,
        silhouette: item.silhouette,
        description: item.description,
        priceMinor: item.priceMinor,
        currency: item.currency,
        thumbnail: item.thumbnail,
        hasAlpha: item.hasAlpha,
        gradientKey: item.gradientKey,
        active: item.active,
        featured: item.featured,
        badge: item.badge,
        sortOrder: item.sortOrder,
        tags: item.tags,
        sizeGuideId: item.sizeGuideId,
      },
      create: {
        id: item.id,
        slug: item.slug,
        workingName: item.workingName,
        officialName: item.officialName,
        category: item.category,
        silhouette: item.silhouette,
        description: item.description,
        priceMinor: item.priceMinor,
        currency: item.currency,
        thumbnail: item.thumbnail,
        hasAlpha: item.hasAlpha,
        gradientKey: item.gradientKey,
        active: item.active,
        featured: item.featured,
        badge: item.badge,
        sortOrder: item.sortOrder,
        tags: item.tags,
        sizeGuideId: item.sizeGuideId,
      },
    });

    // 2. Upsert Product Media
    for (let idx = 0; idx < item.images.length; idx++) {
      const mediaId = `media-${item.slug}-${idx + 1}`;
      await prisma.productMedia.upsert({
        where: { id: mediaId },
        update: {
          src: item.images[idx],
          isPrimary: idx === 0,
          hasAlpha: item.hasAlpha,
          sortOrder: idx,
        },
        create: {
          id: mediaId,
          productId: item.id,
          src: item.images[idx],
          alt: `METRONARY ${item.workingName}`,
          isPrimary: idx === 0,
          hasAlpha: item.hasAlpha,
          sortOrder: idx,
        },
      });
    }

    // 3. Upsert Variants (Only exists for shorts)
    for (const variant of item.variants) {
      await prisma.productVariant.upsert({
        where: { id: variant.id },
        update: {
          size: variant.size,
          sku: variant.sku,
          stockStatus: variant.stockStatus,
          stockQuantity: variant.stockQuantity,
          measurements: variant.measurements,
          sortOrder: variant.sortOrder,
        },
        create: {
          id: variant.id,
          productId: item.id,
          size: variant.size,
          sku: variant.sku,
          stockStatus: variant.stockStatus,
          stockQuantity: variant.stockQuantity,
          measurements: variant.measurements,
          sortOrder: variant.sortOrder,
        },
      });
    }
  }

  console.log("[METRONARY SEED] Seed completed successfully.");
}

main().catch((e) => {
  console.error("[METRONARY SEED ERROR]", e);
  process.exit(1);
});
