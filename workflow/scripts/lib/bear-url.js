function bearOpenNoteURL(noteID) {
    return "bear://x-callback-url/open-note?id=" + encodeURIComponent(String(noteID)) +
        "&show_window=yes&new_window=no&edit=yes";
}
