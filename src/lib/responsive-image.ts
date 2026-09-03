const PUBLIC_OBJECT_SEGMENT = "/storage/v1/object/public/";
const PUBLIC_RENDER_SEGMENT = "/storage/v1/render/image/public/";
const MAX_TRANSFORM_WIDTH = 2500;

export interface ResponsiveImageOptions {
  widths: readonly number[];
  sizes: string;
  originalWidth?: number | null;
}

export function responsiveImageProps(
  source: string,
  options: ResponsiveImageOptions,
): { srcSet?: string; sizes?: string } {
  const base = toRenderUrl(source);
  if (!base) return {};

  let widths = [...new Set(options.widths)]
    .filter((width) => Number.isInteger(width) && width > 0 && width <= MAX_TRANSFORM_WIDTH)
    .sort((a, b) => a - b);

  if (options.originalWidth && options.originalWidth > 0) {
    widths = widths.filter((width) => width <= options.originalWidth!);
    if (widths.length === 0) {
      widths = [Math.min(Math.round(options.originalWidth), MAX_TRANSFORM_WIDTH)];
    }
  }

  if (widths.length === 0) return {};

  const srcSet = widths
    .map((width) => {
      const url = new URL(base.toString());
      url.searchParams.set("width", String(width));
      url.searchParams.set("resize", "contain");
      return `${url.toString()} ${width}w`;
    })
    .join(", ");

  return { srcSet, sizes: options.sizes };
}

function toRenderUrl(source: string): URL | null {
  try {
    const url = new URL(source);
    if (url.pathname.includes(PUBLIC_OBJECT_SEGMENT)) {
      url.pathname = url.pathname.replace(PUBLIC_OBJECT_SEGMENT, PUBLIC_RENDER_SEGMENT);
    } else if (!url.pathname.includes(PUBLIC_RENDER_SEGMENT)) {
      return null;
    }

    url.searchParams.delete("width");
    url.searchParams.delete("height");
    return url;
  } catch {
    return null;
  }
}

export function fallbackToOriginalImage(
  event: { currentTarget: HTMLImageElement },
  source: string,
): void {
  const image = event.currentTarget;
  if (image.dataset.responsiveFallback === "true") return;

  image.dataset.responsiveFallback = "true";
  image.srcset = "";
  image.removeAttribute("sizes");
  if (image.src !== source) image.src = source;
}
