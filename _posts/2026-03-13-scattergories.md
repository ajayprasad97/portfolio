---
title: "Building a Multiplayer Scattergories Game from Scratch"
preview: "How I built a real-time multiplayer party game with Node.js, Socket.io, and Supabase — what went wrong, what I learned, and how I tested it with friends."
cover: /assets/img/scattergories.png
featured: true
tags:
  - Node.js
  - Socket.io
  - Supabase
  - Game Dev
  - Testing
links:
  - label: "Play the Game"
    url: "https://scattergories.ajayprasad.com"
  - label: "GitHub"
    url: "https://github.com/ajayprasad97"
---

A few months ago I wanted to play Scattergories with some friends over a group call. We tried the usual routes — a shared Google Doc, a free online version covered in ads, passing the phone around. None of it felt right. So I did what any developer would do at 11pm on a Friday: I decided to build it myself.

What started as a weekend project turned into one of the most fun and genuinely educational things I've built.

---

## How It Started

The idea was simple. A real-time multiplayer game where everyone gets the same letter and a list of categories, a timer counts down, and at the end you vote on each other's answers. No accounts, no installs, just share a code and play.

I'd been wanting to get more comfortable with WebSockets and real-time state management, so this felt like a good excuse. I chose Node.js with Express and Socket.io for the backend, vanilla HTML/CSS/JS for the frontend, Supabase for persistence, and Render.com for hosting — all free tier.

The goal was to keep it simple enough to ship quickly but polished enough that my friends would actually want to use it.

---

## What I Built

The core game loop ended up like this:

- Host creates a game and sets the timer, number of rounds, and how many categories per round
- Players join with a code — no account needed
- Everyone sees the same random letter and categories simultaneously
- Answers autosave as you type — no submit button, the timer ending locks everything
- Review phase: duplicates are auto-flagged, players vote on each other's answers
- Scores accumulate across rounds, final leaderboard at the end

The tech stack stayed lean throughout: a single `index.html` for the entire frontend, a `server.js` handling all the socket logic, and a `db.js` for saving sessions to Supabase asynchronously after each round.

---

## What Went Wrong (And How I Fixed It)

### The race condition that wouldn't die

The hardest bug to kill was getting the answer summary to show up after scores. Every player should see their own answers listed below the scoreboard — which ones counted, which didn't, and why.

The problem was that I had two separate socket events: `phase_change` to render the screen, and `my_answers_summary` to populate the answers below it. They fired almost simultaneously from the server but arrived in unpredictable order on the client. If the summary arrived before the screen was visible, there was nothing to inject into. If the screen rendered first, the summary handler missed its window.

I tried `requestAnimationFrame`, shared inject functions, waiting for DOM elements — none of it was reliable. The real fix was embarrassingly simple: **bundle the answers directly into `phase_change` as a field**. One event, everything arrives together, no timing tricks needed. The screen renders with the data already there.

The same pattern fixed a similar issue with the review grid. Instead of emitting `answers_grid` separately after round end, it now travels inside `phase_change`. Two fewer event types, zero race conditions.

### Voting rules didn't hold up in a 2-player game

The original majority vote logic was `floor(n/2) + 1` where `n` is total players. With 2 players that means you need 2 votes to flag an answer — but you can't vote on your own answer, so the only other player can cast exactly 1 vote. Nothing could ever get flagged.

The fix was to calculate majority from **eligible voters** — everyone except the answer's owner — rather than total player count. In a 2-player game that means 1 eligible voter, and 1 no vote is enough to flag. Scales correctly up to any group size.

### Rejoin after disconnect deleted the player

The disconnect handler was removing players from the room immediately. So when someone's phone dropped and they tried to rejoin with the same name and code, there was no record of them left to match against.

The fix was to keep disconnected players in the room during an active game, marked with a `disconnected: true` flag instead of deleted. On rejoin the server matches by name, swaps in the new socket ID across all room state, and sends back a payload tailored to whatever phase the game is currently in — including their saved answers and accumulated score.

### The tests kept timing out

I set up integration tests using Jest and `socket.io-client` — fake socket clients playing through real game flows against a real server. The problem was that any test relying on a 2-second timer would fail intermittently because `setInterval` inside a Jest-cached Node module doesn't behave reliably.

The fix was a `force_end_round` socket event, only registered when `NODE_ENV=test`, that immediately calls `endRound()` without waiting for the timer. Tests went from 70 seconds and flaky to 9 seconds and deterministic.

---

## Playing It With Friends

After a few weeks of building I finally got a group together to play. We ran three rounds with a 2-minute timer and 15 categories. Within the first round I found two bugs I'd never hit in solo testing — one where a player's answers didn't save when they typed too fast, and one where the review screen showed the wrong round number.

Both were fixed the same night. The autosave was debounced too aggressively and was dropping keystrokes. The round number was an off-by-one in the `phase_change` emit.

The scoring and voting held up well. The 2-minute timer created genuine pressure and the duplicate detection worked exactly as intended — watching everyone write "Whale" for a sea creatures category and have them get wiped out is genuinely funny.

---

## What I Learned

**Bundle related events.** If two pieces of data belong together on screen, send them together. Separate events create race conditions that are hard to reason about and painful to debug.

**Test with real players early.** I found more bugs in one session with friends than in weeks of solo testing. Real users do things you don't anticipate — they type fast, they drop connection, they sit on the review screen for ten minutes while debating a ruling.

**Free tier is genuinely viable for small apps.** The whole stack — Render, Supabase, GitHub Pages for the domain — costs nothing. Render's free tier spins down after inactivity which means a 30-second cold start, but for a game you're starting intentionally with a group of friends it's a non-issue.

**Write tests before the codebase gets complex.** I added tests late and spent a lot of time retrofitting the server to be testable. Exporting `server` and `rooms`, adding `force_end_round`, making Supabase mockable — all of that would have been easier to design in from the start.

---

## What's Next

A few things I want to add:

- **All-time leaderboard** — a public `/leaderboard` page pulling from Supabase so you can see who's won the most across all sessions
- **AI judge** — use an LLM to auto-score borderline answers instead of relying on group votes
- **Sound effects** — a ticking timer in the last 10 seconds and a buzzer at zero would add a lot to the atmosphere
- **Custom categories** — let the host add or remove categories before the game starts

The code is on GitHub at [github.com/ajayprasad97](https://github.com/ajayprasad97) if you want to take a look or run your own instance.
