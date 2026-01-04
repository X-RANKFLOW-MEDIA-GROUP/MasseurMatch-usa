#!/bin/bash

# Script to replace purple/violet colors with monochrome equivalents

echo "Starting color replacement..."

# Find all TSX and CSS files
files=$(find app/ src/ -type f \( -name "*.tsx" -o -name "*.css" \))

for file in $files; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue

  # Replace purple/violet color classes with monochrome
  sed -i 's/bg-violet-600/bg-white/g' "$file"
  sed -i 's/bg-violet-500/bg-neutral-200/g' "$file"
  sed -i 's/bg-violet-400/bg-neutral-300/g' "$file"
  sed -i 's/bg-violet-300/bg-neutral-400/g' "$file"
  sed -i 's/bg-indigo-600/bg-neutral-800/g' "$file"
  sed -i 's/bg-indigo-400/bg-neutral-700/g' "$file"

  sed -i 's/text-violet-600/text-white/g' "$file"
  sed -i 's/text-violet-500/text-neutral-200/g' "$file"
  sed -i 's/text-violet-400/text-white/g' "$file"
  sed -i 's/text-violet-300/text-neutral-300/g' "$file"
  sed -i 's/text-indigo-600/text-neutral-300/g' "$file"
  sed -i 's/text-indigo-400/text-white/g' "$file"

  sed -i 's/hover:bg-violet-600/hover:bg-neutral-100/g' "$file"
  sed -i 's/hover:bg-violet-500/hover:bg-neutral-200/g' "$file"
  sed -i 's/hover:bg-violet-400/hover:bg-neutral-300/g' "$file"
  sed -i 's/hover:text-violet-600/hover:text-white/g' "$file"
  sed -i 's/hover:text-violet-500/hover:text-neutral-200/g' "$file"
  sed -i 's/hover:text-violet-400/hover:text-white/g' "$file"
  sed -i 's/hover:text-violet-300/hover:text-neutral-300/g' "$file"

  sed -i 's/border-violet-600/border-white/g' "$file"
  sed -i 's/border-violet-500/border-neutral-300/g' "$file"
  sed -i 's/border-violet-400/border-neutral-400/g' "$file"
  sed -i 's/hover:border-violet-500/hover:border-white/g' "$file"
  sed -i 's/hover:border-violet-400/hover:border-neutral-300/g' "$file"

  sed -i 's/from-violet-600/from-white/g' "$file"
  sed -i 's/from-violet-400/from-neutral-200/g' "$file"
  sed -i 's/to-indigo-600/to-neutral-100/g' "$file"
  sed -i 's/to-indigo-400/to-white/g' "$file"
  sed -i 's/via-indigo-400/via-neutral-200/g' "$file"

  sed -i 's/focus:border-violet-500/focus:border-white\/30/g' "$file"
  sed -i 's/focus:ring-violet-500/focus:ring-white\/10/g' "$file"

  # Replace hardcoded purple backgrounds
  sed -i 's/bg-gradient-to-r from-violet-950\/50 via-\[#0a0a0f\] to-indigo-950\/30/bg-gradient-to-br from-black via-neutral-950 to-black/g' "$file"
  sed -i 's/bg-gradient-to-br from-violet-600\/20 to-indigo-600\/20/bg-gradient-to-br from-white\/10 to-neutral-100\/10/g' "$file"
  sed -i 's/bg-violet-600\/20/bg-white\/10/g' "$file"
  sed -i 's/bg-indigo-600\/20/bg-white\/5/g' "$file"

  # Replace gradient text
  sed -i 's/bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent/text-white/g' "$file"
  sed -i 's/bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent/text-white/g' "$file"
done

echo "Color replacement complete!"
echo "Files processed: $(echo "$files" | wc -l)"
