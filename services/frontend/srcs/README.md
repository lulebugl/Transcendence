# NEW ARCHITECTURE

src/
├── routes/           ← All your page code, colocated
│   ├── home/
│   ├── profile/
│   ├── settings/
│   └── auth/
├── components/       ← Shared UI (Button, Input, Layout)
├── hooks/            ← Shared hooks
├── api/              ← API calls
├── lib/              ← Utils
└── types/            ← Shared types

### Some things to remember (mostly for me)

* Put MatchHistory wherever makes sense today
* Not think about it again for a month
* Have "imperfect" structure
* Focus on features instead of folders
