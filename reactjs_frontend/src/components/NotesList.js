import React from 'react';
import './styles.css';

// PUBLIC_INTERFACE
export default function NotesList({ notes, selectedId, onSelect, onDelete }) {
  /** Renders a list of notes with selection and delete controls. */
  if (!notes || notes.length === 0) {
    return <div className="empty">No notes yet. Create your first note!</div>;
  }

  return (
    <ul className="notes-list">
      {notes.map((n) => (
        <li key={n.id} className={`note-item ${selectedId === n.id ? 'active' : ''}`}>
          <button className="note-select" onClick={() => onSelect?.(n)} title="Edit note">
            <div className="note-title">{n.title || 'Untitled'}</div>
            <div className="note-preview">{(n.content || '').slice(0, 100)}</div>
          </button>
          <button className="icon-btn danger" onClick={() => onDelete?.(n)} title="Delete note" aria-label="Delete">
            🗑
          </button>
        </li>
      ))}
    </ul>
  );
}
