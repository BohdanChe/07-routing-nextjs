import { getNotes } from "@/lib /api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

// Типи для параметрів catch-all маршруту
type NotesFilterParams = {
  params: { slug: string[] };
};

// Генерація мета-тегів
export async function generateMetadata({ params }: NotesFilterParams): Promise<Metadata> {
  const { slug } = params;
  const filter = slug.join(", ");

  return {
    title: `Notes filtered by: ${filter}`,
    description: `Notes filtered by ${filter}.`,
    openGraph: {
      title: `Notes filtered by: ${filter}`,
      description: `Notes filtered by ${filter}.`,
      url: `https://notehub.com/notes/filter/${slug.join("/")}`,
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

// Асинхронний компонент сторінки
export default async function NotesPage({ params }: NotesFilterParams) {
  const { slug } = params;
  const tagNote = slug[0] === "all" ? undefined : slug[0];

  const { notes, totalPages } = await getNotes("", 1, tagNote);

  return (
    <section>
      <NotesClient initialData={{ notes, totalPages }} initialTag={tagNote} />
    </section>
  );
}
