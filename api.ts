
import { Player, Question } from './types.ts';

const API_URL = "https://script.google.com/macros/s/AKfycbwqAY5V-oRH1-e1pedF1V9cRe3xTLfjjbG8u_OWPSvKTGoDmoFyq_3dpcuNK6sqo0iDgQ/exec";

function mapFromGas(gasData: any): any {
  if (!gasData) return null;
  if (Array.isArray(gasData)) return gasData.map(item => mapFromGas(item));

  const mapping: Record<string, string> = {
    'ID': 'id', 'Name': 'name', 'ClassName': 'className', 'Password': 'password',
    'TotalScore': 'totalScore', 'TotalTime': 'totalTimeSpent', 'CompletedRounds': 'completedRounds',
    'Status': 'status', 'CreatedAt': 'createdAt', 'Type': 'type', 'Text': 'text',
    'Options': 'options', 'CorrectAnswer': 'correctAnswer', 'Points': 'points',
    'TimeLimit': 'timeLimit', 'RoundID': 'round', 'Difficulty': 'level',
    'MinScoreRequired': 'minScore', 'Order': 'order', 'LevelID': 'levelId',
    'PlayedAt': 'playedAt', 'TimeSpent': 'timeSpent', 'Score': 'score'
  };

  const result: any = {};
  for (const key in gasData) {
    const frontendKey = mapping[key] || key.charAt(0).toLowerCase() + key.slice(1);
    let value = gasData[key];

    if (['completedRounds', 'options'].includes(frontendKey) && typeof value === 'string') {
      try { value = JSON.parse(value); } catch { value = []; }
    }
    if (['totalScore', 'totalTimeSpent', 'points', 'round', 'timeLimit', 'score', 'timeSpent'].includes(frontendKey)) {
      value = Number(value || 0);
    }
    result[frontendKey] = value;
  }
  return result;
}

async function callApi(action: string, payload: any = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Mạng có vấn đề hoặc URL không chính xác!");
    
    const result = await response.json();
    if (result.success && result.data) {
      if (action === "sync.initial") {
        return {
          success: true,
          data: {
            players: mapFromGas(result.data.players),
            levels: mapFromGas(result.data.levels),
            rounds: mapFromGas(result.data.rounds),
            questions: mapFromGas(result.data.questions)
          }
        };
      }
      return { success: true, data: mapFromGas(result.data) };
    }
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("API Error:", error);
    return { success: false, error: 'Không thể kết nối với máy chủ!' };
  }
}

export const MathApi = {
  getInitialData: () => callApi("sync.initial"),
  login: (name: string, className: string, password?: string) => callApi("player.login", { name, className, password }),
  getPlayers: () => callApi("players.list"),
  deletePlayer: (id: string) => callApi("players.delete", { id }),
  saveResult: (playerId: string, roundId: number, score: number, timeSpent: number) => callApi("results.add", { playerId, roundId, score, timeSpent }),
  getResults: () => callApi("results.list"),
  getLeaderboard: () => callApi("leaderboard"),
  getQuestions: () => callApi("questions.list"),
  upsertQuestion: (q: Question) => {
    const gasQ = {
      ID: q.id,
      RoundID: q.round,
      Type: q.type,
      Text: q.text,
      Options: JSON.stringify(q.options),
      CorrectAnswer: q.correctAnswer,
      Points: q.points,
      TimeLimit: q.timeLimit,
      Difficulty: q.level
    };
    return callApi("questions.upsert", gasQ);
  },
  deleteQuestion: (id: string) => callApi("questions.delete", { id }),
  pushQuestions: (qs: Question[]) => {
    const gasQs = qs.map(q => ({
      ID: q.id,
      RoundID: q.round,
      Type: q.type,
      Text: q.text,
      Options: JSON.stringify(q.options),
      CorrectAnswer: q.correctAnswer,
      Points: q.points,
      TimeLimit: q.timeLimit,
      Difficulty: q.level
    }));
    return callApi("questions.bulkSync", gasQs);
  },
  getLevels: () => callApi("levels.list"),
  getRounds: () => callApi("rounds.list"),
};
