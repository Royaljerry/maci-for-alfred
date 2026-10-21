#!/bin/zsh
set -eu
cd "$(dirname "$0")/.."
/usr/bin/osascript -l JavaScript tests/test-query-parser.js
