export interface SpatialCoordinates {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  maxWidth?: string;
  rotation?: number; // degrees
  zIndex?: number;
  hidden?: boolean;
}

export interface FloatingProductData {
  id: string;
  slug: string;
  name: string;
  image: string;
  alt: string;
  isFocal?: boolean;
  priority?: boolean;
  /** Whether the image has transparent alpha cutout or framed canvas */
  hasAlpha?: boolean;
  /** Spatial depth tier for tailored lighting & shadows */
  depthTier?: "foreground" | "midground" | "background";
  /** Parallax depth coefficient (desktop pointer motion) */
  depthFactor?: number;
  /** Asynchronous subtle idle drift animation class */
  idleClass?: "m-idle-1" | "m-idle-2" | "m-idle-3" | "m-idle-4";
  /** Spatial layout configurations across breakpoints */
  layout: {
    desktop: SpatialCoordinates;
    tablet?: SpatialCoordinates;
    mobile?: SpatialCoordinates;
  };
  tag?: string;
}
