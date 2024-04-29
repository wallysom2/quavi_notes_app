import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Draggable from "react-draggable";


interface Note {
  id: string;
  title: string;
  content: string;
}
interface NoteProps {
  note: Note;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
}


const NoteComponent: React.FC<NoteProps> = ({ note, updateNote, deleteNote }) => {
  const [inputValue, setInputValue] = useState(note.content);
  const [inputTitle, setInputTitle] = useState(note.title);
  const [debouncedValue] = useDebounce(inputValue, 600);
  const [debouncedTitle] = useDebounce(inputTitle, 600);

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputValue(event.target.value);
  };

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputTitle(event.target.value);
  };

  useEffect(() => {
    if (debouncedValue) {
      updateNote({ id: note.id, title: debouncedTitle, content: debouncedValue });    }
  }, [debouncedValue, debouncedTitle]);

  return (
    <Draggable key={note.id} enableUserSelectHack={false}>
      <div className="flex max-w-xs cursor-grab flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
        <input
          type="text"
          value={inputTitle}
          placeholder="title"
          onChange={handleTitleChange}
          className="notes mb-2 w-full bg-transparent p-0 p-4 px-0 py-0 text-lg font-bold text-white focus:outline-none"
          autoCorrect="off"
          onTouchStart={(e) => e.currentTarget.focus()}
        />
        <textarea
          value={inputValue}
          placeholder="text here..."
          onChange={handleTextAreaChange}
          className="y-full w-full resize-none border-0  bg-transparent p-0 p-4 px-0 py-0 text-white focus:outline-none"
          autoCorrect="off"
          onTouchStart={(e) => e.currentTarget.focus()}
        />
        <button
          onClick={() => deleteNote(note.id)}
          className="absolute right-0 top-0 rounded bg-transparent px-2 py-1 font-bold text-white hover:bg-red-200"
          onTouchStart={(e) => e.currentTarget.focus()}
        >
          x
        </button>
      </div>
    </Draggable>
  );
};

export default NoteComponent;