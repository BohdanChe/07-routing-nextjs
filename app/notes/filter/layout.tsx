import { ReactNode } from "react";
import css from "./layoutNotes.module.css";
import { Metadata } from "next";

export const generatemetadata: Metadata = {
  metadataBase: new URL('https://notehub.com'),
  title: 'NoteHub',
  description: 'Home page',

  openGraph: {
    title: 'NoteHub',
    description: 'website',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
  },
}

interface Props {
  children: ReactNode;
  sidebar: ReactNode;
}
const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
};

export default NotesLayout;
