"use client";

import { useState } from "react";
import css from "./page.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { getNotes, NotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/EmptyState/EmptyState";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

const useToggle = (): [boolean, () => void, () => void] => {
  const [isOpen, setIsOpen] = useState(false);
  return [isOpen, () => setIsOpen(true), () => setIsOpen(false)];
};

interface NotesClientProps {
  initialData: NotesResponse; // об'єкт із notes та totalPages
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const { notes, totalPages } = initialData;
  const [isModalOpen, openModal, closeModal] = useToggle();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue); // миттєво показує користувачу
    updateSearchQuery(newValue); // запускає пошук із затримкою
  };

  const { data, isLoading } = useQuery({
    queryKey: ["notes", searchQuery, page, initialTag],
    queryFn: () => getNotes(searchQuery, page, initialTag),
    initialData: { notes, totalPages },
    placeholderData: keepPreviousData,
  });

  const currentTotalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleInputChange} />
        {currentTotalPages > 1 && (
          <Pagination
            totalPages={currentTotalPages}
            page={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isLoading && <p>Loading...</p>}

      {data && !isLoading && data.notes.length === 0 && (
        <EmptyState message="No notes found." />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
