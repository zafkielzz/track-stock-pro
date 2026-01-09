import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CameraOff,
  Circle,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react"; // Thêm icon Eye
import { useToast } from "@/hooks/use-toast";

// IMPORT THƯ VIỆN MEDIAPIPE
import { FaceMesh, Results } from "@mediapipe/face_mesh";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";
// IMPORT HÀM TÍNH TOÁN EAR (Từ file bạn vừa tạo)
import { calculateEAR } from "../utils/blinkDetection";

type AttendanceStatus =
  | "idle"
  | "capturing"
  | "processing"
  | "success"
  | "error";

interface AttendanceLog {
  id: string;
  timestamp: Date;
  status: "success" | "error";
  message: string;
}

const AttendanceCheck = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Ref để lưu trạng thái nhắm mắt (tránh re-render liên tục)
  const isEyeClosedRef = useRef(false);
  // Ref để giữ camera instance
  const cameraRef = useRef<MediaPipeCamera | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus>("idle");
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [message, setMessage] = useState("Vui lòng bật camera"); // Thông báo hướng dẫn

  // --- HÀM GỬI ẢNH (Logic cũ của bạn) ---
  const captureAndSend = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Đang xử lý thì không chụp tiếp
    setStatus("processing");
    setMessage("Đang nhận diện...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("file", blob, "blink_capture.jpg");

        try {
          const response = await fetch("http://127.0.0.1:8000/recognize", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          if (response.ok && data.status === "success" && data.match) {
            const log: AttendanceLog = {
              id: Date.now().toString(),
              timestamp: new Date(),
              status: "success",
              message: `Xin chào: ${data.name}`,
            };
            setLogs((prev) => [log, ...prev].slice(0, 10));
            setStatus("success");
            setMessage(`Chào mừng ${data.name}!`);

            // Dừng 3 giây rồi cho phép điểm danh tiếp (nếu muốn)
            setTimeout(() => {
              setStatus("idle");
              setMessage("Vui lòng chớp mắt để điểm danh tiếp");
            }, 3000);
          } else {
            // Không nhận ra người hoặc người lạ
            setMessage("Không nhận diện được khuôn mặt");
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
          }
        } catch (error) {
          console.error(error);
          setStatus("error");
          setMessage("Lỗi kết nối server");
        }
      },
      "image/jpeg",
      0.8
    );
  }, []);

  // --- HÀM XỬ LÝ KẾT QUẢ TỪ MEDIAPIPE (TRÁI TIM CỦA LOGIC) ---
  const onResults = useCallback(
    (results: Results) => {
      // Nếu đang xử lý (gửi API) hoặc đã thành công thì không check chớp mắt nữa
      if (status === "processing" || status === "success") return;

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0]; // Lấy mặt đầu tiên

        // 1. Tính EAR
        // Lưu ý: Ép kiểu any vì landmarks của MediaPipe trả về object hơi khác interface của ta chút
        const ear = calculateEAR(landmarks as any);

        // Ngưỡng chớp mắt (0.25 là mức trung bình tốt)
        const BLINK_THRESHOLD = 0.25;

        // 2. Logic phát hiện chớp mắt
        if (ear < BLINK_THRESHOLD) {
          // Đang nhắm mắt
          if (!isEyeClosedRef.current) {
            isEyeClosedRef.current = true;
            setMessage("...Giữ yên...");
          }
        } else {
          // Đang mở mắt
          if (isEyeClosedRef.current) {
            // Vừa mở mắt sau khi nhắm -> CHỚP MẮT THÀNH CÔNG
            console.log("Blink Detected! EAR:", ear);
            isEyeClosedRef.current = false;

            // Gọi hàm chụp ảnh
            captureAndSend();
          } else {
            // Trạng thái bình thường
            if (status === "idle") setMessage("Hãy chớp mắt để xác thực");
          }
        }
      } else {
        if (status === "idle") setMessage("Không tìm thấy khuôn mặt");
      }
    },
    [status, captureAndSend]
  );

  // --- KHỞI TẠO MEDIAPIPE KHI BẬT CAMERA ---
  useEffect(() => {
    let faceMesh: FaceMesh | null = null;
    let camera: MediaPipeCamera | null = null;
    let isUnmounted = false; // Cờ quan trọng để chặn race condition

    const initMediaPipe = async () => {
      if (isCameraOn && videoRef.current) {
        // 1. Khởi tạo FaceMesh
        faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);

        // 2. Khởi tạo Camera
        if (videoRef.current) {
          camera = new MediaPipeCamera(videoRef.current, {
            onFrame: async () => {
              // Chỉ gửi ảnh nếu component chưa bị hủy và faceMesh chưa bị đóng
              if (!isUnmounted && faceMesh && videoRef.current) {
                try {
                  await faceMesh.send({ image: videoRef.current });
                } catch (err) {
                  // Bỏ qua lỗi nếu đang tắt camera
                }
              }
            },
            width: 640,
            height: 480,
          });

          await camera.start();
          cameraRef.current = camera;
        }
      }
    };

    initMediaPipe();

    // Cleanup function: Chạy khi tắt camera hoặc component unmount
    return () => {
      isUnmounted = true; // 1. Báo hiệu dừng ngay lập tức

      // 2. Dừng Camera TRƯỚC (để nó không bắn onFrame nữa)
      if (camera) {
        camera.stop();
        cameraRef.current = null;
      }

      // 3. Sau đó mới đóng FaceMesh
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [isCameraOn, onResults]);

  // Các hàm Start/Stop Camera cơ bản
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      // 1. Lưu stream vào biến quản lý riêng (Quan trọng!)
      streamRef.current = stream;

      // 2. Gán vào video để hiển thị
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraOn(true);
      setStatus("idle");
    } catch (e) {
      toast({ title: "Lỗi Camera", variant: "destructive" });
    }
  };

  // Sửa lại hàm stopCamera này
  const stopCamera = () => {
    // 1. Tắt MediaPipe Camera Utils (Quan trọng: Phải dừng thằng này trước)
    if (cameraRef.current) {
      cameraRef.current.stop(); // Lệnh này ngừng việc gửi ảnh vào AI
      cameraRef.current = null;
    }

    // 2. Tắt luồng phần cứng từ streamRef (Chắc chắn tắt được đèn)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop(); // Rút phích cắm
        track.enabled = false;
      });
      streamRef.current = null; // Xóa tham chiếu
    }

    // 3. Xóa trên thẻ video (để màn hình đen lại)
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOn(false);
    setStatus("idle");
    setMessage("Camera đã tắt");
  };

  // --- RENDER GIAO DIỆN ---
  // (Giữ nguyên phần UI của bạn, chỉ thêm hiển thị message)
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Smart Attendance (Liveness Check)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Camera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Camera tắt
                </div>
              )}

              {/* Video Element */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${
                  !isCameraOn ? "hidden" : ""
                }`}
                autoPlay
                playsInline
                muted
              />

              {/* Status Message Overlay */}
              {isCameraOn && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span
                    className={`px-4 py-2 rounded-full text-white font-bold ${
                      status === "success"
                        ? "bg-green-500"
                        : status === "processing"
                        ? "bg-blue-500"
                        : status === "error"
                        ? "bg-red-500"
                        : "bg-black/50"
                    }`}
                  >
                    {message}
                  </span>
                </div>
              )}
            </div>

            {/* Canvas ẩn để chụp ảnh */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-4 mt-4 justify-center">
              {!isCameraOn ? (
                <Button onClick={startCamera}>
                  <Camera className="mr-2 h-4 w-4" /> Bật Camera
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopCamera}>
                  <CameraOff className="mr-2 h-4 w-4" /> Tắt Camera
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nhật ký</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 border rounded flex items-center gap-2"
                >
                  {log.status === "success" ? (
                    <CheckCircle2 className="text-green-500 h-4 w-4" />
                  ) : (
                    <XCircle className="text-red-500 h-4 w-4" />
                  )}
                  <span className="text-sm">{log.message}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceCheck;
