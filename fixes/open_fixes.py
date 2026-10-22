#!/usr/bin/env python3
"""Open the roBrowserLegacy fork fixes on MrAntares/roBrowserLegacy, one per change.

Run:  python3 open_mrantares.py            (opens what is not opened yet)
      python3 open_mrantares.py --dry-run  (prints what it would do)
Needs `gh` signed in as akreao. Progress is kept in opened.json, so a rerun
skips PRs already opened. {name} in a body becomes that PR's #number.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DRY = '--dry-run' in sys.argv
ORDER = ['cashshop-tabs', 'cashshop-search-enter', 'skill-job-lines', 'quest-objectives-once', 'paperdoll-headgear',
         'doram-druid-weapon', 'base-weapon-sprite', 'hairstyle-buttons']
state_path = os.path.join(HERE, 'opened.json')
opened = json.load(open(state_path)) if os.path.exists(state_path) else {}

for name in ORDER:
    if name in opened:
        print('already open', name, opened[name])
        continue
    title, body = open(os.path.join(HERE, name + '.md')).read().split('\n', 1)
    assert title.startswith('Title: ')
    def fill(m):
        k = m.group(1)
        if k not in opened:
            sys.exit('%s needs %s opened first' % (name, k))
        return '#' + opened[k].rstrip('/').rsplit('/', 1)[-1]
    body = re.sub(r'\{([a-z-]+)\}', fill, body.lstrip('\n'))
    tmp = os.path.join(HERE, '.body.md')
    open(tmp, 'w').write(body)
    args = ['gh', 'pr', 'create', '--repo', 'MrAntares/roBrowserLegacy', '--base', 'master',
            '--head', 'akreao:mrantares/' + name, '--title', title[len('Title: '):], '--body-file', tmp]
    if DRY:
        print(' '.join(args[:-1]))
        opened[name] = 'https://github.com/MrAntares/roBrowserLegacy/pull/0'
        continue
    url = subprocess.run(args, check=True, capture_output=True, text=True).stdout.strip().splitlines()[-1]
    print(name, url)
    opened[name] = url
    json.dump(opened, open(state_path, 'w'), indent=1)
print('done')
