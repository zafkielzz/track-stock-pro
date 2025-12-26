import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Circle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus>("idle");
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  console.log(logs);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
        toast({
          title: "Camera đã bật",
          description: "Sẵn sàng điểm danh",
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Lỗi camera",
        description:
          "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
        variant: "destructive",
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsCapturing(false);
    setStatus("idle");
  };

  // --- PHẦN ĐÃ SỬA ĐỔI: GỬI FILE ẢNH ---
  const captureAndSend = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraOn) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 1. Chuyển Canvas thành Blob (File object)
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        // 2. Tạo FormData để gửi file
        const formData = new FormData();
        // "file" chính là key mà FastAPI (UploadFile) yêu cầu
        formData.append("file", blob, "capture.jpg");

        try {
          const response = await fetch("http://127.0.0.1:8000/recognize", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          // Xử lý phản hồi từ API thực tế
          if (response.ok && data.status === "success" && data.match) {
            const log: AttendanceLog = {
              id: Date.now().toString(),
              timestamp: new Date(),
              status: "success",
              message: `Xin chào: ${data.name}`,
            };
            setLogs((prev) => [log, ...prev].slice(0, 10));
            stopCapturing();
            // Nếu muốn dừng sau khi nhận diện thành công thì gọi stopCapturing() ở đây
          } else {
            // Nếu API trả về success nhưng không match (người lạ hoặc khoảng cách xa)
            // Có thể không cần log lỗi để tránh spam, hoặc log nhẹ nhàng
            console.log("Chưa nhận diện được:", data);
          }
        } catch (error) {
          console.error("Error sending image:", error);
          setStatus("error");
          const log: AttendanceLog = {
            id: Date.now().toString(),
            timestamp: new Date(),
            status: "error",
            message: "Lỗi kết nối server",
          };
          setLogs((prev) => [log, ...prev].slice(0, 10));
          setTimeout(() => setStatus("capturing"), 500);
        }
      },
      "image/jpeg",
      0.8
    ); // Chất lượng ảnh 0.8
  }, [isCameraOn]);

  // Start auto-capturing every 2 seconds
  const startCapturing = () => {
    if (!isCameraOn) {
      toast({
        title: "Camera chưa bật",
        description: "Vui lòng bật camera trước khi điểm danh",
        variant: "destructive",
      });
      return;
    }

    setIsCapturing(true);
    setStatus("capturing");

    // Capture immediately
    captureAndSend();

    // Then capture every 2 seconds
    intervalRef.current = setInterval(captureAndSend, 2000);

    toast({
      title: "Bắt đầu điểm danh",
      description: "Đang gửi ảnh mỗi 2 giây",
    });
  };

  // Stop auto-capturing
  const stopCapturing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCapturing(false);
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getStatusBadge = () => {
    switch (status) {
      case "idle":
        return <Badge variant="secondary">Chờ</Badge>;
      case "capturing":
        return <Badge className="bg-blue-500">Đang chụp</Badge>;
      case "success":
        return <Badge className="bg-green-500">Thành công</Badge>;
      case "error":
        return <Badge variant="destructive">Lỗi</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "idle":
        return <Circle className="h-8 w-8 text-muted-foreground" />;
      case "capturing":
        return <Circle className="h-8 w-8 text-blue-500 animate-pulse" />;
      case "success":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case "error":
        return <XCircle className="h-8 w-8 text-destructive" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Attendance Check</h1>
        <p className="text-muted-foreground">Check in and out</p>
      </div>
      <main>
        <div className="flex justify-center items-center">
          <div>{getStatusBadge()}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera View */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Camera đang tắt</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    !isCameraOn ? "hidden" : ""
                  }`}
                />

                {/* Status overlay */}
                {isCameraOn && (
                  <div className="absolute top-4 right-4">
                    {getStatusIcon()}
                  </div>
                )}

                {/* Recording indicator */}
                {isCapturing && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">REC</span>
                  </div>
                )}
              </div>

              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {!isCameraOn ? (
                  <Button onClick={startCamera} size="lg">
                    <Camera className="h-5 w-5 mr-2" />
                    Bật Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="outline" size="lg">
                      <CameraOff className="h-5 w-5 mr-2" />
                      Tắt Camera
                    </Button>
                    {!isCapturing ? (
                      <Button
                        onClick={startCapturing}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Circle className="h-5 w-5 mr-2" />
                        Bắt đầu điểm danh
                      </Button>
                    ) : (
                      <Button
                        onClick={stopCapturing}
                        variant="destructive"
                        size="lg"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Dừng điểm danh
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Lịch sử</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Chưa có hoạt động nào
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border ${
                        log.status === "success"
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-destructive/10 border-destructive/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {log.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm font-medium">
                          {log.message}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.timestamp.toLocaleTimeString("vi-VN")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Hướng dẫn điểm danh
                </h3>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>1. Bấm "Bật Camera" để khởi động camera</li>
                  <li>
                    2. Đảm bảo khuôn mặt hiển thị rõ ràng trong khung hình
                  </li>
                  <li>
                    3. Bấm "Bắt đầu điểm danh" - hệ thống sẽ tự động gửi ảnh mỗi
                    2 giây
                  </li>
                  <li>4. Chờ cho đến khi nhận diện thành công</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AttendanceCheck;
