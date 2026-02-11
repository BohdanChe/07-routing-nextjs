import { getNotes } from "@/lib /api";
import { Metadata } from "next";
import NotesClient from "./Notes.client";

// -------------------------
// Генерація мета-тегів
// -------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}): Promise<Metadata> {
  // Якщо params — Promise, потрібно дочекатися
  const resolvedParams = params instanceof Promise ? await params : params;
  const filter = resolvedParams.slug.join(", ");

  return {
    title: `Notes filtered by: ${filter}`,
    description: `Notes filtered by ${filter}.`,
    openGraph: {
      title: `Notes filtered by: ${filter}`,
      description: `Notes filtered by ${filter}.`,
      url: `https://notehub.com/notes/filter/${resolvedParams.slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${filter}`,
        },
      ],
    },
  };
}

// -------------------------
// Тип для параметрів маршруту
// -------------------------
type Props = {
  params: Promise<{ slug: string[] }> | { slug: string[] };
};

// -------------------------
// Асинхронний компонент сторінки
// -------------------------
export default async function NotesPage({ params }: Props) {
  // Дочекаємося params
  const { slug } = params instanceof Promise ? await params : params;

  const tagNote = slug[0] === "all" ? undefined : slug[0];

  const { notes, totalPages } = await getNotes("", 1, tagNote);

  return (
    <section>
      <NotesClient initialData={{ notes, totalPages }} initialTag={tagNote} />
    </section>
  );
}
