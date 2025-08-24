'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import Modal from '@/components/Modal/Modal';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes, FetchNotesResponse } from '@/lib/api';
import NoteForm from '@/components/NoteForm/NoteForm';

import css from './Notes.module.css';

interface NotesClientProps {
  initialData: FetchNotesResponse;
  tag: string; // 🟢 нове поле
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data } = useQuery({
    queryKey: ['notes', searchQuery, currentPage, tag],
    queryFn: () => {
      const tagParam = tag === 'All' ? '' : tag;
      return fetchNotes(searchQuery, currentPage, tagParam);
    },
    placeholderData: keepPreviousData,
    initialData,
  });

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const changeSearchQuery = useDebouncedCallback((newQuery: string) => {
    setCurrentPage(1);
    setSearchQuery(newQuery);
  }, 300);

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  return (
    <div className={css.app}>
      <main>
        <section>
          <header className={css.toolbar}>
            <h2>
              Notes {tag !== 'All' ? `– ${tag}` : ''}
            </h2>

            <SearchBox value={searchQuery} onChange={changeSearchQuery} />

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
            <button className={css.button} onClick={toggleModal}>
              Create note +
            </button>
          </header>

          {isModalOpen && (
            <Modal onClose={toggleModal}>
              <NoteForm onClose={toggleModal} />
            </Modal>
          )}

          {notes.length > 0 ? (
            <NoteList notes={notes} />
          ) : (
            <p>No notes found</p>
          )}
        </section>
      </main>
    </div>
  );
}
