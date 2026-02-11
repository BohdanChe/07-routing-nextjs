import axios from "axios";

import type { Note, NewNote, NoteTag } from "../types/note";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${myKey}`;

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const getNotes = async (
  search: string,
  page: number,
  tag?: NoteTag
): Promise<NotesResponse> => {
  const response = await axios.get<NotesResponse>(`/notes`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
    params: {
      ...(search !== "" ? { search } : {}),
      tag,
      page,
    },
  });
  console.log("getNotes response:", response.data, "tag:", tag);

  return response.data;
};
export const getSingleNote = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
};

export const addNote = async (noteData: NewNote): Promise<Note> => {
  const res = await axios.post<Note>(`/notes/`, noteData, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
};
