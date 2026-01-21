
/**
 * MATHMASTER CLOUD BACKEND - VERSION 6.0
 * Chuyên dụng cho Web Game Giáo dục
 */

const DB_CONFIG = {
  "Players": ["ID", "Name", "ClassName", "Password", "TotalScore", "TotalTime", "CompletedRounds", "Status", "CreatedAt"],
  "Levels": ["ID", "Name", "MinScoreRequired", "Description"],
  "Rounds": ["ID", "LevelID", "Name", "Description", "Order"],
  "Questions": ["ID", "RoundID", "Type", "Text", "Options", "CorrectAnswer", "Points", "TimeLimit", "Difficulty"],
  "Results": ["ResultID", "PlayerID", "RoundID", "Score", "TimeSpent", "PlayedAt"]
};

/**
 * KHỞI TẠO HỆ THỐNG
 * Chạy hàm này một lần duy nhất khi bắt đầu.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  for (let sheetName in DB_CONFIG) {
    let sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(DB_CONFIG[sheetName]);
      // Định dạng Header
      const headerRange = sheet.getRange(1, 1, 1, DB_CONFIG[sheetName].length);
      headerRange.setFontWeight("bold")
                 .setBackground("#3730a3") // Indigo 800
                 .setFontColor("white")
                 .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
  }
  
  // Nạp dữ liệu mẫu nếu bảng Levels trống
  const levelSheet = ss.getSheetByName("Levels");
  if (levelSheet.getLastRow() === 1) {
    levelSheet.appendRow(["LV1", "Cấp độ 1: Tập sự", "0", "Các phép tính cơ bản trong phạm vi 100"]);
    levelSheet.appendRow(["LV2", "Cấp độ 2: Chiến binh", "100", "Phép nhân chia và đo lường"]);
  }

  return "Hệ thống đã sẵn sàng!";
}

/**
 * XỬ LÝ YÊU CẦU POST (API ENDPOINT)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); // Đợi tối đa 15s nếu có request khác đang ghi
    
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const payload = request.payload;
    let resultData;

    switch (action) {
      // AUTH & PLAYER
      case "player.login": resultData = handlePlayerLogin(payload); break;
      case "players.list": resultData = readTable("Players"); break;
      case "players.upsert": resultData = upsertRow("Players", payload, "ID"); break;
      case "players.delete": resultData = deleteRow("Players", payload.id, "ID"); break;

      // LEVELS
      case "levels.list": resultData = readTable("Levels"); break;
      case "levels.upsert": resultData = upsertRow("Levels", payload, "ID"); break;
      case "levels.delete": resultData = deleteRow("Levels", payload.id, "ID"); break;

      // ROUNDS
      case "rounds.list": resultData = readTable("Rounds"); break;
      case "rounds.upsert": resultData = upsertRow("Rounds", payload, "ID"); break;
      case "rounds.delete": resultData = deleteRow("Rounds", payload.id, "ID"); break;

      // QUESTIONS
      case "questions.list": resultData = readTable("Questions"); break;
      case "questions.upsert": resultData = upsertRow("Questions", payload, "ID"); break;
      case "questions.delete": resultData = deleteRow("Questions", payload.id, "ID"); break;
      case "questions.bulkSync": resultData = bulkSyncQuestions(payload); break;

      // RESULTS & LEADERBOARD
      case "results.add": resultData = saveGameResult(payload); break;
      case "results.list": resultData = readTable("Results"); break;
      case "leaderboard": resultData = getLeaderboard(); break;

      // INITIAL SYNC
      case "sync.initial": resultData = {
        players: readTable("Players"),
        levels: readTable("Levels"),
        rounds: readTable("Rounds"),
        questions: readTable("Questions")
      }; break;

      default: throw new Error("Hành động '" + action + "' không được hỗ trợ.");
    }

    return respondJson(true, resultData);

  } catch (err) {
    return respondJson(false, null, err.message);
  } finally {
    lock.releaseLock();
  }
}

/**
 * LOGIC CHI TIẾT
 */

function handlePlayerLogin(payload) {
  const players = readTable("Players");
  const name = payload.name.trim().toLowerCase();
  const className = payload.className.trim().toLowerCase();
  
  let p = players.find(x => x.Name.toLowerCase() === name && x.ClassName.toLowerCase() === className);
  
  if (p) {
    if (p.Password && p.Password.toString() !== payload.password.toString()) {
      throw new Error("Mật khẩu không chính xác!");
    }
    return p;
  }
  
  // Tạo người chơi mới nếu chưa tồn tại
  const newPlayer = {
    ID: "PL-" + Utilities.getUuid().split('-')[0].toUpperCase(),
    Name: payload.name,
    ClassName: payload.className.toUpperCase(),
    Password: payload.password || "123456",
    TotalScore: 0,
    TotalTime: 0,
    CompletedRounds: "[]",
    Status: "active",
    CreatedAt: new Date().toISOString()
  };
  
  upsertRow("Players", newPlayer, "ID");
  return newPlayer;
}

function saveGameResult(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Lưu vào GameLogs (Results)
  const resultObj = {
    ResultID: "RES-" + Date.now(),
    PlayerID: payload.playerId,
    RoundID: payload.roundId,
    Score: payload.score,
    TimeSpent: payload.timeSpent,
    PlayedAt: new Date().toISOString()
  };
  upsertRow("Results", resultObj, "ResultID");

  // 2. Cập nhật hồ sơ Players
  const pSheet = ss.getSheetByName("Players");
  const data = pSheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf("ID");
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === payload.playerId) { rowIndex = i + 1; break; }
  }

  if (rowIndex > -1) {
    const scoreIdx = headers.indexOf("TotalScore");
    const timeIdx = headers.indexOf("TotalTime");
    const roundsIdx = headers.indexOf("CompletedRounds");
    
    let currentScore = Number(data[rowIndex-1][scoreIdx] || 0);
    let currentTime = Number(data[rowIndex-1][timeIdx] || 0);
    let completed = JSON.parse(data[rowIndex-1][roundsIdx] || "[]");
    
    if (!completed.includes(payload.roundId)) completed.push(payload.roundId);
    
    pSheet.getRange(rowIndex, scoreIdx + 1).setValue(currentScore + Number(payload.score));
    pSheet.getRange(rowIndex, timeIdx + 1).setValue(currentTime + Number(payload.timeSpent));
    pSheet.getRange(rowIndex, roundsIdx + 1).setValue(JSON.stringify(completed));
  }
  
  return { status: "success", score: payload.score };
}

function getLeaderboard() {
  const players = readTable("Players");
  return players
    .filter(p => p.Status === "active")
    .sort((a, b) => {
      if (b.TotalScore !== a.TotalScore) return b.TotalScore - a.TotalScore;
      return a.TotalTime - b.TotalTime; // Ưu tiên người dùng ít thời gian hơn
    })
    .slice(0, 20); // Top 20
}

/**
 * TIỆN ÍCH CƠ SỞ DỮ LIỆU (DATABASE UTILS)
 */

function readTable(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function upsertRow(sheetName, obj, idKey) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf(idKey);
  
  let rowIndex = -1;
  if (idIdx > -1) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIdx].toString() === obj[idKey].toString()) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  const rowData = headers.map(h => {
    let val = obj[h];
    if (val === undefined) return "";
    return (Array.isArray(val) || typeof val === 'object') ? JSON.stringify(val) : val;
  });

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return obj;
}

function deleteRow(sheetName, idValue, idKey) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf(idKey);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx].toString() === idValue.toString()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function bulkSyncQuestions(qs) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Questions");
  // Xóa cũ (giữ header)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  qs.forEach(q => upsertRow("Questions", q, "ID"));
  return { count: qs.length };
}

function respondJson(success, data, error = null) {
  const response = { success, data, error };
  return ContentService.createTextOutput(JSON.stringify(response))
                       .setMimeType(ContentService.MimeType.JSON);
}
