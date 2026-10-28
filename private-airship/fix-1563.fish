# Replies to Devin on MrAntares/roBrowserLegacy#1563 and corrects the PR description.
set dir (status dirname)
gh pr comment 1563 --repo MrAntares/roBrowserLegacy --body-file $dir/devin-reply-1563.md
gh pr edit 1563 --repo MrAntares/roBrowserLegacy --body-file $dir/mrantares-body.md
