function alfredItems(items) {
    return JSON.stringify({ items: items });
}

function alfredItem(title, subtitle, arg, valid) {
    return {
        title: String(title),
        subtitle: String(subtitle || ""),
        arg: arg === undefined || arg === null ? "" : String(arg),
        valid: valid !== false
    };
}

function alfredError(title, subtitle) {
    return alfredItems([
        alfredItem(title, subtitle, "", false)
    ]);
}

function writeStdout(text) {
    var data = $(String(text)).dataUsingEncoding($.NSUTF8StringEncoding);
    $.NSFileHandle.fileHandleWithStandardOutput.writeData(data);
}
