// app/notes/filter/[...slug]/page.tsx

import NotesClient from "../../Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage({ params }: { params: { slug?: string[] } }) {
  // `slug` може бути масивом або undefined
  const tag = params?.slug?.[0] || ""; // якщо /notes/filter -> "" (тобто всі нотатки)
  
  // бекенд не очікує "All", тому робимо перевірку
  const tagForFetch = tag === "All" ? "" : tag;

  const data = await fetchNotes(tagForFetch, 1);

  return <NotesClient initialData={data} tag={tag || "All"} />;
}
