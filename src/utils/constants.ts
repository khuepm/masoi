export const PLAYER_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
  'Frank', 'Grace', 'Henry', 'Iris', 'Jack',
  'Kate', 'Liam', 'Mia', 'Noah', 'Olivia',
  'Peter', 'Quinn', 'Rachel', 'Sam', 'Tara',
];

export const AVATARS = ['🧑', '👩', '🧔', '👱', '🧕', '👨', '👩‍🦱', '🧑‍🦲', '👩‍🦳', '🧑‍🦰'];

export const ROLE_COLORS: Record<string, string> = {
  Villager: '#4caf50',
  Werewolf: '#f44336',
  Seer: '#2196f3',
  Doctor: '#9c27b0',
};

export const ROLE_ICONS: Record<string, string> = {
  Villager: '🏘️',
  Werewolf: '🐺',
  Seer: '🔮',
  Doctor: '💊',
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  Villager: 'You are a Villager. Use logic and debate to identify the Werewolves and vote them out.',
  Werewolf: 'You are a Werewolf! Each night, eliminate a villager. Blend in during the day to avoid being exiled.',
  Seer: 'You are the Seer. Each night, investigate one player to learn their true role.',
  Doctor: 'You are the Doctor. Each night, protect one player from being eliminated by the Werewolves.',
};

export const MAX_DEBATE_TURNS = 10;
