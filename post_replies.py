#!/usr/bin/env python3
"""Answer Devin's review threads on the MrAntares performance PRs.

Each replies-2026-10-20/<pr>.md has one "## <title>" section per Devin
comment. A section is posted as a reply on the Devin comment that shares the
most words with <title> (file name included); a section with no clear match
goes on the PR as a comment. A thread whose reply starts with "Fixed" is
then marked resolved.
Run with --dry-run first to see the matches. PR numbers as arguments limit
it to those PRs. Needs gh, logged in.
"""
import json, re, subprocess, sys, urllib.request

REPO = "MrAntares/roBrowserLegacy"
RAW = "https://raw.githubusercontent.com/akreao/roBrowserLegacy/mrantares-pr-bodies/replies-2026-10-20/{}.md"
dry = "--dry-run" in sys.argv
PRS = [int(a) for a in sys.argv[1:] if a.isdigit()] or range(1513, 1522)


def gh(*args, data=None):
    out = subprocess.run(["gh", *args], input=data, capture_output=True, text=True)
    if out.returncode:
        sys.exit(f"gh {' '.join(args)} failed: {out.stderr}")
    return out.stdout


def words(s):
    return {w for w in re.findall(r"[a-z0-9]+", s.lower()) if len(w) > 3}


def best(title, roots):
    scored = sorted(((len(words(title) & words(c["body"] + " " + c["path"])), c) for c in roots),
                    key=lambda x: -x[0])
    if scored and scored[0][0] >= 2 and (len(scored) == 1 or scored[0][0] > scored[1][0]):
        return scored[0][1]
    return None


THREADS = """query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){
reviewThreads(first:100){nodes{id isResolved comments(first:1){nodes{databaseId}}}}}}}"""


def thread_ids(pr):
    out = json.loads(gh("api", "graphql", "-f", f"query={THREADS}", "-f", "o=MrAntares",
                        "-f", "r=roBrowserLegacy", "-F", f"n={pr}"))
    nodes = out["data"]["repository"]["pullRequest"]["reviewThreads"]["nodes"]
    return {t["comments"]["nodes"][0]["databaseId"]: t for t in nodes if t["comments"]["nodes"]}


for pr in PRS:
    text = urllib.request.urlopen(RAW.format(pr)).read().decode()
    sections = re.split(r"^## (?:Thread: )?", text, flags=re.M)[1:]
    comments = json.loads(gh("api", "--paginate", f"repos/{REPO}/pulls/{pr}/comments"))
    roots = [c for c in comments if not c.get("in_reply_to_id") and "devin" in c["user"]["login"].lower()]
    threads = thread_ids(pr)
    for sec in sections:
        title, body = sec.split("\n", 1)
        body = body.strip() + "\n"
        title = re.sub(r"^[^A-Za-z0-9]+", "", title)
        match = best(title, roots)
        if match:
            where = f"reply to {match['path']}: {match['body'].strip().splitlines()[0][:70]!r}"
            if not dry:
                gh("api", f"repos/{REPO}/pulls/{pr}/comments/{match['id']}/replies",
                   "-F", "body=@-", data=body)
            t = threads.get(match["id"])
            if body.startswith("Fixed") and t and not t["isResolved"]:
                where += ", resolved"
                if not dry:
                    gh("api", "graphql", "-f",
                       "query=mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{id}}}",
                       "-f", f"id={t['id']}")
        else:
            where = "PR comment (no clear match)"
            body = f"**{title.strip()}**\n\n{body}"
            if not dry:
                gh("pr", "comment", str(pr), "-R", REPO, "-F", "-", data=body)
        print(f"#{pr} {title.strip()!r}: {where}")
