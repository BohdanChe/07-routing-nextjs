import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';


const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// API повертає: { notes: Note[], totalPages: number }
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type Category = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

// Завантаження списку нотаток
export const fetchNotes = async (searchText: string, page: number) => {
  const response = await axiosInstance.get<FetchNotesResponse>('/notes', {
    params: {
      ...(searchText !== '' && { search: searchText }),
      page,
      perPage: 12,
    },
  });
  return response.data;
};

// Створення нової нотатки
export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const response = await axiosInstance.post<Note>('/notes', note);
  return response.data;
};

// Видалення нотатки
export const deleteNote = async (id: number | string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};



// Завантаження однієї нотатки за ID
export const getSingleNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};

export const getNotes = async (categoryId?: string) => {
  const res = await axios.get<FetchNotesResponse>('/notes', {
    params: { categoryId },
  });
  return res.data;
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await axiosInstance.get<Category[]>('/categories');
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // <-- важливо
  }
};
