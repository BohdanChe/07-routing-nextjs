import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getSingleNote } from "@/lib /api";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

// -------------------------
// Метадані сторінки
// -------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;

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

// -------------------------
// Типи для параметрів
// -------------------------
type NoteDetailsProps = {
  params: Promise<{ id: string }> | { id: string };
};

// -------------------------
// Асинхронний компонент сторінки
// -------------------------
const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;

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
