"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getPrismaClient } from "@/lib/db/prisma";
import { AdminAuthorizationError } from "@/lib/admin/errors";

export interface SizeGuideActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Helper to revalidate all affected routes for a size guide
 */
async function revalidateSizeGuidePaths(guideId: string, assignedSlugs: string[]) {
  revalidatePath("/admin/size-guides");
  revalidatePath(`/admin/size-guides/${guideId}`);
  revalidatePath("/");
  revalidatePath("/shop");
  for (const slug of assignedSlugs) {
    if (slug) {
      revalidatePath(`/product/${slug}`);
    }
  }
}

/**
 * Secure Server Action to Update Full Size Guide (Metadata, Columns, Rows, and Cells)
 */
export async function updateSizeGuideAction(
  guideId: string,
  _prevState: SizeGuideActionState,
  formData: FormData
): Promise<SizeGuideActionState> {
  // 1. Authoritative Authorization Check
  try {
    await requireAdmin();
  } catch (authError) {
    if (authError instanceof AdminAuthorizationError) {
      return { success: false, error: authError.message };
    }
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return { success: false, error: "Database service unavailable. Please try again later." };
  }

  const cleanGuideId = guideId ? guideId.trim() : "";
  if (!cleanGuideId) {
    return { success: false, error: "Invalid size guide identifier." };
  }

  try {
    // 2. Fetch Existing Size Guide with full relations
    const guide = await prisma.sizeGuide.findUnique({
      where: { id: cleanGuideId },
      include: {
        columns: { orderBy: { sortOrder: "asc" } },
        rows: {
          orderBy: { sortOrder: "asc" },
          include: { cells: true },
        },
        products: {
          select: { slug: true },
        },
      },
    });

    if (!guide) {
      return { success: false, error: "Size guide not found." };
    }

    const fieldErrors: Record<string, string> = {};

    // 3. Validate Metadata
    const rawName = formData.get("name");
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) {
      fieldErrors.name = "Guide name is required.";
    } else if (name.length > 100) {
      fieldErrors.name = "Guide name must not exceed 100 characters.";
    }

    const rawUnit = formData.get("unit");
    const unit = typeof rawUnit === "string" ? rawUnit.trim() : "";
    if (!unit) {
      fieldErrors.unit = "Measurement unit is required.";
    } else if (unit.length > 20) {
      fieldErrors.unit = "Unit must not exceed 20 characters.";
    }

    const rawNotes = formData.get("notes");
    const notes = typeof rawNotes === "string" ? rawNotes.trim() : "";
    if (notes.length > 1000) {
      fieldErrors.notes = "Notes must not exceed 1,000 characters.";
    }

    // 4. Validate & Collect Column Updates
    const columnUpdates: { id: string; label: string; sortOrder: number }[] = [];
    const seenColumnLabels = new Set<string>();

    for (const col of guide.columns) {
      const rawColLabel = formData.get(`column_label_${col.id}`);
      const colLabel = typeof rawColLabel === "string" ? rawColLabel.trim() : col.label;

      if (!colLabel) {
        fieldErrors[`column_label_${col.id}`] = "Column label cannot be empty.";
      } else if (colLabel.length > 50) {
        fieldErrors[`column_label_${col.id}`] = "Column label must not exceed 50 characters.";
      } else {
        const lower = colLabel.toLowerCase();
        if (seenColumnLabels.has(lower)) {
          fieldErrors[`column_label_${col.id}`] = `Duplicate column label "${colLabel}".`;
        } else {
          seenColumnLabels.add(lower);
        }
      }

      const rawColSort = formData.get(`column_sort_${col.id}`);
      let colSort = col.sortOrder;
      if (rawColSort !== null && rawColSort !== undefined && String(rawColSort).trim() !== "") {
        const parsed = parseInt(String(rawColSort).trim(), 10);
        if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
          colSort = parsed;
        }
      }

      columnUpdates.push({ id: col.id, label: colLabel, sortOrder: colSort });
    }

    // 5. Validate & Collect Row Updates
    const rowUpdates: { id: string; label: string; sortOrder: number }[] = [];
    const seenRowLabels = new Set<string>();

    for (const row of guide.rows) {
      const rawRowLabel = formData.get(`row_label_${row.id}`);
      const rowLabel = typeof rawRowLabel === "string" ? rawRowLabel.trim() : row.label;

      if (!rowLabel) {
        fieldErrors[`row_label_${row.id}`] = "Size label cannot be empty.";
      } else if (rowLabel.length > 50) {
        fieldErrors[`row_label_${row.id}`] = "Size label must not exceed 50 characters.";
      } else {
        const lower = rowLabel.toLowerCase();
        if (seenRowLabels.has(lower)) {
          fieldErrors[`row_label_${row.id}`] = `Duplicate size label "${rowLabel}".`;
        } else {
          seenRowLabels.add(lower);
        }
      }

      const rawRowSort = formData.get(`row_sort_${row.id}`);
      let rowSort = row.sortOrder;
      if (rawRowSort !== null && rawRowSort !== undefined && String(rawRowSort).trim() !== "") {
        const parsed = parseInt(String(rawRowSort).trim(), 10);
        if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
          rowSort = parsed;
        }
      }

      rowUpdates.push({ id: row.id, label: rowLabel, sortOrder: rowSort });
    }

    // 6. Collect Cell Values
    const cellUpdates: { rowId: string; columnId: string; value: string }[] = [];
    for (const r of guide.rows) {
      for (const c of guide.columns) {
        const rawCellValue = formData.get(`cell_${r.id}_${c.id}`);
        const cellValue = typeof rawCellValue === "string" ? rawCellValue.trim() : "";
        cellUpdates.push({ rowId: r.id, columnId: c.id, value: cellValue });
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the validation errors in the size guide before saving.",
        fieldErrors,
      };
    }

    // 7. Atomic Transactional Persistence
    await prisma.$transaction(async (tx) => {
      // Update metadata
      await tx.sizeGuide.update({
        where: { id: guide.id },
        data: {
          name,
          unit,
          notes: notes || null,
        },
      });

      // Update columns
      for (const col of columnUpdates) {
        await tx.sizeGuideColumn.update({
          where: { id: col.id },
          data: {
            label: col.label,
            sortOrder: col.sortOrder,
          },
        });
      }

      // Update rows
      for (const row of rowUpdates) {
        await tx.sizeGuideRow.update({
          where: { id: row.id },
          data: {
            label: row.label,
            sortOrder: row.sortOrder,
          },
        });
      }

      // Upsert cells
      for (const cell of cellUpdates) {
        await tx.sizeGuideCell.upsert({
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
            rowId: cell.rowId,
            columnId: cell.columnId,
            value: cell.value,
          },
        });
      }
    });

    // 8. Revalidate Paths
    const assignedSlugs = guide.products.map((p) => p.slug);
    await revalidateSizeGuidePaths(guide.id, assignedSlugs);

    return {
      success: true,
      message: "Size guide updated successfully.",
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Size Guide Update] Error updating size guide ${cleanGuideId}:`,
      error
    );
    return {
      success: false,
      error: "Unable to update size guide. Please try again.",
    };
  }
}

/**
 * Secure Server Action to Add a New Size Row
 */
export async function createSizeGuideRowAction(
  guideId: string,
  _prevState: SizeGuideActionState,
  formData: FormData
): Promise<SizeGuideActionState> {
  try {
    await requireAdmin();
  } catch (authError) {
    if (authError instanceof AdminAuthorizationError) {
      return { success: false, error: authError.message };
    }
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return { success: false, error: "Database service unavailable. Please try again later." };
  }

  const cleanGuideId = guideId ? guideId.trim() : "";
  if (!cleanGuideId) {
    return { success: false, error: "Invalid size guide identifier." };
  }

  try {
    const guide = await prisma.sizeGuide.findUnique({
      where: { id: cleanGuideId },
      include: {
        columns: true,
        rows: true,
        products: { select: { slug: true } },
      },
    });

    if (!guide) {
      return { success: false, error: "Size guide not found." };
    }

    const fieldErrors: Record<string, string> = {};

    const rawLabel = formData.get("label");
    const label = typeof rawLabel === "string" ? rawLabel.trim() : "";
    if (!label) {
      fieldErrors.label = "Size label is required (e.g. XL, 34).";
    } else if (label.length > 50) {
      fieldErrors.label = "Size label must not exceed 50 characters.";
    } else {
      const duplicate = guide.rows.some(
        (r) => r.label.trim().toLowerCase() === label.toLowerCase()
      );
      if (duplicate) {
        fieldErrors.label = `A size row with label "${label}" already exists in this guide.`;
      }
    }

    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = guide.rows.length;
    if (rawSortOrder !== null && rawSortOrder !== undefined && String(rawSortOrder).trim() !== "") {
      const parsed = parseInt(String(rawSortOrder).trim(), 10);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        sortOrder = parsed;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the errors before creating the size row.",
        fieldErrors,
      };
    }

    // Atomic Creation of Row and Empty Cells for each existing Column
    await prisma.$transaction(async (tx) => {
      const newRow = await tx.sizeGuideRow.create({
        data: {
          guideId: guide.id,
          label,
          sortOrder,
        },
      });

      for (const col of guide.columns) {
        const rawVal = formData.get(`cell_${col.id}`);
        const cellVal = typeof rawVal === "string" ? rawVal.trim() : "";
        await tx.sizeGuideCell.create({
          data: {
            rowId: newRow.id,
            columnId: col.id,
            value: cellVal,
          },
        });
      }
    });

    const assignedSlugs = guide.products.map((p) => p.slug);
    await revalidateSizeGuidePaths(guide.id, assignedSlugs);

    return {
      success: true,
      message: `Size row "${label}" created successfully.`,
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Size Guide Add Row] Error adding size row to guide ${cleanGuideId}:`,
      error
    );
    return {
      success: false,
      error: "Unable to create size row. Please try again.",
    };
  }
}

/**
 * Secure Server Action to Add a New Measurement Column
 */
export async function createSizeGuideColumnAction(
  guideId: string,
  _prevState: SizeGuideActionState,
  formData: FormData
): Promise<SizeGuideActionState> {
  try {
    await requireAdmin();
  } catch (authError) {
    if (authError instanceof AdminAuthorizationError) {
      return { success: false, error: authError.message };
    }
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return { success: false, error: "Database service unavailable. Please try again later." };
  }

  const cleanGuideId = guideId ? guideId.trim() : "";
  if (!cleanGuideId) {
    return { success: false, error: "Invalid size guide identifier." };
  }

  try {
    const guide = await prisma.sizeGuide.findUnique({
      where: { id: cleanGuideId },
      include: {
        columns: true,
        rows: true,
        products: { select: { slug: true } },
      },
    });

    if (!guide) {
      return { success: false, error: "Size guide not found." };
    }

    const fieldErrors: Record<string, string> = {};

    const rawLabel = formData.get("label");
    const label = typeof rawLabel === "string" ? rawLabel.trim() : "";
    if (!label) {
      fieldErrors.label = "Column name is required (e.g. CHEST, SLEEVE).";
    } else if (label.length > 50) {
      fieldErrors.label = "Column name must not exceed 50 characters.";
    } else {
      const duplicate = guide.columns.some(
        (c) => c.label.trim().toLowerCase() === label.toLowerCase()
      );
      if (duplicate) {
        fieldErrors.label = `A measurement column with label "${label}" already exists in this guide.`;
      }
    }

    const rawSortOrder = formData.get("sortOrder");
    let sortOrder = guide.columns.length;
    if (rawSortOrder !== null && rawSortOrder !== undefined && String(rawSortOrder).trim() !== "") {
      const parsed = parseInt(String(rawSortOrder).trim(), 10);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        sortOrder = parsed;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please fix the errors before creating the measurement column.",
        fieldErrors,
      };
    }

    // Generate unique key
    let baseKey = label
      .toUpperCase()
      .replace(/[^A-Z0-9_]/g, "_")
      .slice(0, 30);
    if (!baseKey) baseKey = "COL";

    let keyCandidate = baseKey;
    let suffix = 1;
    while (guide.columns.some((c) => c.key === keyCandidate)) {
      keyCandidate = `${baseKey}_${suffix++}`;
    }

    // Atomic Creation of Column and Empty Cells for each existing Row
    await prisma.$transaction(async (tx) => {
      const newCol = await tx.sizeGuideColumn.create({
        data: {
          guideId: guide.id,
          key: keyCandidate,
          label,
          sortOrder,
        },
      });

      for (const row of guide.rows) {
        const rawVal = formData.get(`cell_${row.id}`);
        const cellVal = typeof rawVal === "string" ? rawVal.trim() : "";
        await tx.sizeGuideCell.create({
          data: {
            rowId: row.id,
            columnId: newCol.id,
            value: cellVal,
          },
        });
      }
    });

    const assignedSlugs = guide.products.map((p) => p.slug);
    await revalidateSizeGuidePaths(guide.id, assignedSlugs);

    return {
      success: true,
      message: `Measurement column "${label}" created successfully.`,
    };
  } catch (error) {
    console.error(
      `[METRONARY Admin Size Guide Add Column] Error adding column to guide ${cleanGuideId}:`,
      error
    );
    return {
      success: false,
      error: "Unable to create measurement column. Please try again.",
    };
  }
}
