# Maci for Alfred

![Maci bear icon](icon/maci-bear-hat-red-low-1024.png)

Maci is an Alfred workflow for searching, opening, and creating [Bear](https://bear.app/) notes on Apple Silicon Macs. It uses native JavaScript for Automation (JXA) and macOS's built-in `sqlite3` command—no bundled executables, Rosetta, Homebrew, Node.js, or other runtime is required.

**Maci** is the Hungarian nickname for a bear (literally, “little bear”). It is also the name I use when referring to the Bear app.

## Install

1. Download [Maci.alfredworkflow](dist/Maci.alfredworkflow).
2. Double-click the downloaded file and let Alfred import it.
3. Open Bear once before using Maci, so its local database is available.

## Commands

| Keyword | What it does |
| --- | --- |
| `bs` / `bsearch` | Search Bear notes. With no query, shows the 25 most recently modified active notes. |
| `bn` / `bnew` | Create a Bear note from a title and optional tags. |
| `bcs` / `bcsearch` | Search existing notes and offer a create item in the same results list. |

For example, `bn Project ideas #work` creates a note titled “Project ideas” with the `work` tag. `bcs Project ideas` is useful when the note may already exist: matching notes are shown first, followed by a create option.

## Searching

Text searches titles and note bodies. Title matches appear before body-only matches. Searches and the recent-notes list exclude archived and trashed notes.

Type `#` to complete active Bear tags. After selecting a tag, add a space and continue typing to combine tags with text. Multiple tags narrow results to notes containing all of them. Quote tags with spaces, for example `#"project ideas"`; tag completion inserts this form automatically.

When the final token starts with `@` or `-@`, Maci completes Bear special searches such as `@today`, `@todo`, and `-@done`. If a completed special search has no local result, Maci offers to run it in Bear.

## Result actions

| Keys | Action |
| --- | --- |
| Return | Open the selected note in Bear, or create the selected new note. |
| Option | Open the current search query in Bear. |
| Shift | Copy and paste the selected note's Markdown link into the previously active app. |
| Command-Shift | Generate, copy, and paste a table of contents for the selected note into the previously active app. |

## Privacy and compatibility

Maci reads Bear's local SQLite database in read-only mode and uses Bear x-callback URLs to open, search, and create notes. It never writes directly to Bear's database and does not read clipboard content.

Bear's database path and schema are private implementation details that may change in a Bear update. If the database cannot be read, Maci shows an error item in Alfred instead of silently returning no notes.

## Development

Run the focused JXA tests from the repository root:

```sh
./tests/run.sh
```

For a local, read-only script check with the installed Bear database:

```sh
cd workflow
./scripts/search.js ""
./scripts/search.js "meeting"
```

Set `MACI_BEAR_DATABASE_PATH` to point the scripts at a fixture database during development. Maci never writes to that database.
