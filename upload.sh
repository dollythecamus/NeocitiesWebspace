#!/usr/bin/env bash
# This script is used to upload my files to Neocities
# Usage: ./upload.sh

# Updating changelog
echo "Updating Changelog. "
git log --pretty=format:"---%n### %s%nTime: %ad%n" --date=short > __site/changelog.md

# Upload to Neocities
echo "Uploading to Neocities..."
neocities push __site

echo "Upload complete. Your site is now live!"