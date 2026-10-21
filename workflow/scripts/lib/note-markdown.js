function markdownLabel(value) {
    return String(value || "").replace(/([\\\[\]])/g, "\\$1");
}

function noteLinkMarkdown(note) {
    return "[" + markdownLabel(note.title || "Untitled note") + "](" + bearOpenNoteURL(note.id) + ")";
}

function noteTableOfContents(note) {
    return String(note.text || "").split("\n").map(function (line) {
        var match = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/);
        if (!match) {
            return null;
        }
        var level = match[1].length;
        var header = match[2];
        var indentation = new Array(level).join("\t");
        return indentation + "* [" + markdownLabel(header) + "](" +
            bearOpenNoteAtHeaderURL(note.id, header) + ")";
    }).filter(function (line) { return line !== null; }).join("\n");
}
