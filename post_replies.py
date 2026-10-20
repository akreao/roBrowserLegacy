#!/usr/bin/env python3
"""Answer Devin's review threads on the MrAntares performance PRs.

Each replies-2026-10-20/<pr>.md has one "## Thread: <title>" section per
Devin comment. A section is posted as a reply on the Devin comment whose
text contains <title>; a section with no match goes on the PR as a comment.
Run with --dry-run first to see the matches. Needs gh, logged in.
"""
import json, re, subprocess, sys, urllib.request

REPO = "MrAntares/roBrowserLegacy"
RAW = "https://raw.githubusercontent.com/akreao/roBrowserLegacy/mrantares-pr-bodies/replies-2026-10-20/{}.md"
PRS = range(1513, 1522)
dry = "--dry-run" in sys.argv


def gh(*args, data=None):
    out = subprocess.run(["gh", *args], input=data, capture_output=True, text=True)
    if out.returncode:
        sys.exit(f"gh {' '.join(args)} failed: {out.stderr}")
    return out.stdout


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


for pr in PRS:
    text = urllib.request.urlopen(RAW.format(pr)).read().decode()
    sections = re.split(r"^## Thread: ", text, flags=re.M)[1:]
    comments = json.loads(gh("api", "--paginate", f"repos/{REPO}/pulls/{pr}/comments"))
    roots = [c for c in comments if not c.get("in_reply_to_id") and "devin" in c["user"]["login"].lower()]
    for sec in sections:
        title, body = sec.split("\n", 1)
        body = body.strip() + "\n"
        match = [c for c in roots if norm(title) in norm(c["body"])]
        if len(match) == 1:
            where = f"reply to comment {match[0]['id']}"
            if not dry:
                gh("api", f"repos/{REPO}/pulls/{pr}/comments/{match[0]['id']}/replies",
                   "-F", "body=@-", data=body)
        else:
            where = f"PR comment ({len(match)} matches)"
            body = f"**{title.strip()}**\n\n{body}"
            if not dry:
                gh("pr", "comment", str(pr), "-R", REPO, "-F", "-", data=body)
        print(f"#{pr} {title.strip()!r}: {where}")
