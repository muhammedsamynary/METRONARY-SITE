import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";

export interface AdminSizeGuideProductRef {
  id: string;
  name: string;
  slug: string;
  category?: string;
  active?: boolean;
}

export interface AdminSizeGuideListItem {
  id: string;
  name: string;
  unit: string;
  notes: string | null;
  columnCount: number;
  rowCount: number;
  cellCount: number;
  assignedProducts: AdminSizeGuideProductRef[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminSizeGuideOverviewStats {
  totalGuides: number;
  totalProductsAssigned: number;
  totalRows: number;
  totalMeasurements: number;
}

export interface AdminSizeGuideOverviewResult {
  guides: AdminSizeGuideListItem[];
  stats: AdminSizeGuideOverviewStats;
}

export interface AdminSizeGuideDetailColumn {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
}

export interface AdminSizeGuideDetailRow {
  id: string;
  label: string;
  sortOrder: number;
  cells: Record<string, string>; // columnId -> cell value
}

export interface AdminSizeGuideDetailResult {
  id: string;
  name: string;
  unit: string;
  notes: string | null;
  columns: AdminSizeGuideDetailColumn[];
  rows: AdminSizeGuideDetailRow[];
  assignedProducts: AdminSizeGuideProductRef[];
  stats: {
    columnCount: number;
    rowCount: number;
    cellCount: number;
    assignedProductCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch All Size Guides for Admin Management Overview
 */
export async function getAdminSizeGuides(): Promise<AdminSizeGuideOverviewResult> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return {
      guides: [],
      stats: {
        totalGuides: 0,
        totalProductsAssigned: 0,
        totalRows: 0,
        totalMeasurements: 0,
      },
    };
  }

  try {
    const rawGuides = await prisma.sizeGuide.findMany({
      orderBy: { name: "asc" },
      include: {
        columns: {
          orderBy: { sortOrder: "asc" },
          select: { id: true },
        },
        rows: {
          orderBy: { sortOrder: "asc" },
          include: {
            cells: {
              select: { id: true },
            },
          },
        },
        products: {
          select: {
            id: true,
            workingName: true,
            officialName: true,
            slug: true,
            category: true,
            active: true,
          },
          orderBy: { workingName: "asc" },
        },
      },
    });

    let totalProductsAssigned = 0;
    let totalRows = 0;
    let totalMeasurements = 0;

    const guides: AdminSizeGuideListItem[] = rawGuides.map((g) => {
      const columnCount = g.columns.length;
      const rowCount = g.rows.length;
      let cellCount = 0;
      for (const r of g.rows) {
        cellCount += r.cells.length;
      }

      totalProductsAssigned += g.products.length;
      totalRows += rowCount;
      totalMeasurements += cellCount;

      const assignedProducts: AdminSizeGuideProductRef[] = g.products.map(
        (p) => ({
          id: p.id,
          name: p.officialName?.trim() || p.workingName,
          slug: p.slug,
          category: p.category,
          active: p.active,
        })
      );

      return {
        id: g.id,
        name: g.name,
        unit: g.unit,
        notes: g.notes,
        columnCount,
        rowCount,
        cellCount,
        assignedProducts,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
      };
    });

    return {
      guides,
      stats: {
        totalGuides: guides.length,
        totalProductsAssigned,
        totalRows,
        totalMeasurements,
      },
    };
  } catch (error) {
    console.error(
      "[METRONARY Admin Size Guides] Failed to fetch overview:",
      error
    );
    return {
      guides: [],
      stats: {
        totalGuides: 0,
        totalProductsAssigned: 0,
        totalRows: 0,
        totalMeasurements: 0,
      },
    };
  }
}

/**
 * Fetch Detailed Size Guide with Normalized Matrix for Admin Inspection
 */
export async function getAdminSizeGuideById(
  id: string
): Promise<AdminSizeGuideDetailResult | null> {
  const prisma = getPrismaClient();
  if (!prisma) return null;

  try {
    const rawGuide = await prisma.sizeGuide.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { sortOrder: "asc" },
        },
        rows: {
          orderBy: { sortOrder: "asc" },
          include: {
            cells: true,
          },
        },
        products: {
          select: {
            id: true,
            workingName: true,
            officialName: true,
            slug: true,
            category: true,
            active: true,
          },
          orderBy: { workingName: "asc" },
        },
      },
    });

    if (!rawGuide) return null;

    // Ordered columns
    const columns: AdminSizeGuideDetailColumn[] = rawGuide.columns.map((c) => ({
      id: c.id,
      key: c.key,
      label: c.label,
      sortOrder: c.sortOrder,
    }));

    // Ordered rows and mapped cells by columnId
    let totalCells = 0;
    const rows: AdminSizeGuideDetailRow[] = rawGuide.rows.map((r) => {
      const cells: Record<string, string> = {};
      for (const cell of r.cells) {
        cells[cell.columnId] = cell.value;
        totalCells++;
      }

      return {
        id: r.id,
        label: r.label,
        sortOrder: r.sortOrder,
        cells,
      };
    });

    const assignedProducts: AdminSizeGuideProductRef[] = rawGuide.products.map(
      (p) => ({
        id: p.id,
        name: p.officialName?.trim() || p.workingName,
        slug: p.slug,
        category: p.category,
        active: p.active,
      })
    );

    return {
      id: rawGuide.id,
      name: rawGuide.name,
      unit: rawGuide.unit,
      notes: rawGuide.notes,
      columns,
      rows,
      assignedProducts,
      stats: {
        columnCount: columns.length,
        rowCount: rows.length,
        cellCount: totalCells,
        assignedProductCount: assignedProducts.length,
      },
      createdAt: rawGuide.createdAt.toISOString(),
      updatedAt: rawGuide.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Size Guides] Failed to fetch size guide ${id}:`,
      error
    );
    return null;
  }
}
