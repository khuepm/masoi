import { Translations } from './en';

const vi: Translations = {
  // App title
  appTitle: 'Đấu Trường Ma Sói',
  appSubtitle: 'Trò Chơi Suy Luận Xã Hội',

  // Settings
  settings: 'Cài Đặt',
  language: 'Ngôn Ngữ',
  back: 'Quay Lại',
  soundEffects: 'Hiệu Ứng Âm Thanh',
  animations: 'Hiệu Ứng Động',
  on: 'Bật',
  off: 'Tắt',
  gameSettings: 'Cài Đặt Trò Chơi',
  displaySettings: 'Cài Đặt Hiển Thị',
  about: 'Giới Thiệu',
  aboutDescription: 'Đấu Trường Ma Sói là trò chơi suy luận xã hội, nơi dân làng cố gắng tìm và trục xuất ma sói, trong khi ma sói cố gắng tiêu diệt dân làng mà không bị phát hiện.',
  version: 'Phiên Bản',

  // Setup
  yourName: 'Tên Của Bạn',
  enterYourName: 'Nhập tên của bạn...',
  numberOfPlayers: 'Số Người Chơi',
  playersInfo: '{count} người chơi: {wolves}, 1 Tiên Tri, 1 Bác Sĩ, {villagers}',
  oneWerewolf: '1 Ma Sói',
  twoWerewolves: '2 Ma Sói',
  villagerCount: '{count} Dân Làng',
  villagersCount: '{count} Dân Làng',
  youPlusAI: 'Bạn + {count} đối thủ AI',
  yourRole: 'Vai Trò Của Bạn',
  random: 'Ngẫu Nhiên',
  startGame: 'Bắt Đầu',
  howToPlay: 'Cách Chơi',
  ruleNight: 'Đêm: Ma Sói tiêu diệt, Bác Sĩ bảo vệ, Tiên Tri điều tra',
  ruleDay: 'Ngày: Người chơi tranh luận và bỏ phiếu trục xuất nghi phạm',
  ruleVillagerWin: 'Dân Làng thắng khi trục xuất hết Ma Sói',
  ruleWerewolfWin: 'Ma Sói thắng khi số lượng bằng hoặc nhiều hơn Dân Làng',

  // Roles
  Villager: 'Dân Làng',
  Werewolf: 'Ma Sói',
  Seer: 'Tiên Tri',
  Doctor: 'Bác Sĩ',
  Villagers: 'Dân Làng',
  Werewolves: 'Ma Sói',

  // Role descriptions
  villagerDesc: 'Bạn là Dân Làng. Hãy dùng logic và tranh luận để tìm ra Ma Sói và bỏ phiếu loại chúng.',
  werewolfDesc: 'Bạn là Ma Sói! Mỗi đêm, hãy tiêu diệt một dân làng. Ban ngày hãy hòa nhập để tránh bị trục xuất.',
  seerDesc: 'Bạn là Tiên Tri. Mỗi đêm, hãy điều tra một người chơi để biết vai trò thật của họ.',
  doctorDesc: 'Bạn là Bác Sĩ. Mỗi đêm, hãy bảo vệ một người chơi khỏi bị Ma Sói tiêu diệt.',

  // Role Reveal
  welcomePlayer: 'Chào mừng, {name}!',
  yourSecretRole: 'Vai trò bí mật của bạn là...',
  keepRoleSecret: '⚠️ Hãy giữ bí mật vai trò của bạn!',
  beginTheGame: 'Bắt Đầu Trò Chơi',

  // Game Board - Phases
  nightPhase: '🌙 Pha Đêm',
  nightResolution: '🌙 Kết Quả Đêm',
  dayPhaseDebate: '☀️ Pha Ngày — Tranh Luận',
  dayPhaseVoting: '🗳️ Pha Ngày — Bỏ Phiếu',
  dayResolution: '☀️ Kết Quả Ngày',
  summaries: '📝 Tổng Kết',

  // Game Board - Actions
  chooseEliminate: '🐺 Chọn mục tiêu để tiêu diệt đêm nay',
  chooseProtect: '💊 Chọn người chơi để bảo vệ đêm nay',
  chooseInvestigate: '🔮 Chọn người chơi để điều tra đêm nay',
  confirm: 'Xác Nhận',
  voteToExile: '🗳️ Bỏ phiếu trục xuất nghi phạm',
  voteHint: 'Phiếu bầu của bạn là bí mật. Hãy chọn cẩn thận!',
  castVote: 'Bỏ Phiếu',
  yourTurnToSpeak: '💬 Đến lượt bạn phát biểu! ({current}/{max})',
  whatToSay: 'Bạn muốn nói gì với dân làng?',
  speak: 'Phát Biểu',

  // Game Board - Phase Controls
  villageSleeps: 'Làng đang ngủ... Các hành động ban đêm đang được xử lý.',
  skipToMorning: 'Bỏ qua đến Sáng →',
  startDayPhase: '☀️ Bắt Đầu Pha Ngày',
  debateTurn: 'Lượt tranh luận {current}/{max}',
  timeToVote: ' — Đến lúc bỏ phiếu!',
  proceedToVoting: '🗳️ Tiến Hành Bỏ Phiếu',
  nextDebateTurn: 'Lượt Tranh Luận Tiếp →',
  aiVotedYourTurn: 'Các AI đã bỏ phiếu. Bây giờ đến lượt bạn...',
  beginNextRound: '🌙 Bắt Đầu Vòng Mới',

  // Game Board - Header
  round: 'Vòng {num}',
  gameLog: '📜 Nhật Ký',
  showRolesDebug: 'Hiện Vai Trò (Debug)',
  quit: 'Thoát',
  playersAlive: 'Người chơi ({count} sống)',

  // Game Board - End Game
  villagersWin: 'Dân Làng Thắng!',
  werewolvesWin: 'Ma Sói Thắng!',
  congratulations: '🎉 Chúc mừng! Bạn ở phe thắng cuộc!',
  teamLost: '😔 Phe của bạn đã thua lần này.',
  finalRoles: 'Vai Trò Cuối:',
  eliminated: 'Đã Bị Loại',
  playAgain: '🎮 Chơi Lại',
  gameHistory: '📜 Lịch Sử Trò Chơi',

  // Game Log
  roundNight: '🌙 Vòng {num} — Đêm',
  roundDay: '☀️ Vòng {num} — Ngày',
  eliminatedByWerewolves: '💀 {name} đã bị Ma Sói tiêu diệt',
  doctorSaved: '🛡️ Bác Sĩ đã cứu mục tiêu của Ma Sói — không ai bị loại!',
  youInvestigated: '🔮 Bạn đã điều tra {name} → Họ là',
  votes: '🗳️ Phiếu Bầu',
  exiledByVillage: '⛔ {name} đã bị dân làng trục xuất!',
  noMajority: '🤷 Không đạt đa số — không ai bị trục xuất.',
  endOfRoundSummaries: '📝 Tổng Kết Cuối Vòng',
  biddingRound: '🎯 Vòng Đấu Giá',
  winsTheBid: '🎤 {name} thắng đấu giá (giá: {bid})',
  you: 'BẠN',

  // Player Card
  playerEliminated: 'Đã Bị Loại',

  // Game Context messages
  gameStarted: 'Trò chơi bắt đầu! Các người chơi đã được phân vai.',
  nightPassesEliminated: '🌙 Đêm qua... {name} đã bị Ma Sói tiêu diệt.',
  nightPassesNoOne: '🌙 Đêm qua... Không ai bị loại! (Bác Sĩ đã cứu mục tiêu của Ma Sói.)',
  villageVotedExile: '🗳️ Dân làng đã bỏ phiếu trục xuất {name}! Họ là {role}.',
  noMajorityNoExile: '🗳️ Không đạt đa số. Không ai bị trục xuất hôm nay.',
  debateMessage: '💬 {name}: "{message}"',
  debateMessageYou: '💬 {name} (Bạn): "{message}"',

  // Auth
  signIn: 'Đăng Nhập',
  signUp: 'Đăng Ký',
  email: 'Email',
  password: 'Mật Khẩu',
  enterEmail: 'Nhập email của bạn...',
  enterPassword: 'Nhập mật khẩu của bạn...',
  alreadyHaveAccount: 'Đã có tài khoản?',
  dontHaveAccount: 'Chưa có tài khoản?',
  signUpSuccess: 'Tạo tài khoản thành công! Vui lòng kiểm tra email để xác nhận, sau đó đăng nhập.',
  signOutBtn: 'Đăng Xuất',

  // User Settings
  userSettings: 'Cài Đặt Người Dùng',
  account: 'Tài Khoản',
  llmConnections: 'Kết Nối LLM',
  llmConnectionsDesc: 'Kết nối API key để sử dụng các mô hình AI cho trải nghiệm chơi tốt hơn. Các key được lưu trữ cục bộ trên thiết bị của bạn.',
  connected: 'Đã Kết Nối',
  saveSettings: 'Lưu Cài Đặt',
  saved: 'Đã Lưu',
  show: 'Hiện',
  hide: 'Ẩn',
};

export default vi;
