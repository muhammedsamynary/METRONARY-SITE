/**
 * METRONARY — Gradient Engine Types
 *
 * The COLORS are always within the METRONARY fiery palette.
 * Only the COMPOSITION changes per page / product.
 */

/**
 * A single blob in the gradient composition.
 * Position is expressed as 0–100 (percentage of the container).
 */
export interface GradientBlob {
  /** Horizontal position 0–100 */
  x: number;
  /** Vertical position 0–100 */
  y: number;
  /** Radius as percentage of container width */
  radius: number;
  /** CSS color — must stay within METRONARY fiery palette */
  color: string;
  /** Opacity 0–1 */
  opacity: number;
}

/**
 * Full gradient composition descriptor.
 * This is what future product data / admin settings will store.
 */
export interface GradientTheme {
  /** Human-readable preset name */
  name: string;
  /** Warm base fill color (darkest layer, CSS color) */
  baseColor: string;
  /** Ordered array of gradient blobs (rendered back-to-front) */
  blobs: GradientBlob[];
  /**
   * Optional overall rotation of the blob composition (degrees).
   * Applied via CSS transform on the blob container.
   */
  rotation?: number;
  /**
   * 0–1: how strongly the supplied gradient artwork image is blended on top.
   * 0 = hidden, 1 = full opacity of the image layer.
   */
  artworkOpacity?: number;
  /**
   * 0–1: strength of the grain/noise overlay.
   * Default: 0.04
   */
  grainOpacity?: number;
}

/**
 * Named preset keys — expand as more compositions are created.
 */
export type GradientPresetKey =
  | "default"
  | "product-a"
  | "product-b"
  | "product-c"
  | "shop"
  | "about";
