# 🐺 Masoi — Werewolf Arena

A full-featured **Werewolf (Ma Sói)** social deduction game built in **ReactJS + TypeScript**, inspired by [google/werewolf_arena](https://github.com/google/werewolf_arena).

## Features

All key mechanics from the original `werewolf_arena` have been implemented:

| Feature | Description |
|---|---|
| 🎭 **4 Roles** | Villager, Werewolf, Seer, Doctor |
| 🌙 **Night Phase** | Werewolves eliminate, Doctor protects, Seer investigates |
| ☀️ **Day Phase** | Debate with bidding system (0–4), then vote to exile |
| 🎯 **Bidding System** | Players bid to speak next (highest bid wins, ties broken randomly) |
| 💬 **Debate** | 10-turn debate with human input + AI bot messages |
| 🗳️ **Voting** | Majority vote to exile a suspect |
| 📝 **Summaries** | End-of-round summaries for all players |
| 🏆 **Win Conditions** | Villagers exile all Werewolves / Werewolves outnumber Villagers |
| 🤖 **AI Bots** | Rule-based AI opponents for all non-human players |
| 📜 **Game Log** | Interactive transcript with bid bars, debate bubbles, votes |
| 🔍 **Debug Mode** | Toggle to reveal all roles |

## Getting Started

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

## How to Play

1. **Setup** — Enter your name, choose number of players (6–10), and optionally pick your role
2. **Role Reveal** — See your secret role privately
3. **Night Phase** — Perform your night action (investigate/protect/eliminate based on your role)
4. **Day Phase** — Watch AI debate and participate when it's your turn (guaranteed 2 turns)
5. **Vote** — Cast your secret vote to exile a suspect
6. **Repeat** until Villagers or Werewolves win!

## Build

```bash
npm run build
```

## Screenshots

### Setup Screen
![Setup Screen](https://github.com/user-attachments/assets/d24b4293-214c-4d9e-b116-a33ab39071f6)

### Role Reveal
![Role Reveal](https://github.com/user-attachments/assets/8b206950-8103-451f-9ffb-8ebfdf161562)

### Night Phase (Seer Investigation)
![Night Phase](https://github.com/user-attachments/assets/9aae7a7c-277b-478c-85fe-d7890d0ade3b)

### Night Resolution
![Night Resolution](https://github.com/user-attachments/assets/f569ddcf-80bf-4fd7-8c2e-c67898a4a0cb)

### Day Phase — Human Debate Turn
![Day Debate](https://github.com/user-attachments/assets/e1fa7d35-a7bf-45f2-b3f9-8b127f7e3f7f)
