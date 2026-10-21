function bearOpenNoteURL(noteID) {
    return "bear://x-callback-url/open-note?id=" + encodeURIComponent(String(noteID)) +
        "&show_window=yes&new_window=no&edit=yes";
}

function bearOpenNoteAtHeaderURL(noteID, header) {
    return "bear://x-callback-url/open-note?id=" + encodeURIComponent(String(noteID)) +
        "&header=" + encodeURIComponent(String(header)) +
        "&show_window=yes&new_window=no&edit=yes";
}

function bearSearchURL(query) {
    var parameters = [];
    if (query.text) {
        parameters.push("term=" + encodeURIComponent(query.text));
    }
    if (query.tags.length) {
        parameters.push("tag=" + encodeURIComponent(query.tags[0]));
    }
    return "bear://x-callback-url/search" + (parameters.length ? "?" + parameters.join("&") : "");
}

function noteIDFromArgument(value) {
    var argument = String(value || "");
    var match = argument.match(/[?&]id=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
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
