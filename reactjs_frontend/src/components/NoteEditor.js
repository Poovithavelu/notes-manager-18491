import React, { useEffect, useState } from 'react';
import './styles.css';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onCancel }) {
  /** Editor for creating or updating a note. */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note?.id]); // reset when switching notes

  const canSave = title.trim().length > 0 || content.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    onSave?.({ title: title.trim(), content: content.trim() });
  }

  return (
    <form className="editor" onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          placeholder="Write your note here…"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="editor-actions">
        <button type="button" className="btn secondary" onClick={() => onCancel?.()}>
          Cancel
        </button>
        <button type="submit" className="btn primary" disabled={!canSave}>
          {note?.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
