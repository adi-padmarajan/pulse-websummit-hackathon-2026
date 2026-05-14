<div align="center">

# Pulse

### The room is talking. Pulse tells you who's saying what you need to hear.

*Real-time networking for live events.*

</div>

---

## The Pitch

It is 11:47 AM on day two of Web Summit. You just walked out of a masterclass that completely changed how you think.

Your next session starts in 60 minutes. So you walk into the lobby, look around, and do what almost everyone else is doing.

You scroll your phone.

> **That coffee break cost you $50. And you spent it alone.**

You spent over $1,000 travelling to Web Summit, but somewhere in the back of your mind, you feel like you are not making the most of it.

There are more than 20,000 people around you. Founders. Investors. Engineers. Operators. Students. Creators.

But somehow, you still do not know who to talk to.

You want to meet people who are actually relevant to your goals. People building in the same space. People who just attended the same session. People who are nearby right now, also hoping to make a meaningful connection.

By the end of the summit, most attendees leave with only two or three meaningful conversations. Not because they did not try. But because the right moment passed before they knew who was around them.

Here is the problem. Every networking app at this conference is built on the same wrong idea — that networking is about finding the right person.

It's not. The right person is already here. They just walked out of the same room as you ninety seconds ago. They are sitting across the convention centre, between sessions, hoping to meet someone exactly like you.

> **The real problem is not discovery. The real problem is timing.**

Finding the right person in the next 30 minutes, before you both disappear into different sessions, meetings, or lunch plans.

That is why we built Pulse.

<br>

> ### *Pulse doesn't ask "who should I connect with someday?"*
> ### *Pulse asks "who should I talk to right now?"*

---

## How Pulse Works

It starts with a **quest**. You broadcast where your head is right now — a session you just walked out of, a topic you can't stop thinking about, or just a moment you don't want to spend alone. You tell Pulse how much time you have. Thirty minutes. An hour. Until your next talk. That's it.

Then you open the **radar**. It's a live, spatial view of everyone in the venue whose context window overlaps with yours. Dots are positioned by proximity — same room, same hall, same venue. Brightness and glow tell you match quality. The radar breathes. People appear and disappear as their quests expire. It feels less like a directory and more like watching the room think.

When you tap a match, Pulse shows you why this person is worth your next 30 minutes — a short, AI-written explanation of the overlap, plus a suggested opener that doesn't sound like a LinkedIn message. You tap **Wave**. They get a ping. If they wave back, the connection forms. Identity stays hidden until both sides opt in. Nobody can see you unless you've already agreed to meet them.

Two people connecting is just the start. Once you're at the coffee table, Pulse can grow the **gathering**. Nearby people with overlapping context can request to join. Three people becomes four. A pair becomes a table. The product seeds small, organic groups of people who actually share something — not random mixers with name tags.

At the end of the day, you get a **recap**. The conversations you had. The threads worth following up on. And on the organizer side, a view of how the room actually behaved — where matches happened, what topics moved, where the energy was.

---

## Three Ways to Drop a Quest

| Mode | When to use it | Example |
|---|---|---|
| **Just attended a session** | For the moments right after a talk that hit different. | *"Coming out of the Metalabs masterclass and still arguing with Pip's take on AI in design. Want to find someone who disagrees with me before the next session."* |
| **Want to talk about a topic** | For when you have a specific idea on your mind, regardless of where you are. | *"Want to meet someone else figuring out AI product pricing. Will trade actual experiments for actual experiments. No theory."* |
| **Just in a moment** | For lunch, free time, or the in-between hours when you just want company. | *"Heading to lunch with no plan. Quit my job two weeks ago and want to eat with someone who also recently jumped. Not looking for advice — just company."* |

---

## Why Pulse Is Different

### It matches moments, not profiles.

Most networking apps match who you are. Pulse matches what you need right now. The signal is ephemeral, intent-driven, and tied to a time window — so the matches are always relevant to the next 30 minutes, not someday.

### It's designed against its dark version.

Quests expire automatically. Identity stays hidden until both sides agree to meet. Locations are shown only as proximity rings relative to each person, never as a map. The product was designed against the version of itself that would be a stalker app.

### It builds tables, not pairs.

After two people connect, Pulse can grow the conversation — nearby people who share context can request to join. The product seeds organic gatherings, not just one-to-one meetings.

### It generates data the event can actually use.

Every match, gathering, and feedback rating produces a measurable signal of conversation quality. Web Summit doesn't sell tickets — it sells access. Pulse makes that access measurable.

---

## Built With

**Frontend** — React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
**Backend** — Supabase (PostgreSQL with realtime subscriptions and Row Level Security)
**AI** — Claude for quest parsing and match explanation generation
**Deployment** — Lovable
**Visualization** — SVG-based radar with Framer Motion-driven animations

---

## See It in Action

[Live demo →](#)

[90-second walkthrough →](#)

What to watch for:

- **The radar that breathes** — pulse animations, live counters, scanning sweeps
- **The Metalabs cluster** — four people who all just left the same masterclass, visually grouped
- **The coffee gathering** — the moment two strangers become a table, and then three

*[Radar screenshot]*

*[Gathering screenshot]*

---

## Roadmap

- Real geolocation via Bluetooth proximity (currently mocked with hardcoded zones)
- Push notifications for wave-backs and join requests
- An organizer dashboard showing the full Room Heatmap — where in the venue matches actually happen, what topics dominated, where the energy peaked
- LinkedIn integration for one-tap post-conversation connection

---

## Team Members:

Aditya Padmarajan <br>
Lucas Wang

Built at Web Summit Vancouver, May 14, 2026, in a three-hour hackathon by [team names].

---

<div align="center">

*Web Summit creates the room. Pulse makes the room work.*

</div>
