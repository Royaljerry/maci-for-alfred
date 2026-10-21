function createNoteItem(query) {
    var title = query.text;
    var tagSubtitle = query.tags.length ? "Tags: " + query.tags.map(tagSyntax).join(" ") : "";
    var itemTitle = title ? "Create \u201c" + title + "\u201d" : "Create a new Bear note";
    return alfredItem(itemTitle, tagSubtitle, bearCreateNoteURL(title, query.tags), true);
}
