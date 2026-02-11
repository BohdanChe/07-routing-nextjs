import { getNotes } from "@/lib /api";
import { Metadata } from "next";
import NotesClient from "./Notes.client";



export async function generateMetadata(
  { params }: { params: { slug: string[] } }
): Promise<Metadata> {
  const filter = params.slug.join(', ')

  return {
    title: `Notes filtered by: ${filter}`,
    description: `Notes filtered by ${filter}.`,

    openGraph: {
      title: `Notes filtered by: ${filter}`,
      description: `Notes filtered by ${filter}.`,
      url: `https://notehub.com/notes/filter/${params.slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${filter}`,
        },
      ],
    },
  }
}



type Props = {
  params: Promise<{ slug: string[] }>;
};
export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const tagNote = slug[0] === "all" ? undefined : slug[0];

  const { notes, totalPages } = await getNotes("", 1, tagNote);

  return (
    <section>
      <NotesClient initialData={{ notes, totalPages }} initialTag={tagNote} />
    </section>
  );
}
