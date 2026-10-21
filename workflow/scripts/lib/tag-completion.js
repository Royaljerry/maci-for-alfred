function tagToAlfredItem(tag, query) {
    var formattedTag = tagSyntax(tag.title);
    var item = alfredItem(formattedTag, "Filter Bear notes by this tag", "", false);
    item.autocomplete = query.completionPrefix + formattedTag + " ";
    item.uid = "tag-" + tag.title;
    return item;
}

function tagCompletionItems(query) {
    return tagCompletions(query.tagPrefix).map(function (tag) {
        return tagToAlfredItem(tag, query);
    });
}
