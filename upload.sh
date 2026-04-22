#!/usr/bin/env bash
# This script is used to upload my files to Neocities
# Usage: sh ./upload.sh

# Updating changelog
echo "Updating Changelog. "
git log --pretty=format:"---%n### %s%nTime: %ad%n" --date=short > __site/changelog-pretty.md
git log --pretty=format:"%ad %s %n" --date=short > __site/changelog.md

# go into the site working directory
cd __site

# Upload to Neocities
echo "Uploading to Neocities..."
echo "Changed files since last push:"
changed_files=$(git diff --name-only @{u}..HEAD)
echo "$changed_files"
for file in $changed_files; do
    if [ -f "$file" ]; then
        neocities upload "$file"
    fi
done

# push to git
git push
cd ..