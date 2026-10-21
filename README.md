# Maci for Alfred

Maci is a native JavaScript for Automation (JXA) Alfred workflow for searching Bear notes on Apple Silicon Macs. It uses macOS's built-in `sqlite3` command only for read-only access and opens notes through Bear URLs.

## Current milestone

`bs` and `bsearch` display the 25 most recent active Bear notes for an empty query, or search active note titles and bodies. Title matches are ranked before body-only matches. Press Return to open the selected note in Bear.

Type `#` to complete active Bear tags. Add a space after a selected tag to filter notes, and combine one or more tags with free text. Use `#"tag with spaces"` for a multi-word tag; completion inserts this syntax automatically.

Use `bn` or `bnew` to create a note from a title and optional tags, for example `bn Project ideas #work `. Creation goes through Bear's x-callback URL; Maci does not read clipboard content or write to Bear's database.

Use `bcs` or `bcsearch` when a note may already exist. It shows matching notes and inserts a create item after the first two results; if no note matches, the create item is the only result.

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

`MACI_BEAR_DATABASE_PATH` can point the script at a fixture database during development. Maci never writes to that database.
