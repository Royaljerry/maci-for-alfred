function notesForQuery(query) {
    if (query.isEmpty) {
        return recentNotes();
    }
    if (query.tags.length) {
        return searchNotesByTags(query.text, query.tags);
    }
    return searchNotes(query.text);
}
