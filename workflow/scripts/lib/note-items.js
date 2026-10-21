function compactExcerpt(text) {
    var compact = String(text || "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    if (compact.length > 110) {
        return compact.slice(0, 107) + "...";
    }
    return compact;
}

function noteToAlfredItem(note, query) {
    var subtitle = note.tags ? "#" + String(note.tags).split(",").join(" #") : compactExcerpt(note.text);
    var item = alfredItem(note.title || "Untitled note", subtitle, bearOpenNoteURL(note.id), true);
    item.mods = {
        alt: {
            arg: bearSearchURL(query),
            subtitle: "Search this query in Bear",
            valid: true
        }
    };
    return item;
}

function appSearchItem(query) {
    var displayQuery = query.raw.replace(/^\s+|\s+$/g, "");
    return alfredItem(
        displayQuery ? "Search \u201c" + displayQuery + "\u201d in Bear" : "Open Bear search",
        "Open the current query in Bear",
        bearSearchURL(query),
        true
    );
}
