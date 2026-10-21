function bearOpenNoteURL(noteID) {
    return "bear://x-callback-url/open-note?id=" + encodeURIComponent(String(noteID)) +
        "&show_window=yes&new_window=no&edit=yes";
}

function bearCreateNoteURL(title, tags) {
    var parameters = [
        "show_window=yes",
        "new_window=no",
        "edit=yes"
    ];
    if (title) {
        parameters.push("title=" + encodeURIComponent(String(title)));
    }
    if (tags.length) {
        parameters.push("tags=" + encodeURIComponent(tags.join(",")));
    }
    return "bear://x-callback-url/create?" + parameters.join("&");
}
