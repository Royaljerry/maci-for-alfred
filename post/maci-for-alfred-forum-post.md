# Maci — a modern Bear workflow for Alfred

![Maci’s red bear-in-a-hat icon](maci-bear-hat-red-low-1024.png)

**Maci** is an Alfred workflow for searching, opening, and creating [Bear](https://bear.app/) notes. It is a native JavaScript for Automation (JXA) rewrite for Apple Silicon Macs, so it has no bundled executables and does not require Rosetta, Homebrew, Node.js, or any other runtime.

The name comes from Hungarian: *maci* is an affectionate word for a bear (“little bear”), and it is what I call the Bear app.

## Download and install

[Download Maci.alfredworkflow](https://github.com/Royaljerry/maci-for-alfred/raw/refs/heads/main/dist/Maci.alfredworkflow), then double-click it to import it into Alfred. Open Bear once before using Maci, so its local database is available. No workflow configuration is required.

Source and documentation: [github.com/Royaljerry/maci-for-alfred](https://github.com/Royaljerry/maci-for-alfred)

## What it does

- `bs` or `bsearch` searches Bear notes. An empty query shows the 25 most recently modified active notes; text searches titles and note bodies, with title matches ranked first.
- Type `#` to complete and filter by Bear tags. Multiple tags and free text can be combined; use `#"tag with spaces"` for multi-word tags.
- `bn` or `bnew` creates a note from a title and optional tags, for example `bn Project ideas #work`.
- `bcs` or `bcsearch` combines search and creation, showing matching notes alongside a create option.
- Type a final token beginning with `@` or `-@` to complete Bear special searches, such as `@today`, `@todo`, and `-@done`.

On a search result, press Return to open the note. Hold Option to run the current query in Bear, Shift to paste the selected note’s Markdown link, or Command-Shift to paste a generated table of contents.

Maci reads Bear’s local SQLite database in read-only mode and uses Bear’s x-callback URLs to open, search, and create notes. It never writes directly to Bear’s database.

## Credit and AI disclosure

Maci reimplements the selected user-facing features of [drgrib’s original Bear Workflow](https://github.com/drgrib/alfred-bear), which was the feature reference for this project.

For transparency: this workflow was created entirely by AI—**Codex, GPT-5.6 Terra High**. I am very open to fixes, feedback, and ideas for additional features; please share them in the repository’s issues or in this thread.
