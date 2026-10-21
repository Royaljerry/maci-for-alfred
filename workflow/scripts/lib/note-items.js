function compactExcerpt(text) {
    var compact = String(text || "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    if (compact.length > 110) {
        return compact.slice(0, 107) + "...";
    }
    return compact;
}

function noteToAlfredItem(note) {
    var subtitle = note.tags ? "#" + String(note.tags).split(",").join(" #") : compactExcerpt(note.text);
    return alfredItem(note.title || "Untitled note", subtitle, bearOpenNoteURL(note.id), true);
}
