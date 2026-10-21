function normalizeQueryText(value) {
    var text = value === undefined || value === null ? "" : String(value);
    return typeof text.normalize === "function" ? text.normalize("NFC") : text;
}

function parseQuery(value) {
    var raw = normalizeQueryText(value);
    var trimmed = raw.replace(/^\s+|\s+$/g, "");
    return {
        raw: raw,
        text: trimmed,
        isEmpty: trimmed.length === 0
    };
}
