
import { Question, Round } from './types.ts';

export const INITIAL_QUESTIONS: Question[] = [
  { id: '1', type: 'multiple', text: 'Số gồm 5 nghìn, 2 trăm, 3 chục và 4 đơn vị là:', options: ['5234', '5324', '5432', '5243'], correctAnswer: 0, points: 10, timeLimit: 20, round: 1, level: 'Easy' },
  { id: '2', type: 'multiple', text: 'Kết quả của phép tính 235 + 412 là:', options: ['647', '657', '547', '648'], correctAnswer: 0, points: 10, timeLimit: 20, round: 1, level: 'Easy' },
  { id: '3', type: 'multiple', text: 'Tìm x, biết x * 5 = 45:', options: ['8', '9', '7', '6'], correctAnswer: 1, points: 10, timeLimit: 15, round: 1, level: 'Easy' },
  { id: '4', type: 'multiple', text: 'Một hình vuông có cạnh 5cm. Chu vi hình vuông đó là:', options: ['20cm', '25cm', '15cm', '10cm'], correctAnswer: 0, points: 15, timeLimit: 25, round: 1, level: 'Medium' },
  { id: '5', type: 'multiple', text: 'Số lớn nhất có 3 chữ số là:', options: ['990', '900', '999', '100'], correctAnswer: 2, points: 10, timeLimit: 15, round: 1, level: 'Easy' },
  { id: '6', type: 'multiple', text: '1km bằng bao nhiêu mét?', options: ['10m', '100m', '1000m', '10000m'], correctAnswer: 2, points: 10, timeLimit: 15, round: 2, level: 'Easy' },
  { id: '7', type: 'multiple', text: 'Kết quả của phép chia 56 : 7 là:', options: ['7', '8', '9', '6'], correctAnswer: 1, points: 10, timeLimit: 15, round: 2, level: 'Easy' },
  { id: '8', type: 'multiple', text: 'Một hình chữ nhật có chiều dài 8cm, chiều rộng 5cm. Diện tích là:', options: ['13cm²', '26cm²', '40cm²', '35cm²'], correctAnswer: 2, points: 15, timeLimit: 30, round: 2, level: 'Medium' },
  { id: '9', type: 'multiple', text: 'Giá trị của biểu thức 100 - 20 * 3 là:', options: ['240', '40', '80', '60'], correctAnswer: 1, points: 20, timeLimit: 30, round: 2, level: 'Hard' },
  { id: '10', type: 'multiple', text: 'Số 405 đọc là:', options: ['Bốn mươi lăm', 'Bốn trăm linh năm', 'Bốn trăm năm', 'Bốn không năm'], correctAnswer: 1, points: 10, timeLimit: 15, round: 2, level: 'Easy' },
  { id: '11', type: 'multiple', text: 'Trong phép chia 35 : 5, số chia là:', options: ['35', '5', '7', 'Không có'], correctAnswer: 1, points: 10, timeLimit: 15, round: 3, level: 'Easy' },
  { id: '12', type: 'multiple', text: 'Số liền sau của 999 là:', options: ['998', '1000', '1001', '990'], correctAnswer: 1, points: 10, timeLimit: 10, round: 3, level: 'Easy' },
  { id: '13', type: 'multiple', text: 'Mẹ mua 4 túi táo, mỗi túi có 6 quả. Hỏi mẹ mua tất cả bao nhiêu quả táo?', options: ['10 quả', '24 quả', '20 quả', '28 quả'], correctAnswer: 1, points: 15, timeLimit: 20, round: 3, level: 'Medium' },
  { id: '14', type: 'multiple', text: 'Đồng hồ chỉ 3 giờ 15 phút. Kim phút chỉ vào số mấy?', options: ['3', '6', '9', '1'], correctAnswer: 0, points: 15, timeLimit: 20, round: 3, level: 'Medium' },
  { id: '15', type: 'multiple', text: 'Số nào chia hết cho 2?', options: ['13', '25', '48', '77'], correctAnswer: 2, points: 10, timeLimit: 15, round: 3, level: 'Easy' },
  { id: '16', type: 'multiple', text: 'Một ngày có bao nhiêu giờ?', options: ['12 giờ', '24 giờ', '60 giờ', '48 giờ'], correctAnswer: 1, points: 10, timeLimit: 10, round: 4, level: 'Easy' },
  { id: '17', type: 'multiple', text: 'Tháng nào thường có 28 hoặc 29 ngày?', options: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 12'], correctAnswer: 1, points: 10, timeLimit: 15, round: 4, level: 'Easy' },
  { id: '18', type: 'multiple', text: 'Chu vi tam giác có 3 cạnh đều bằng 6cm là:', options: ['12cm', '18cm', '24cm', '6cm'], correctAnswer: 1, points: 15, timeLimit: 20, round: 4, level: 'Medium' },
  { id: '19', type: 'multiple', text: 'Kết quả của 700 + 300 - 500 là:', options: ['500', '1000', '1500', '400'], correctAnswer: 0, points: 15, timeLimit: 25, round: 4, level: 'Medium' },
  { id: '20', type: 'multiple', text: 'Số tròn chục lớn nhất nhỏ hơn 100 là:', options: ['99', '90', '80', '100'], correctAnswer: 1, points: 20, timeLimit: 20, round: 4, level: 'Hard' },
  { id: '21', type: 'truefalse', text: 'Phép tính 300 + 400 = 800. Đúng hay Sai?', options: ['Đúng', 'Sai'], correctAnswer: 1, points: 10, timeLimit: 15, round: 1, level: 'Easy' },
  { id: '22', type: 'short', text: 'Số lớn nhất có hai chữ số là số nào?', options: [], correctAnswer: '99', points: 15, timeLimit: 20, round: 2, level: 'Medium' },
  { id: '23', type: 'truefalse', text: 'Hình vuông có 4 cạnh dài bằng nhau. Đúng hay Sai?', options: ['Đúng', 'Sai'], correctAnswer: 0, points: 10, timeLimit: 15, round: 1, level: 'Easy' },
  { id: '24', type: 'short', text: 'Một năm có bao nhiêu tháng?', options: [], correctAnswer: '12', points: 10, timeLimit: 15, round: 3, level: 'Medium' },
  { id: '25', type: 'fill', text: 'Hoàn thành phép tính: 8 x ... = 64', options: ['6', '7', '8', '9'], correctAnswer: 2, points: 20, timeLimit: 20, round: 4, level: 'Hard' }
];

export const ROUNDS: Round[] = [
  { id: 1, name: 'Vòng 1: Khởi Động', description: 'Ôn tập phép cộng trừ và số hàng nghìn', minLevel: 1 },
  { id: 2, name: 'Vòng 2: Vượt Chướng Ngại Vật', description: 'Phép nhân chia và đơn vị đo lường', minLevel: 2 },
  { id: 3, name: 'Vòng 3: Tăng Tốc', description: 'Diện tích, chu vi và bài toán có lời văn', minLevel: 3 },
  { id: 4, name: 'Vòng 4: Về Đích', description: 'Tổng hợp kiến thức và tư duy logic', minLevel: 4 },
];
