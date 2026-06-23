---
title: "Building Rep: A Workout App That Actually Programs Your Training"
preview: "How I built a React Native workout tracker with a 1,100+ exercise library, a double-progression engine, and deload cycles — and shipped it to the App Store in two months."
cover: /assets/img/rep_cover.jpg
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

Rep fills that gap. It generates daily workouts from a library of 1,100+ exercises, logs sets with RPE and RIR, runs a double-progression engine to know when to add weight, and flags deload weeks when your fatigue catches up. Two months from first commit to App Store.

---

## The Core Loop

You tell Rep your goal (strength, hypertrophy, or endurance), how many days per week you train, what equipment you have access to, and your training age. From there it generates a workout every day — real exercises matched to your muscle group schedule, filtered by what you actually have available.

When you log a set you record weight, reps, and RPE. After your last set you optionally note RIR (reps in reserve — how many more you had in the tank). Rep tracks this across sessions. When you've hit the top of your rep target for an exercise across enough sessions, it bumps the weight. When you've been pushing hard for several weeks, it flags a deload week.

There's also a social layer — a feed where you can see friends' workouts, buddy sessions where you train together in real time, and a history view with a muscle recovery body map showing what's been worked recently.

---

## Stack Decisions

**React Native + Expo** was the right call for a cross-platform app — one codebase targeting both iOS and Android. The Expo Go loop — scan a QR code, see changes instantly on device — cut the edit-compile-run cycle to seconds. I didn't need bare workflow or any custom native modules, so managed Expo worked throughout. I used Expo Router 6 for file-based routing, which I'll come back to.

**expo-sqlite** for local storage was one of the best early decisions. The entire workout history, exercise library, progression state, and user settings live in a SQLite database on device. The app works offline. There's no subscription required to access your own data. Reads are synchronous and fast. The tradeoff is that schema changes require careful migrations, but that discipline is worth it.

**Firebase** handles everything that needs a server: Auth, Firestore for social and buddy sessions, and Cloud Functions for feed fan-out. The split is clean: local SQLite for your personal data, Firebase for anything that crosses device boundaries.

**No external state management.** Just React's built-in state and Context for the two things that genuinely need to cross screens — the active workout session timer and the theme. I looked at Redux and Zustand early on and decided the overhead wasn't justified. Everything else is local to screens and re-queried on focus.

---

## The Exercise Library

The foundation is an in-house exercise library with over 1,100 exercises. I started from an open-source exercise database as a seed, but it diverged quickly.

The upstream data covered names, muscle groups, and equipment types, but was missing a lot of detail the app needed: metadata to know whether an exercise should show a timed-hold UI vs. a rep counter, hints for unilateral movements (so the log screen can show "per arm"), flags for surfacing exercises in cold-start recommendations, and name aliases for users importing data from other apps.

The library is now maintained independently and ships with the app as a versioned payload. The app checks the version on each launch and pulls down updates if anything has changed — so I can push corrections to existing users without waiting for an App Store update. There's also an admin queue in the app for reviewing user-submitted exercises before they get added to the library.

---

## The Workout Engine

The generator is doing more than picking random exercises. It has to respect the user's muscle group schedule, their equipment, their training history, their stated preferences, and their current recovery state — and produce something that feels intentional rather than shuffled.

Equipment handling ended up being more nuanced than expected. A simple "I have dumbbells" checkbox doesn't capture reality — someone's home gym has different constraints than their hotel room, which has different constraints than their commercial gym. The solution was letting users define named spaces for each environment, so the workout is always filtered to what's actually available in the place they're training. Weight suggestions account for what weights are physically in the room.

**Double progression** is the underlying programming model: you work within a rep range, and once you've consistently hit the top of it, you add weight and work back up. Sounds simple — but getting the progression logic right across all the edge cases (deloads, exercise swaps, preference changes) took significantly longer than expected. There are a lot of ways to give someone a bad weight suggestion, and most of them are subtle.

**Deload detection** tracks where the user is in their training cycle and flags when it's time to back off. Users can skip it if they feel good, but the logic accounts for that so the next window shifts correctly rather than immediately flagging again.

---

## Navigation Was the Hardest Non-Obvious Problem

Expo Router's file-based routing is elegant until you're deep into a screen hierarchy and something breaks silently.

The core issue: in Expo Router's Tabs navigator, tab screens are **siblings**, not a stack. When you navigate from the History tab into a detail screen, you're not pushing onto a stack — you're switching to a sibling. The back gesture doesn't take you back to History, it takes you to the root. And screens that are hidden from the tab bar get skipped by back navigation entirely.

I hit this bug in a dozen forms before I understood the underlying cause. The rule I landed on: **never rely on back navigation after a mutating action from a tab screen**. Always navigate to an explicit path. For screens that can be opened from multiple tabs, I pass a destination param and use it on save or dismiss. More verbose, but correct.

Read the routing model docs before you build ten screens, not after.

---

## The Social Layer and Cloud Functions

The social feed is built on a fan-out model via Cloud Functions — workouts get distributed server-side rather than written directly by clients. This keeps the feed trustworthy regardless of what the client does.

Buddy sessions let two people train together in real time, seeing each other's exercise choices and set logs as they happen. When the session ends, each person's workout is theirs — stored locally and synced independently.

---

## Shipping to the App Store

Two months from first commit to App Store approval. This was my first iOS submission. The steps: configure signing certificates in Xcode, set up App Store Connect, submit builds via EAS, wait for review. Review took about 48 hours.

EAS (Expo Application Services) handled the codesigning and build pipeline — one command submits a build, no manual Xcode archive step. Each production build also pulls the latest exercise library before bundling, so the app ships current without a separate release cycle for data updates.

One thing I'd do differently: I spent more time on features than on screenshots and metadata. The App Store listing is the first thing potential users see and it deserves the same attention as the code. I rushed it.

---

## What I Learned

**Local-first made the app genuinely better.** SQLite on device is fast, free, and offline — no server round-trip to show your workout history. Firebase is right for the parts that cross device boundaries (social, auth, sync), but keeping core data local means the app works well even when connectivity doesn't, and there's no subscription required to access your own data.

**Domain model first, schema second.** The core data tables are load-bearing — changes require migrations and touch every part of the app. I should have spent more time nailing the data model before writing screens. I didn't, and I paid for it.

**Versioning matters even before launch.** The exercise library versioning system felt like overkill while I was building it. But the first time I needed to fix a wrong muscle group assignment for a popular exercise and push it to devices without waiting for an app update, I was glad it was there.

---

Two months is enough time to build something real. It's not enough to build something finished — there's a lot more in the pipeline. [Rep is on the App Store](https://apps.apple.com/us/app/rep-the-workout-app/id6765540272) — free to download.
