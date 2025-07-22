// components/TiptapEditor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PropTypes from "prop-types";


const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md p-2 min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
};

TiptapEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TiptapEditor;
