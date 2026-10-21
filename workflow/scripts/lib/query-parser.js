function normalizeQueryText(value) {
    var text = value === undefined || value === null ? "" : String(value);
    return typeof text.normalize === "function" ? text.normalize("NFC") : text;
}

function parseQuotedToken(raw, index, isTag) {
    var start = index;
    if (isTag) {
        index += 1;
    }
    index += 1;

    var value = "";
    while (index < raw.length && raw.charAt(index) !== '"') {
        if (raw.charAt(index) === "\\" && index + 1 < raw.length) {
            index += 1;
        }
        value += raw.charAt(index);
        index += 1;
    }
    if (raw.charAt(index) === '"') {
        index += 1;
    }

    return {
        token: {
            value: value,
            isTag: isTag,
            start: start,
            end: index,
            raw: raw.slice(start, index)
        },
        nextIndex: index
    };
}

function tokenizeQuery(raw) {
    var tokens = [];
    var index = 0;

    while (index < raw.length) {
        while (index < raw.length && /\s/.test(raw.charAt(index))) {
            index += 1;
        }
        if (index >= raw.length) {
            break;
        }

        var start = index;
        var isTag = raw.charAt(index) === "#";
        var quoted = isTag ? raw.charAt(index + 1) === '"' : raw.charAt(index) === '"';
        if (quoted) {
            var parsed = parseQuotedToken(raw, index, isTag);
            tokens.push(parsed.token);
            index = parsed.nextIndex;
            continue;
        }

        while (index < raw.length && !/\s/.test(raw.charAt(index))) {
            index += 1;
        }
        var rawToken = raw.slice(start, index);
        tokens.push({
            value: isTag ? rawToken.slice(1) : rawToken,
            isTag: isTag,
            start: start,
            end: index,
            raw: rawToken
        });
    }

    return tokens;
}

function tagSyntax(tag) {
    var value = String(tag);
    if (/\s|"/.test(value)) {
        return '#"' + value.replace(/([\\"])/g, "\\$1") + '"';
    }
    return "#" + value;
}

function parseQuery(value) {
    var raw = normalizeQueryText(value);
    var tokens = tokenizeQuery(raw);
    var tags = tokens.filter(function (token) { return token.isTag; }).map(function (token) {
        return token.value;
    });
    var text = tokens.filter(function (token) { return !token.isTag; }).map(function (token) {
        return token.value;
    }).join(" ");
    var lastToken = tokens.length ? tokens[tokens.length - 1] : null;
    var endsWithWhitespace = raw.length > 0 && /\s$/.test(raw);
    var isTagCompletion = Boolean(lastToken && lastToken.isTag && !endsWithWhitespace);
    var isSpecialCompletion = Boolean(lastToken && !lastToken.isTag && !endsWithWhitespace &&
        /^-?@/.test(lastToken.raw));
    var hasSpecialSearch = tokens.some(function (token) {
        return !token.isTag && /^-?@/.test(token.value);
    });

    return {
        raw: raw,
        text: text,
        tags: tags,
        tokens: tokens,
        isEmpty: tokens.length === 0,
        isTagCompletion: isTagCompletion,
        tagPrefix: isTagCompletion ? lastToken.value : "",
        isSpecialCompletion: isSpecialCompletion,
        specialPrefix: isSpecialCompletion ? lastToken.raw : "",
        hasSpecialSearch: hasSpecialSearch,
        completionPrefix: (isTagCompletion || isSpecialCompletion) ? raw.slice(0, lastToken.start) : ""
    };
}
