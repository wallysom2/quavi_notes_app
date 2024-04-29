import { useState, useEffect, useCallback } from "react";
import { api } from "./../utils/api";
import { useSession } from "next-auth/react";
import NoteComponent from "./NoteComponent";

interface Note {
  id: string;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const { data: session, status } = useSession();
  const userQuery = api.note.getNotes.useQuery();
  const updateNoteMutation = api.note.updateNote.useMutation();
  const createNoteMutation = api.note.createNote.useMutation();
  const deleteNoteMutation = api.note.deleteNote.useMutation();

  const [notes, setNotes] = useState<Note[]>([]);
  const { data: notesData } = userQuery;

  useEffect(() => {
    if (notesData) {
      setNotes(notesData);
    }
  }, [notesData]);

  const addNote = useCallback(
    (title: string, content: string) => {
      if (status === "authenticated") {
        createNoteMutation.mutate(
          { title, content },
          {
            onSuccess: (newNote) => {
              setNotes((prevNotes) => [...prevNotes, newNote]);
            },
          },
        );
      } else {
        const newNote = { title, content, id: Math.random().toString() };
        setNotes((prevNotes) => [...prevNotes, newNote]);
      }
    },
    [createNoteMutation, status],
  );

  const updateNote = useCallback(
    (id: string, title: string, content: string) => {
      if (status === "authenticated") {
        updateNoteMutation.mutate(
          { id, title, content },
          {
            onSuccess: (updatedNote) => {
              setNotes(
                notes.map((note) =>
                  note.id === updatedNote.id ? updatedNote : note,
                ),
              );
            },
          },
        );
      } else {
        setNotes(
          notes.map((note) =>
            note.id === id ? { ...note, title, content } : note,
          ),
        );
      }
    },
    [updateNoteMutation, status, notes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      if (status === "authenticated") {
        deleteNoteMutation.mutate(
          { id },
          {
            onSuccess: () => {
              setNotes(notes.filter((note) => note.id !== id));
            },
          },
        );
      } else {
        setNotes(notes.filter((note) => note.id !== id));
      }
    },
    [deleteNoteMutation, status, notes],
  );

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => addNote("", "")}
        className=" absolute bottom-12 left-1/2 transform -translate-x-1/2 mb-3 me-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-10 py-5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        Add Note
      </button>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {notes.map((note) => (
          <NoteComponent
            note={note}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
