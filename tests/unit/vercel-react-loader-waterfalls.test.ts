import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCatalog, fetchCategory, fetchFacets } from "@/catalog/public/public.functions";
import {
  fetchArticles,
  fetchContentCategories,
  fetchContentCategory,
} from "@/content/public/public.functions";

vi.mock("@/catalog/public/public.functions", () => ({
  fetchCatalog: vi.fn(),
  fetchCategory: vi.fn(),
  fetchFacets: vi.fn(),
}));

vi.mock("@/content/public/public.functions", () => ({
  fetchArticles: vi.fn(),
  fetchContentCategories: vi.fn(),
  fetchContentCategory: vi.fn(),
  fetchArticlesForFamilies: vi.fn(),
}));

import { Route as SearchRoute } from "@/routes/busca";
import { Route as ContentCategoryRoute } from "@/routes/conteudos/categoria.$slug";
import { Route as ProductCategoryRoute } from "@/routes/produtos/$categorySlug/index";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

const catalogResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 12,
  pageCount: 1,
};

const contentResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 9,
  pageCount: 1,
};

describe("loaders públicos sem waterfalls evitáveis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchCatalog).mockResolvedValue(catalogResult as never);
    vi.mocked(fetchArticles).mockResolvedValue(contentResult as never);
    vi.mocked(fetchContentCategories).mockResolvedValue([] as never);
  });

  it("/busca inicia catálogo e conteúdo sem aguardar facets", async () => {
    const facets = deferred<{ applications: unknown[]; categories: unknown[] }>();
    vi.mocked(fetchFacets).mockReturnValue(facets.promise as never);

    const loader = SearchRoute.options.loader as (ctx: unknown) => Promise<unknown>;
    const pending = loader({ deps: { q: "agulha" } });

    await Promise.resolve();

    expect(fetchCatalog).toHaveBeenCalledTimes(1);
    expect(fetchArticles).toHaveBeenCalledTimes(1);

    facets.resolve({ applications: [], categories: [] });
    await pending;
  });

  it("/produtos/$categorySlug inicia catálogo sem aguardar categoria", async () => {
    const category = deferred<{
      name: string;
      description: null;
      familyCount: number;
      productCount: number;
    }>();
    vi.mocked(fetchCategory).mockReturnValue(category.promise as never);

    const loader = ProductCategoryRoute.options.loader as (ctx: unknown) => Promise<unknown>;
    const pending = loader({ params: { categorySlug: "agulhas" } });

    await Promise.resolve();

    expect(fetchCatalog).toHaveBeenCalledTimes(1);

    category.resolve({
      name: "Agulhas",
      description: null,
      familyCount: 0,
      productCount: 0,
    });
    await pending;
  });

  it("/conteudos/categoria/$slug inicia listagens sem aguardar categoria", async () => {
    const category = deferred<{
      slug: string;
      name: string;
      description: null;
      articleCount: number;
    }>();
    vi.mocked(fetchContentCategory).mockReturnValue(category.promise as never);

    const loader = ContentCategoryRoute.options.loader as (ctx: unknown) => Promise<unknown>;
    const pending = loader({ params: { slug: "manejo" } });

    await Promise.resolve();

    expect(fetchArticles).toHaveBeenCalledTimes(1);
    expect(fetchContentCategories).toHaveBeenCalledTimes(1);

    category.resolve({ slug: "manejo", name: "Manejo", description: null, articleCount: 0 });
    await pending;
  });
});
