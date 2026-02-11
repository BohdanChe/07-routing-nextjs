import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getSingleNote } from "@/lib /api";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

// Типи для параметрів маршруту
type NoteDetailsParams = {
  params: { id: string };
};

// Генерація мета-тегів
export async function generateMetadata({ params }: NoteDetailsParams): Promise<Metadata> {
  const { id } = params;

  const note = await getSingleNote(id);
  const description = note.content.slice(0, 100);

  return {
    title: note.title,
    description,
    openGraph: {
      title: note.title,
      description,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

// Асинхронний компонент сторінки
const NoteDetails = async ({ params }: NoteDetailsParams) => {
  const { id } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
