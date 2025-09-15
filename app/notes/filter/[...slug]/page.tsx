import { getNotes } from "@/lib /api";
import { Metadata } from "next";
import NotesClient from "./Notes.client";

export const metadata: Metadata = {
  title: "Notes Page",
};

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
