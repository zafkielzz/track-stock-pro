// Định nghĩa kiểu dữ liệu cho điểm landmark từ MediaPipe
interface Landmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Tính khoảng cách Euclidean giữa 2 điểm
 */
const getEuclideanDistance = (p1: Landmark, p2: Landmark): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

/**
 * Tính chỉ số EAR (Eye Aspect Ratio)
 * Công thức: (Khoảng cách dọc 1 + Khoảng cách dọc 2) / (2 * Khoảng cách ngang)
 */
const calculateEyeEAR = (landmarks: Landmark[], indices: number[]): number => {
  // indices là mảng chứa thứ tự các điểm: [p1, p2, p3, p4, p5, p6]
  // p1, p4: Góc mắt ngang (Trái, Phải)
  // p2, p6: Cặp dọc thứ nhất
  // p3, p5: Cặp dọc thứ hai

  const p1 = landmarks[indices[0]];
  const p2 = landmarks[indices[1]];
  const p3 = landmarks[indices[2]];
  const p4 = landmarks[indices[3]];
  const p5 = landmarks[indices[4]];
  const p6 = landmarks[indices[5]];

  // Tính các khoảng cách
  const vertical1 = getEuclideanDistance(p2, p6);
  const vertical2 = getEuclideanDistance(p3, p5);
  const horizontal = getEuclideanDistance(p1, p4);

  // Tránh chia cho 0
  if (horizontal === 0) return 0;

  return (vertical1 + vertical2) / (2.0 * horizontal);
};

/**
 * HÀM CHÍNH: Tính EAR trung bình của cả 2 mắt
 * @param landmarks Mảng chứa tất cả các điểm trên mặt do MediaPipe trả về
 */
export const calculateEAR = (landmarks: Landmark[]): number => {
  if (!landmarks || landmarks.length === 0) return 0;

  // --- MAP ID CÁC ĐIỂM TRÊN MEDIAPIPE FACE MESH ---
  // Đây là các ID chuẩn của MediaPipe cho mắt

  // Mắt Trái (Left Eye)
  // Ngang: 33 (trong), 133 (ngoài)
  // Dọc: 160-144, 158-153
  const leftEyeIndices = [33, 160, 158, 133, 153, 144];

  // Mắt Phải (Right Eye)
  // Ngang: 362 (trong), 263 (ngoài)
  // Dọc: 385-380, 387-373
  const rightEyeIndices = [362, 385, 387, 263, 373, 380];

  // Tính EAR từng mắt
  const leftEAR = calculateEyeEAR(landmarks, leftEyeIndices);
  const rightEAR = calculateEyeEAR(landmarks, rightEyeIndices);

  // Trả về trung bình cộng của 2 mắt (để ổn định hơn)
  return (leftEAR + rightEAR) / 2;
};
