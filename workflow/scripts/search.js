#!/usr/bin/osascript -l JavaScript

ObjC.import("Foundation");

function readText(path) {
    var error = $();
    var content = $.NSString.stringWithContentsOfFileEncodingError(
        path,
        $.NSUTF8StringEncoding,
        error
    );
    if (!content) {
        throw new Error("Could not load " + path + ": " + ObjC.unwrap(error));
    }
    return ObjC.unwrap(content);
}

function loadLibrary(name) {
    eval(readText("scripts/lib/" + name));
}

loadLibrary("alfred.js");
loadLibrary("bear-url.js");
loadLibrary("query-parser.js");
loadLibrary("bear-db.js");
loadLibrary("tag-completion.js");
loadLibrary("note-items.js");
loadLibrary("note-search.js");

function buildResult(argv) {
    try {
        var query = parseQuery(argv.length > 0 ? argv[0] : "");
        if (query.isTagCompletion) {
            return alfredItems(tagCompletionItems(query));
        }

        var notes = notesForQuery(query);
        var items = notes.map(noteToAlfredItem);
        if (items.length === 0) {
            items.push(alfredItem("No matching Bear notes", "Try another title or note text.", "", false));
        }
        return alfredItems(items);
    } catch (error) {
        return alfredError("Could not search Bear notes", String(error.message || error));
    }
}

var arguments = $.NSProcessInfo.processInfo.arguments;
var queryArgument = arguments.count > 4 ? ObjC.unwrap(arguments.objectAtIndex(arguments.count - 1)) : "";
writeStdout(buildResult(queryArgument === "search.js" ? "" : [queryArgument]));
