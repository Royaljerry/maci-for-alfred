#!/usr/bin/osascript -l JavaScript

ObjC.import("Foundation");

function readText(path) {
    var error = $();
    var content = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, error);
    if (!content) {
        throw new Error("Could not load " + path);
    }
    return ObjC.unwrap(content);
}

function loadLibrary(name) {
    eval(readText("scripts/lib/" + name));
}

loadLibrary("alfred.js");
loadLibrary("bear-url.js");
loadLibrary("bear-db.js");
loadLibrary("note-markdown.js");

function buildOutput(argv) {
    var noteID = noteIDFromArgument(argv.length ? argv[0] : "");
    return noteID ? noteTableOfContents(noteByID(noteID)) : "";
}

var arguments = $.NSProcessInfo.processInfo.arguments;
var itemArgument = arguments.count > 4 ? ObjC.unwrap(arguments.objectAtIndex(arguments.count - 1)) : "";
writeStdout(buildOutput(itemArgument === "toc.js" ? [] : [itemArgument]));
