const en = {
  // App title
  appTitle: 'Werewolf Arena',
  appSubtitle: 'The Social Deduction Game',

  // Settings
  settings: 'Settings',
  language: 'Language',
  back: 'Back',
  soundEffects: 'Sound Effects',
  animations: 'Animations',
  on: 'On',
  off: 'Off',
  gameSettings: 'Game Settings',
  displaySettings: 'Display Settings',
  about: 'About',
  aboutDescription: 'Werewolf Arena is a social deduction game where villagers try to identify and exile werewolves, while werewolves try to eliminate villagers without being caught.',
  version: 'Version',

  // Setup
  yourName: 'Your Name',
  enterYourName: 'Enter your name...',
  numberOfPlayers: 'Number of Players',
  playersInfo: '{count} players: {wolves}, 1 Seer, 1 Doctor, {villagers}',
  oneWerewolf: '1 Werewolf',
  twoWerewolves: '2 Werewolves',
  villagerCount: '{count} Villager',
  villagersCount: '{count} Villagers',
  youPlusAI: 'You + {count} AI opponents',
  yourRole: 'Your Role',
  random: 'Random',
  startGame: 'Start Game',
  howToPlay: 'How to Play',
  ruleNight: 'Night: Werewolves eliminate, Doctor protects, Seer investigates',
  ruleDay: 'Day: Players debate and vote to exile a suspect',
  ruleVillagerWin: 'Villagers win by exiling all Werewolves',
  ruleWerewolfWin: 'Werewolves win when they equal or outnumber Villagers',

  // Roles
  Villager: 'Villager',
  Werewolf: 'Werewolf',
  Seer: 'Seer',
  Doctor: 'Doctor',
  Villagers: 'Villagers',
  Werewolves: 'Werewolves',

  // Role descriptions
  villagerDesc: 'You are a Villager. Use logic and debate to identify the Werewolves and vote them out.',
  werewolfDesc: 'You are a Werewolf! Each night, eliminate a villager. Blend in during the day to avoid being exiled.',
  seerDesc: 'You are the Seer. Each night, investigate one player to learn their true role.',
  doctorDesc: 'You are the Doctor. Each night, protect one player from being eliminated by the Werewolves.',

  // Role Reveal
  welcomePlayer: 'Welcome, {name}!',
  yourSecretRole: 'Your secret role is...',
  keepRoleSecret: '⚠️ Keep your role secret from others!',
  beginTheGame: 'Begin the Game',

  // Game Board - Phases
  nightPhase: '🌙 Night Phase',
  nightResolution: '🌙 Night Resolution',
  dayPhaseDebate: '☀️ Day Phase — Debate',
  dayPhaseVoting: '🗳️ Day Phase — Voting',
  dayResolution: '☀️ Day Resolution',
  summaries: '📝 Summaries',

  // Game Board - Actions
  chooseEliminate: '🐺 Choose your target to eliminate tonight',
  chooseProtect: '💊 Choose a player to protect tonight',
  chooseInvestigate: '🔮 Choose a player to investigate tonight',
  confirm: 'Confirm',
  voteToExile: '🗳️ Vote to exile a suspect',
  voteHint: 'Your vote is private. Choose wisely!',
  castVote: 'Cast Vote',
  yourTurnToSpeak: "💬 It's your turn to speak! ({current}/{max})",
  whatToSay: 'What do you want to say to the village?',
  speak: 'Speak',

  // Game Board - Phase Controls
  villageSleeps: 'The village sleeps... Night actions are being processed.',
  skipToMorning: 'Skip to Morning →',
  startDayPhase: '☀️ Start Day Phase',
  debateTurn: 'Debate turn {current}/{max}',
  timeToVote: ' — Time to vote!',
  proceedToVoting: '🗳️ Proceed to Voting',
  nextDebateTurn: 'Next Debate Turn →',
  aiVotedYourTurn: 'AI players have cast their votes. Now it\'s your turn...',
  beginNextRound: '🌙 Begin Next Round',

  // Game Board - Header
  round: 'Round {num}',
  gameLog: '📜 Game Log',
  showRolesDebug: 'Show Roles (Debug)',
  quit: 'Quit',
  playersAlive: 'Players ({count} alive)',

  // Game Board - End Game
  villagersWin: 'Villagers Win!',
  werewolvesWin: 'Werewolves Win!',
  congratulations: '🎉 Congratulations! You were on the winning team!',
  teamLost: '😔 Your team lost this time.',
  finalRoles: 'Final Roles:',
  eliminated: 'Eliminated',
  playAgain: '🎮 Play Again',
  gameHistory: '📜 Game History',

  // Game Log
  roundNight: '🌙 Round {num} — Night',
  roundDay: '☀️ Round {num} — Day',
  eliminatedByWerewolves: '💀 {name} was eliminated by the Werewolves',
  doctorSaved: '🛡️ The Doctor saved the Werewolves\' target — no one was eliminated!',
  youInvestigated: '🔮 You investigated {name} → They are a',
  votes: '🗳️ Votes',
  exiledByVillage: '⛔ {name} was exiled by the village!',
  noMajority: '🤷 No majority reached — no one was exiled.',
  endOfRoundSummaries: '📝 End-of-Round Summaries',
  biddingRound: '🎯 Bidding Round',
  winsTheBid: '🎤 {name} wins the bid (bid: {bid})',
  you: 'YOU',

  // Player Card
  playerEliminated: 'Eliminated',

  // Game Context messages
  gameStarted: 'Game started! Players have been assigned their roles.',
  nightPassesEliminated: '🌙 Night passes... {name} was eliminated by the Werewolves.',
  nightPassesNoOne: '🌙 Night passes... No one was eliminated! (The Doctor saved the Werewolves\' target.)',
  villageVotedExile: '🗳️ The village voted to exile {name}! They were a {role}.',
  noMajorityNoExile: '🗳️ No majority reached. No one was exiled today.',
  debateMessage: '💬 {name}: "{message}"',
  debateMessageYou: '💬 {name} (You): "{message}"',
};

export type TranslationKeys = keyof typeof en;
export type Translations = typeof en;
export default en;
