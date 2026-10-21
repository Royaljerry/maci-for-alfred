ObjC.import("Foundation");

function readText(path) {
    var error = $();
    var content = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, error);
    if (!content) {
        throw new Error("Could not load " + path);
    }
    return ObjC.unwrap(content);
}

eval(readText("workflow/scripts/lib/query-parser.js"));
eval(readText("workflow/scripts/lib/alfred.js"));

function assertEqual(actual, expected, label) {
    if (actual !== expected) {
        throw new Error(label + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
    }
}

var empty = parseQuery(" \t ");
assertEqual(empty.isEmpty, true, "empty query");

var text = parseQuery("  café meeting  ");
assertEqual(text.text, "café meeting", "trimmed Unicode query");
assertEqual(text.isEmpty, false, "non-empty query");

var json = alfredItems([alfredItem("Title", "Subtitle", "bear://note", true)]);
var item = JSON.parse(json).items[0];
assertEqual(item.title, "Title", "Alfred item title");
assertEqual(item.arg, "bear://note", "Alfred item arg");

writeStdout("query-parser and Alfred serialization tests passed\n");
