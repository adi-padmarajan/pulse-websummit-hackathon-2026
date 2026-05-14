<div align="center">

# Pulse

### Web Summit creates the room. Pulse helps you find who to talk to right now.

*An interactive quest radar for turning live-event moments into real connections.*

</div>

---

## Video Demo

[Watch the demo →](VideoDemo.mp4)

---

## The Pitch

It is day two of Web Summit.

You just walked out of a session that completely changed how you think. Your next talk starts in 60 minutes. Around you are 2000+ founders, investors, engineers, operators, students, and creators.

So you walk into the lobby, look around, and do what almost everyone else is doing.

You scroll your phone.

> **That coffee break was one of the most expensive hours of your trip. And you spent it alone.**

The right people are already here. They may have just left the same session. They may be thinking about the same problem. They may be nearby right now, hoping to meet someone exactly like you.

But you still do not know who to talk to.

Most event networking tools are built like static directories. They ask you to search profiles, send cold messages, and maybe schedule something later.

But live events are not static. They are made of moments.

The person you should meet might only be relevant for the next 30 minutes, before you both disappear into different sessions, lunch plans, meetings, or afterparties.

> **The real problem is not discovery. The real problem is timing.**

That is why we built Pulse.

<br>

> ### Pulse does not ask, “Who should I connect with someday?”
> ### Pulse asks, “Who should I talk to right now?”

---

## What Pulse Does

Pulse is a real-time networking layer for Web Summit.

It helps attendees turn the empty time between sessions into meaningful conversations by showing who nearby is relevant to their current context, interest, and available time.

Instead of browsing an attendee list, users create a short-lived **Quest**.

A Quest says:

- What you want to talk about
- Where your head is right now
- How much time you have
- Whether you are open to a one-on-one conversation or a small gathering

Pulse then shows nearby people whose context overlaps with yours.

You can wave, meet, save the conversation, follow up on LinkedIn, and return to the loop with a new Quest.

---

## Hackathon Demo Focus

This is a micro-hackathon, so Pulse focuses on one core feature:

> **A live Quest Radar that helps a Web Summit attendee find who to talk to right now.**

The demo flow is:

**Create a Quest → See contextual matches on the Radar → Wave → Meet or join a Gathering → Save the Conversation → Follow up on LinkedIn → See All My Quests → New Quest**

The goal is not to build a full event platform. The current Web Summit App is already a platform with excellent tools (Boardy AI, In-Built Connection Requests, WhatsApp Chats etc). We aim to enhance the existing Web Summit App features, and improve the attendees' experience as a whole by ensure they have meaningful connection by the end of the summit.

The goal is to demonstrate one complete networking loop: from live intent, to real-time matching, to a meaningful conversation, to a saved recap that helps the attendee remember who they met and what happened.

---

## The Problem

Web Summit creates enormous opportunity by bringing thousands of people into the same place.

But for attendees, that opportunity is hard to use.

You might know what session you just attended. You might know what you want to talk about. You might know that you have 45 minutes before your next event.

But you do not know:

- Who nearby is thinking about the same thing
- Who is also available right now
- Who would actually be open to talking
- Which conversations are worth saving afterward

So the most valuable moments at live events often disappear.

Not because people do not want to connect.

Because the room has no interface.

---

## The Solution

Pulse gives the room an interface.

Attendees broadcast short-lived intent through Quests. Pulse then visualizes nearby matches through a live Radar, explains why each match is relevant, and helps people form small, useful conversations in the moment.

After the conversation, Pulse asks whether the meeting actually happened and whether it is worth saving. If it was valuable, Pulse records it as a saved conversation, shows a LinkedIn follow-up path, and lets the attendee review their day through **See All My Quests**.

Pulse is not trying to replace Web Summit Mobile App.

It makes the Web Summit room work better.

---

## 🎯 How Pulse Works

A single networking loop, designed for the in-between moments at Web Summit.

> **Quest → Radar → Wave → Meet → Save → Follow Up → New Quest**

| Step | What Happens |
|---|---|
| 📝 **Drop a Quest** | Broadcast short-lived intent: what you want to talk about, how long you have. Auto-expires. |
| 📡 **Open the Radar** | Live spatial view of nearby people whose Quests overlap with yours. |
| 💡 **Read the Match** | Tap a match to see the shared context, their Quest, and a suggested opener — no awkward first sentence. |
| 👋 **Wave** | Lightweight, mutual request to connect. Identity stays hidden until both sides agree. |
| ☕ **Meet or Gather** | One-on-one, or grow into a small Gathering when a third nearby attendee has overlapping context. |
| ✅ **Check In** | Did the conversation happen? Save it, or skip — keeps the recap honest. |
| 🔗 **LinkedIn Follow-Up** | Turn the moment into a lasting connection after the event. |
| 🔁 **New Quest** | See all saved conversations from the day, then loop back into the room. |

---

## ✨ Why Pulse Is Different

- 🕒 **Matches moments, not profiles** — temporary, intent-driven signals tied to a real time window.
- 🎯 **Built for timing** — the best conversation is often only relevant for the next 30 minutes.
- 💬 **Builds conversations, not just contacts** — saved recaps + LinkedIn handoff, not a stack of business cards.
- 🛡️ **Designed against the creepy version** — Quests expire, identity is gated by mutual consent, proximity is fuzzy not exact.

---

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| **Frontend** | React • TypeScript • TanStack Start • Tailwind CSS • shadcn/ui • Framer Motion |
| **Backend** | Supabase (PostgreSQL, Realtime, Row Level Security) |
| **AI** | Claude — Quest parsing & match explanations |
| **Build** | Vite • Bun |
| **Deploy** | Cloudflare Workers (via `wrangler`) • Lovable |
| **Viz** | SVG-based Radar animated with Framer Motion |

---

## 📁 Repo Structure

```
pulse-websummit-hackathon-2026/
├── src/
│   ├── components/
│   │   ├── pulse/          # Core feature components (Radar, QuestComposer, MatchSheet, …)
│   │   └── ui/             # shadcn/ui primitives
│   ├── routes/             # TanStack Router routes
│   ├── hooks/              # Custom React hooks
│   ├── integrations/
│   │   └── supabase/       # Supabase client + types
│   └── lib/                # Utilities, mock data, error handling
├── supabase/
│   └── migrations/         # SQL migrations
├── package.json
├── vite.config.ts
└── wrangler.jsonc          # Cloudflare Workers config
```

---

## 🚀 How to Run

**Prerequisites:** [Bun](https://bun.sh) (or Node 18+) and a Supabase project.

```bash
# 1. Clone
git clone https://github.com/adi-padmarajan/pulse-websummit-hackathon-2026.git
cd pulse-websummit-hackathon-2026

# 2. Install
bun install

# 3. Configure env — create a .env with your Supabase keys
#    VITE_SUPABASE_URL=...
#    VITE_SUPABASE_ANON_KEY=...

# 4. Run dev server
bun run dev            # http://localhost:5173

# Other scripts
bun run build          # production build
bun run preview        # preview built app
bun run lint           # eslint
```

---

## 👥 Team

| | |
|---|---|
| 🧑‍💻 **Aditya Padmarajan** | CS @ University of Victoria |
| 🧑‍💻 **Lucas Wang** | Software Engineer |

Built at the **Web Summit 2026 Micro-Hackathon**.

---

## 🛣️ Roadmap

- 📶 Bluetooth / venue-based proximity
- 🔔 Push notifications for Wave-backs and Gathering invites
- 📊 Organizer dashboard with conversation heatmaps
- 🤖 End-of-day AI-generated attendee recap
- 🔗 Deeper LinkedIn integration
- 🎪 Support for multi-day festivals & online-to-offline gatherings

---

<div align="center">

### Pulse does not ask, “Who should I connect with someday?”
### Pulse asks, “Who should I talk to right now?”

*Then helps you keep the conversations worth remembering.*

**Web Summit creates the room. Pulse makes the room work.**

</div>