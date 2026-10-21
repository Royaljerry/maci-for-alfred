# Maci for Alfred — project handoff

## Goal

Build **Maci** (Hungarian for “little bear”), a modern Alfred workflow for searching and creating Bear notes on Apple Silicon Macs.

The project replaces the existing **Bear Workflow by drgrib** rather than patching it. Maci should retain the useful user-facing behaviour while removing bundled, CPU-specific executables and Rosetta as a runtime dependency.

## Why this rewrite exists

The old workflow ships six precompiled Go executables, including `cmd/search/search`. They are Intel-only (`x86_64` Mach-O binaries). On an Apple Silicon Mac without Rosetta, Alfred reports:

```text
cmd/search/search: Bad CPU type in executable
```

Installing Rosetta fixed the immediate problem, but it is not an appropriate dependency for a new workflow.

The Go source file `cmd/search/main.go` was compiled into the adjacent `cmd/search/search` binary. The source is included in the workflow, but ordinary users execute the shipped binary rather than the Go source.

## Reference implementation

The original workflow will be copied into:

```text
temp/original/
```

Treat it as a behavioural reference, not a codebase to modify or copy wholesale. Before reusing any source, inspect its license. Preserve only the features that are intentionally selected below.

Known original workflow details:

- Alfred bundle ID: `com.drgrib.bear`
- Primary keyword: `bs` / `bsearch`
- It reads Bear’s local SQLite database directly.
- Database path used by the old workflow:

  ```text
  ~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite
  ```

- It uses Bear `bear://x-callback-url/...` URLs to open and create notes.

## Recommended architecture

Use a fresh repository. Do not fork the old project unless contributing a Go-based fix upstream becomes a separate goal.

### Runtime

- Alfred Script Filters and actions use JavaScript for Automation (JXA), launched through `/usr/bin/osascript -l JavaScript`.
- Use the system `/usr/bin/sqlite3` command only for read-only access to Bear’s database.
- Parse query results and emit Alfred Script Filter JSON in JavaScript.
- Use Bear x-callback URLs for opening notes, searching in Bear, and creating notes.

This avoids third-party runtimes and bundled compiled executables: no Go, Node, Homebrew, Rosetta, or custom native binary.

### Important boundary: Bear’s database

Bear’s SQLite schema and storage path are private implementation details and can change in a Bear update. Encapsulate all of the following in one small module:

- database-path discovery;
- read-only SQLite execution;
- schema-specific SQL;
- conversion from database rows to application data.

When the database cannot be read or the expected schema is unavailable, return a helpful Alfred item explaining the problem. Do not silently return an empty result list.

Never write to the Bear database.

### Suggested layout

```text
.
├── handoff.md
├── README.md
├── workflow/
│   ├── info.plist
│   └── scripts/
│       ├── search.js
│       ├── create.js
│       └── lib/
│           ├── alfred.js
│           ├── bear-db.js
│           ├── bear-url.js
│           └── query-parser.js
└── tests/
```

Keep script input/output contracts simple and independently testable. Prefer one script filter for search and a small number of focused Alfred actions.

## Features to migrate

Build in this order. Each milestone should work before proceeding to the next.

1. **Basic search**
   - `bs` / `bsearch` keyword.
   - Empty query shows recent non-archived, non-trashed notes.
   - Text query searches note titles and bodies.
   - Title matches rank above body-only matches.
   - Selecting a result opens its note in Bear.

2. **Tag-aware search**
   - Typing `#` offers tag completion.
   - One or more tags filter notes.
   - A free-text term can be combined with tags.
   - The implementation must safely handle spaces, Unicode, punctuation, and quote characters.

3. **Create notes**
   - `bn` / `bnew` creates a note from a title and optional tags.
   - Use Bear’s x-callback URL; do not write through SQLite.
   - Support clipboard content only if it remains clear, reliable, and privacy-respecting.

4. **Combined create/search**
   - `bcs` / `bcsearch` shows search results and a create item.

5. **Optional advanced features**
   - Open the current query in Bear.
   - Bear special-search keyword completion (for example, `@today`).
   - Copy/paste a link to a selected note.
   - Generate/paste a note table of contents.

Do not implement advanced features until the core search and creation flows have been verified against the installed Bear version.

## Implementation notes

### SQLite safety

- Open the database read-only.
- Do not interpolate user input directly into SQL.
- Prefer safe parameter passing supported by the installed `sqlite3` version, or strictly validate/escape values in one dedicated place if parameter binding is impractical from JXA.
- Keep queries conservative and bounded (for example, 25 recent notes and a reasonable maximum number of matches).
- Anticipate that Bear may have the database open; read-only querying should fail gracefully.

### Alfred output

Script Filters must write valid JSON only to standard output. Send diagnostics to standard error where possible. Every error path should emit an Alfred item rather than letting a stack trace be the only visible result.

### URLs and encoding

Construct Bear URLs with `encodeURIComponent` per parameter. Do not concatenate unencoded user text, titles, tags, note IDs, or clipboard content into URL strings.

## Acceptance criteria

Maci is ready for everyday use when, on an Apple Silicon Mac without Rosetta:

- `bs` displays recent Bear notes;
- text search returns correct notes and opens the selected note;
- tag completion and filtering work with Unicode tag names;
- new-note creation works through Bear;
- a missing/unreadable database produces a useful Alfred message;
- no executables, Node modules, Go toolchain, Homebrew dependency, or Rosetta installation is required;
- the workflow does not modify Bear’s database.

## First session checklist

1. Inspect `temp/original/` after it is copied in; confirm the specific features and existing Alfred wiring to retain.
2. Inspect the locally installed Bear database *read-only* to verify its current path, table names, and a minimal search query before building the workflow UI.
3. Scaffold the Alfred workflow with a single `bs` Script Filter.
4. Implement and manually test recent-notes output, then text search and note opening.
5. Add automated tests for query parsing and Alfred JSON serialization before expanding the feature set.
