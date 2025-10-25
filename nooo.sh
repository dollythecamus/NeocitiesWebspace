#!/bin/bash
# Written by Gemini 2.5 Pro -- I have no patience to learn bash script I'm sorry. it was so easy.

# Script that will sync the files from my obsidian vault to add to the content of the website

# ==============================================================================
# File Synchronization Script
#
# Description:
# This script copies files from a source directory to a destination directory
# using rsync. It excludes directories and files specified in a .ignore file
# located in the source directory.
#
# Usage:
# 1. Configure the SOURCE_DIR and DEST_DIR variables below.
# 2. Create a .ignore file in your SOURCE_DIR with a list of files/directories
#    to ignore (one per line).
# 3. Make the script executable: chmod +x your_script_name.sh
# 4. Run the script: ./your_script_name.sh
#
# ==============================================================================

# --- Configuration ---
# Set the source and destination directories.
# IMPORTANT: Do not add a trailing slash to these directory paths.
SOURCE_DIR="/home/chloe/Mix/Minds/Sync/experiment"
DEST_DIR="/home/chloe/Mix/Objects/Virtuals/WebDev/Neocities/NeocitiesWebspace/__site/assets/content/experiment"

# The name of the ignore file.
IGNORE_FILE=".ignore"

# --- Script Logic ---

echo "Starting file synchronization..."

# 1. Validate that the source directory exists.
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory '$SOURCE_DIR' not found."
    echo "Please check the SOURCE_DIR variable in the script."
    exit 1
fi

# 2. Ensure the destination directory exists. If not, create it.
# The -p flag ensures that no error is reported if the directory already exists.
mkdir -p "$DEST_DIR"
echo "Destination directory '$DEST_DIR' is ready."

# 3. Build the rsync command arguments in an array.
# Using an array is safer than building a command string, as it handles spaces
# and special characters correctly.
rsync_opts=(
    -avh              # -a (archive mode), -v (verbose), -h (human-readable)
    --progress        # Show a progress bar for large files.
    --delete          # Delete files in the destination that are not in the source.
    --exclude=".git"  # Always ignore the .git directory.
)

# 4. Check for the .ignore file in the source directory.
IGNORE_FILE_PATH="$SOURCE_DIR/$IGNORE_FILE"
if [ -f "$IGNORE_FILE_PATH" ]; then
    echo "Found '$IGNORE_FILE'. Applying custom ignore rules."
    # Add the --exclude-from option to our arguments array.
    # This tells rsync to read exclusion patterns from the specified file.
    rsync_opts+=(--exclude-from="$IGNORE_FILE_PATH")
else
    echo "No '$IGNORE_FILE' file found. Syncing all non-default files."
fi

# 5. Execute the rsync command with the configured options.
# The trailing slash on SOURCE_DIR ("$SOURCE_DIR/") is crucial. It tells rsync
# to copy the *contents* of the source directory, not the directory itself.
echo "Running synchronization from '$SOURCE_DIR/' to '$DEST_DIR/'..."
rsync "${rsync_opts[@]}" "$SOURCE_DIR/" "$DEST_DIR/"

echo "Synchronization complete!"

