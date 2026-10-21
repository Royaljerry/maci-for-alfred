# Maci for Alfred

Maci is a native JavaScript for Automation (JXA) Alfred workflow for searching Bear notes on Apple Silicon Macs. It uses macOS's built-in `sqlite3` command only for read-only access and opens notes through Bear URLs.

## Current milestone

`bs` and `bsearch` display the 25 most recent active Bear notes for an empty query, or search active note titles and bodies. Title matches are ranked before body-only matches. Press Return to open the selected note in Bear.

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
