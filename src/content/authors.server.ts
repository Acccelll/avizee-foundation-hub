import type { Authorized } from "@/catalog/guard.server";
import { AppError } from "@/lib/errors";

export interface AuthorManagementRow {
  id: string;
  displayName: string;
  roleTitle: string | null;
  bio: string | null;
  isActive: boolean;
  articleCount: number;
}

/**
 * Visão administrativa de autores com quantidade de artigos vinculados.
 * A leitura respeita RLS e não altera nenhum registro.
 */
export async function listAuthorsForManagement(auth: Authorized): Promise<AuthorManagementRow[]> {
  const [authorsResult, articlesResult] = await Promise.all([
    auth.supabase
      .from("content_authors")
      .select("id, display_name, role_title, bio, is_active")
      .order("display_name"),
    auth.supabase
      .from("content_articles")
      .select("author_id")
      .is("deleted_at", null)
      .not("author_id", "is", null),
  ]);

  if (authorsResult.error) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: authorsResult.error.message });
  }
  if (articlesResult.error) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: articlesResult.error.message });
  }

  const articleCountByAuthor = new Map<string, number>();
  for (const article of articlesResult.data ?? []) {
    const authorId = article.author_id;
    if (!authorId) continue;
    articleCountByAuthor.set(authorId, (articleCountByAuthor.get(authorId) ?? 0) + 1);
  }

  return (authorsResult.data ?? []).map((author) => ({
    id: author.id,
    displayName: author.display_name,
    roleTitle: author.role_title ?? null,
    bio: author.bio ?? null,
    isActive: Boolean(author.is_active),
    articleCount: articleCountByAuthor.get(author.id) ?? 0,
  }));
}
