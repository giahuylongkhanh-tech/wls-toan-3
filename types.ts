
export enum View {
  LOGIN = 'LOGIN',
  LOBBY = 'LOBBY',
  GAME = 'GAME',
  RESULT = 'RESULT',
  RANKING = 'RANKING',
  ADMIN = 'ADMIN',
  HALL_OF_FAME = 'HALL_OF_FAME'
}

export enum AdminTab {
  PLAYERS = 'PLAYERS',
  QUESTIONS = 'QUESTIONS',
  LOGS = 'LOGS',
  CLASSES = 'CLASSES',
  SETTINGS = 'SETTINGS'
}

export type QuestionType = 'multiple' | 'truefalse' | 'short' | 'fill';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string | number;
  points: number;
  timeLimit: number;
  round: number;
  level: 'Easy' | 'Medium' | 'Hard';
  category?: string;
}

export interface Round {
  id: number;
  name: string;
  description: string;
  minLevel: number;
}

export interface Player {
  id: string;
  name: string;
  className: string;
  password?: string;
  totalScore: number;
  totalTimeSpent: number;
  completedRounds: number[];
  isAdmin?: boolean;
  status: 'active' | 'locked';
  createdAt: string;
  lastLogin?: string;
}

export interface GameLog {
  id: string;
  playerId: string;
  roundId: number;
  score: number;
  timeSpent: number;
  playedAt: string;
}

export interface SystemConfig {
  ConfigKey: string;
  ConfigValue: string;
  Description: string;
}
