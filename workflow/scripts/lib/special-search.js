var BEAR_SPECIAL_SEARCHES = [
    "@tagged",
    "@untagged",
    "@today",
    "@yesterday",
    "@lastXdays",
    "@images",
    "@files",
    "@attachments",
    "@task",
    "@todo",
    "@done",
    "@code",
    "@title",
    "@locked",
    "@date(",
    "@cdate("
];

function specialCompletionItems(query) {
    var isNegated = query.specialPrefix.indexOf("-@") === 0;
    var prefix = isNegated ? query.specialPrefix.slice(1) : query.specialPrefix;
    return BEAR_SPECIAL_SEARCHES.filter(function (special) {
        return special.indexOf(prefix) === 0;
    }).map(function (special) {
        var value = isNegated ? "-" + special : special;
        var item = alfredItem(value, "Search this special query in Bear", "", false);
        item.autocomplete = query.completionPrefix + value + " ";
        item.uid = "special-" + value;
        return item;
    });
}
