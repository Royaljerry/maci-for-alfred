var DEFAULT_BEAR_DATABASE_PATH =
    "~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite";

function environmentValue(name) {
    var value = $.NSProcessInfo.processInfo.environment.objectForKey(name);
    return value ? ObjC.unwrap(value) : null;
}

function bearDatabasePath() {
    var configuredPath = environmentValue("MACI_BEAR_DATABASE_PATH");
    if (configuredPath) {
        return configuredPath;
    }

    var homeDirectory = ObjC.unwrap($.NSHomeDirectory());
    return DEFAULT_BEAR_DATABASE_PATH.replace("~", homeDirectory);
}

function shellQuote(value) {
    return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

function sqliteStringLiteral(value) {
    return "'" + String(value).replace(/'/g, "''") + "'";
}

function runReadOnlySQLite(sql, parameters) {
    var databasePath = bearDatabasePath();
    var fileManager = $.NSFileManager.defaultManager;
    if (!fileManager.isReadableFileAtPath(databasePath)) {
        throw new Error("Bear's database is unavailable at " + databasePath + ". Open Bear once, then try again.");
    }

    var command = ["/usr/bin/sqlite3", "-readonly", "-json", shellQuote(databasePath)];
    Object.keys(parameters || {}).forEach(function (name) {
        command.push("-cmd");
        command.push(shellQuote(".parameter set :" + name + " " + sqliteStringLiteral(parameters[name])));
    });
    command.push(shellQuote(sql));

    var app = Application.currentApplication();
    app.includeStandardAdditions = true;
    var output = app.doShellScript(command.join(" "));
    return output ? JSON.parse(output) : [];
}

var NOTE_COLUMNS = [
    "note.ZUNIQUEIDENTIFIER AS id",
    "note.ZTITLE AS title",
    "COALESCE(note.ZTEXT, '') AS text",
    "GROUP_CONCAT(tag.ZTITLE) AS tags"
].join(",\n    ");

var NOTE_TAG_JOINS = [
    "LEFT JOIN Z_5TAGS noteTag ON note.Z_PK = noteTag.Z_5NOTES",
    "LEFT JOIN ZSFNOTETAG tag ON noteTag.Z_13TAGS = tag.Z_PK"
].join("\n");

function recentNotes() {
    return runReadOnlySQLite([
        "SELECT",
        "    " + NOTE_COLUMNS,
        "FROM ZSFNOTE note",
        NOTE_TAG_JOINS,
        "WHERE note.ZARCHIVED = 0 AND note.ZTRASHED = 0",
        "GROUP BY note.ZUNIQUEIDENTIFIER, note.ZTITLE",
        "ORDER BY note.ZMODIFICATIONDATE DESC",
        "LIMIT 25"
    ].join("\n"), {});
}

function searchNotes(text) {
    return runReadOnlySQLite([
        "SELECT",
        "    " + NOTE_COLUMNS,
        "FROM ZSFNOTE note",
        NOTE_TAG_JOINS,
        "WHERE note.ZARCHIVED = 0",
        "  AND note.ZTRASHED = 0",
        "  AND (lower(note.ZTITLE) LIKE lower(:pattern)",
        "       OR lower(COALESCE(note.ZTEXT, '')) LIKE lower(:pattern))",
        "GROUP BY note.ZUNIQUEIDENTIFIER, note.ZTITLE",
        "ORDER BY CASE WHEN lower(note.ZTITLE) LIKE lower(:pattern) THEN 0 ELSE 1 END,",
        "         note.ZMODIFICATIONDATE DESC",
        "LIMIT 50"
    ].join("\n"), { pattern: "%" + text + "%" });
}
