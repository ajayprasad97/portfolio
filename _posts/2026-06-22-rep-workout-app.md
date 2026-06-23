---
title: "Building Rep: A Workout App That Actually Programs Your Training"
preview: "How I built a React Native workout tracker with a 1,100+ exercise library, a double-progression engine, and deload cycles — and shipped it to the App Store in two months."
cover: /assets/img/rep-workout.png
featured: true
tags:
  - React Native
  - Expo
  - Firebase
  - TypeScript
  - iOS
links:
  - label: "Download on the App Store"
    url: "https://apps.apple.com/us/app/rep-the-workout-app/id6765540272"
---

Most workout apps solve a narrow problem. The simple ones are just logs — you enter weight and reps, they store it. The complex ones are subscription-gated personal trainer platforms that cost $30 a month and assume you want to be told exactly what to do by someone who doesn't know you. There's a gap in the middle: an app that understands programming principles, adapts to how you're actually training, and doesn't require a subscription to function.

That's what I built. Rep generates your daily workouts from a library of 1,100+ exercises, logs sets with RPE and RIR, runs a double-progression engine to tell you when to add weight, knows when you need to deload, and adjusts to your equipment. It took two months from the first commit to the App Store. Here's how it went.

---

## What the App Actually Does

Before the technical detail: the core loop.

You tell Rep your goal (strength, hypertrophy, or endurance), how many days per week you train, what equipment you have access to, and your training age. From there it generates a workout every day — real exercises matched to your muscle group schedule, filtered by what you actually have available.

When you log a set you record weight, reps, and RPE. After your last set you optionally note RIR (reps in reserve — how many more you had in the tank). Rep tracks this across sessions. When you've hit the top of your rep target for an exercise across enough sessions, it bumps the weight. When you've been pushing hard for several weeks, it flags a deload week.

There's also a social layer — a feed where you can see friends' workouts, buddy sessions where you train together in real time, and a history view with a muscle recovery body map showing what's been worked recently.

---

## Stack Decisions

**React Native + Expo** was the natural choice for a first iOS app. The Expo Go development loop — scan a QR code, see changes instantly — is genuinely fast. I didn't need bare workflow or any custom native modules, so managed Expo worked throughout. I used Expo Router 6 for file-based routing, which I'll come back to.

**expo-sqlite** for local storage was one of the best early decisions. The entire workout history, exercise library, progression state, and user settings live in a SQLite database on device. The app works offline. There's no subscription required to access your own data. Reads are synchronous and fast. The tradeoff is that schema changes require migrations — I have an append-only `migrations` array in `lib/db.ts` and a rule that says never alter existing `CREATE TABLE` statements — but that discipline is worth it.

**Firebase** handles everything that needs a server: Auth, Firestore for social and buddy sessions, and Cloud Functions for feed fan-out. The split is clean: local SQLite for your personal data, Firebase for anything that crosses device boundaries.

**No external state management.** Just `useState`, React Context for the active workout session timer and theme, and direct DB calls. I looked at Redux and Zustand early on and decided the overhead wasn't justified. The app has two cross-screen concerns (active session state and theme tokens) — both are in Context. Everything else is local to screens and re-queried on focus.

---

## The Exercise Library

The foundation is a JSON file — `data/exercises.json` — with over 1,100 exercises. I started from [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db), an open-source exercise database, but it diverged quickly.

The upstream data was a good starting point for names, muscle groups, and equipment types. But it was missing things the app needed: a `force` field (`push` / `pull` / `static`) to know whether to show a timed-hold UI in the logging screen, a `repHint` for unilateral exercises like single-arm rows (`"per arm"` shown next to the rep count), `recommended` flags for surfacing exercises in cold-start suggestions, and about 80 Fitbod name aliases so users importing Fitbod CSVs get clean exercise matching.

The library is now maintained independently. Keeping it as a versioned JSON payload rather than a hardcoded bundle was worth the extra work. The sync flow: the file lives in Firebase Storage and gets bundled as a fallback. The app checks the version on each launch and re-syncs if it's changed. That means I can push exercise corrections to existing users without an app update — and the admin queue in the app lets me review user-submitted custom exercises and publish them the same way.

---

## The Workout Engine

The workout generator is where most of the interesting logic lives. For any given day it has to:

1. Pick the right muscle groups based on the user's split (Push/Pull/Legs, Upper/Lower, etc.)
2. Filter the exercise pool to what matches the user's active Workout Space (the equipment available in their home gym, hotel room, or commercial gym)
3. Score and rank exercises against the user's training history, preferences, and recovery state
4. Select a final set from the ranked pool

Workout Spaces ended up being a better model than a simple equipment checkbox. Instead of "I have dumbbells," users define named spaces — Home Gym, Hotel Room, Office — each with specific equipment and a set of available dumbbell weights. The generator filters by `exerciseMatchesSpace(exercise, spaceEquipment)` and then `clampToSpaceWeights(suggestion, spaceWeights)` adjusts weight suggestions to the nearest weight actually available. If you only have 25s and 35s, Rep suggests the 25s, not 28.

The **double progression engine** in `lib/progression.ts` is straightforward in principle: you work within a rep range (say 8–12). Once you hit the top of that range for your target sets, you add weight and drop back to the bottom. The state per exercise tracks current weight, the rep range, how many sessions you've hit the top, and a ratchet to prevent the suggestion from dropping below what you've already proven you can lift. In practice this required care around edge cases — what happens after a deload, what happens when the user changes their rep target, what happens on the first session with an exercise.

**Deload detection** tracks a `currentCycleWeek` counter. When the user hits their configured cycle length (default 4 weeks), the app flags a deload — a week at reduced intensity. Users can skip it (the skip is recorded so the next detection window shifts correctly) or confirm it. After a deload, `currentCycleWeek` resets and progression state adjusts.

---

## Navigation Was the Hardest Non-Obvious Problem

Expo Router's file-based routing is elegant until you're deep into a screen hierarchy and something breaks in a way that's hard to reason about.

The core issue: all screens under `app/(tabs)/` are **siblings** in the Tabs navigator, not a stack. When you navigate from the History tab to a workout detail screen, you're not pushing onto a stack — you're switching to a sibling tab. `router.back()` from that screen doesn't go back to History, it goes to the root. And if the workout detail screen is registered with `href: null` (so it doesn't appear in the tab bar), it gets skipped by `router.back()` entirely.

I hit this bug in a dozen forms before I understood the underlying cause. The rule I landed on: **never use bare `router.back()` after a mutating action from any tabs screen**. Always `router.navigate('/explicit/path')`. For screens that can be opened from multiple tabs, I pass a `returnTo` param and navigate to it on save or dismiss. This is more verbose but it's correct.

The lesson: read the routing docs for your framework at the start, not after you've built ten screens and something is mysteriously going to the wrong place.

---

## The Social Layer and Cloud Functions

The social feed uses a fan-out pattern. When you finish a workout, it syncs to Firestore. A Cloud Function picks it up and writes to each follower's `/feeds/{uid}/items` collection. The Firestore security rules deny client writes to feed items entirely — only the Cloud Function (running with admin SDK) can write there. This means the feed is always server-authoritative and a client can't inject fake workout posts into someone else's feed.

Buddy sessions use a different pattern. Two users coordinate a shared session via a `buddySessions` Firestore document with a `participants` subcollection. Both clients listen to the same doc and see each other's exercise choices and set logs in real time. When the session ends, each user writes their own workout to their own local SQLite database and syncs it independently. The buddy session doc just coordinates — it doesn't store the workout data.

---

## Shipping to the App Store

Two months from first commit to App Store approval. This was my first iOS submission and the process is about what you'd expect: configure your signing certificates in Xcode, set up App Store Connect, submit builds via EAS, wait for review. The review itself took about 48 hours.

The EAS (Expo Application Services) build pipeline made this significantly less painful than building and codesigning manually. My build command downloads the latest exercise JSON from Firebase Storage before bundling, so each production build ships with the current library rather than whatever was in the repo at the time I kicked off the build.

One thing I'd do differently: I spent more time on features than on screenshots and metadata. The App Store listing is the first thing potential users see and it deserves the same attention as the code. I rushed it.

---

## What I Learned

**Local-first is underrated.** SQLite on device is fast, free, offline, and doesn't require a backend to do useful things. Firebase is great for the parts that need a server. But keeping the core data local means the app is useful even when connectivity is bad and there's no subscription required to access your own workout history.

**Domain model first, schema second.** The `workouts`, `workout_sets`, and `exercises` tables are load-bearing. Changes to them require migrations and touch every part of the app. I should have spent more time nailing the schema before writing screens. I didn't, and I paid for it in migrations.

**The navigation rules need to be documented early.** Expo Router's tabs-as-siblings model is a specific constraint. It's not obvious from the docs alone. Once I wrote it down explicitly — never use bare `router.back()` from a mutating action in a tabs screen — new screens were much faster to build correctly.

**Versioning matters even before launch.** The exercise library versioning system felt like overkill while I was building it. But the first time I needed to fix a wrong muscle group assignment for a popular exercise and push it to devices without waiting for an app update, I was glad it was there.

---

## What's Next

The core tracking loop is solid. The things I want to build next are around the social and coaching layers: better buddy session UX, progress charts in the history view, and the trainer features that are already stubbed out but gated behind a flag. There's also more work to do on the exercise library — more exercises, better coverage of cardio and mobility, and cleaning up equipment classifications.

If you're into lifting, [give it a try](https://apps.apple.com/us/app/rep-the-workout-app/id6765540272). It's free.
