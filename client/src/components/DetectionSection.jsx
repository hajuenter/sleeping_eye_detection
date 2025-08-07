import React, { useRef, useEffect, useState } from "react";
import { Camera, Play, Pause, Clock, Eye, EyeOff } from "lucide-react";
import { getSessionId } from "../utils/session";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";
import axios from "axios";
import { music } from "../assets/assets";

const DetectionSection = ({
  isDetecting,
  onToggleDetection,
  onSummaryReceived,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const isAlarmingRef = useRef(false); // Use ref to avoid closure issues

  const [detectionTime, setDetectionTime] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("Not Started");
  const [closedEyeCount, setClosedEyeCount] = useState(0);
  const [openEyeCount, setOpenEyeCount] = useState(0); // Counter untuk mata terbuka
  const [isAlarming, setIsAlarming] = useState(false);
  const [summary, setSummary] = useState(null);

  // Timer untuk menghitung waktu deteksi
  useEffect(() => {
    let timer = null;
    if (isDetecting) {
      timer = setInterval(() => {
        setDetectionTime((prev) => prev + 1);
      }, 1000);
    } else {
      setDetectionTime(0);
      setClosedEyeCount(0);
      setOpenEyeCount(0);
      setCurrentStatus("Not Started");
      setIsAlarming(false);
      isAlarmingRef.current = false; // Reset ref too
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isDetecting]);

  // Inisialisasi kamera dan mulai deteksi
  useEffect(() => {
    if (isDetecting) {
      startCamera();
      startDetection();
    } else {
      stopCamera();
      stopDetection();
      if (detectionTime > 0) {
        fetchSummary();
      }
    }

    return () => {
      stopCamera();
      stopDetection();
    };
  }, [isDetecting]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startDetection = () => {
    // Kirim gambar ke backend setiap 1 detik
    intervalRef.current = setInterval(() => {
      captureAndSendImage();
    }, 1000);
  };

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopAlarm();
  };

  const captureAndSendImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("image", blob, "frame.jpg");

        try {
          const sessionId = getSessionId();
          const apiUrl = buildApiUrl(API_ENDPOINTS.DETECT, {
            session_id: sessionId,
          });

          const response = await axios.post(apiUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 10000, // 10 second timeout for detection requests
          });

          processDetectionResult(response.data);
        } catch (error) {
          console.error("Error sending image:", error);
          // Don't show error to user for individual frame failures
          // Just log and continue
        }
      },
      "image/jpeg",
      0.8
    );
  };

  const processDetectionResult = (data) => {
    const results = data.results || [];
    const hasClosedEyes = results.some((result) => result.class === "closed");

    // console.log("Detection result:", {
    //   hasClosedEyes,
    //   isAlarming: isAlarmingRef.current,
    //   closedEyeCount,
    //   openEyeCount,
    // }); // Debug log

    if (hasClosedEyes) {
      // Reset counter mata terbuka
      setOpenEyeCount(0);

      setCurrentStatus("Drowsy - Eyes Closed");
      setClosedEyeCount((prev) => {
        const newCount = prev + 1;
        // console.log("Closed eye count:", newCount); // Debug log
        // Jika mata tertutup selama 5 detik berturut-turut, trigger alarm
        if (newCount >= 5 && !isAlarmingRef.current) {
          // console.log("Starting alarm"); // Debug log
          setIsAlarming(true);
          isAlarmingRef.current = true; // Update ref

          // Play alarm sound
          if (audioRef.current) {
            audioRef.current
              .play()
              .catch((e) => console.log("Audio play failed:", e));
          }
          // Vibrate if supported
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
        }
        return newCount;
      });
    } else {
      // Reset counter mata tertutup
      setClosedEyeCount(0);

      setCurrentStatus("Alert - Eyes Open");

      // Jika sedang alarm, mulai hitung mundur untuk menghentikan alarm
      setOpenEyeCount((prev) => {
        const newCount = prev + 1;
        // console.log(
        //   "Open eye count:",
        //   newCount,
        //   "isAlarming:",
        //   isAlarmingRef.current
        // ); // Debug log

        // Jika mata terbuka selama 5 detik berturut-turut dan sedang alarm, hentikan alarm
        if (newCount >= 5 && isAlarmingRef.current) {
          // console.log("Stopping alarm after 5 seconds open"); // Debug log
          setIsAlarming(false);
          isAlarmingRef.current = false; // Update ref

          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          return 0; // Reset counter setelah alarm dihentikan
        }

        // Jika tidak sedang alarm, reset counter
        if (!isAlarmingRef.current) {
          return 0;
        }

        return newCount;
      });
    }
  };

  const startAlarm = () => {
    setIsAlarming(true);
    // Play alarm sound
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const stopAlarm = () => {
    // console.log("stopAlarm function called"); // Debug log
    setIsAlarming(false);
    isAlarmingRef.current = false; // Update ref
    setOpenEyeCount(0); // Reset counter mata terbuka
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const fetchSummary = async () => {
    try {
      const sessionId = getSessionId();
      const apiUrl = buildApiUrl(API_ENDPOINTS.SUMMARY, {
        session_id: sessionId,
      });

      const response = await axios.get(apiUrl, { timeout: 5000 });
      setSummary(response.data);
      // Send summary to parent component
      if (onSummaryReceived) {
        onSummaryReceived(response.data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    if (!isDetecting) return "text-gray-500";
    if (isAlarming) return "text-red-500 animate-pulse";
    if (currentStatus.includes("Drowsy")) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusIcon = () => {
    if (!isDetecting) return <Camera size={20} />;
    if (currentStatus.includes("Drowsy") || isAlarming)
      return <EyeOff size={20} />;
    return <Eye size={20} />;
  };

  return (
    <section id="detection" className="pb-20 pt-10 bg-white">
      {/* Hidden audio element for alarm */}
      <audio ref={audioRef} loop>
        <source src={music.alarm} type="audio/wav" />
      </audio>

      <div className="container mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Live Detection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start the drowsiness detection system and see real-time analysis of
            your alertness level.
          </p>
        </div>

        <div
          className="max-w-4xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-offset="100"
        >
          <div className="bg-gray-100 rounded-2xl p-8 shadow-xl">
            {/* Status Bar */}
            {isDetecting && (
              <div className="mb-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-blue-500" />
                    <span className="font-semibold">
                      Detection Time: {formatTime(detectionTime)}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 font-semibold ${getStatusColor()}`}
                  >
                    {getStatusIcon()}
                    <span>{currentStatus}</span>
                  </div>
                </div>

                {closedEyeCount > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <EyeOff size={16} />
                      <span className="text-sm font-medium">
                        Eyes closed for {closedEyeCount} seconds
                        {closedEyeCount >= 3 && " - Stay Alert!"}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (closedEyeCount / 5) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Progress bar untuk menghentikan alarm */}
                {isAlarming && openEyeCount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Eye size={16} />
                      <span className="text-sm font-medium">
                        Eyes open for {openEyeCount} seconds - Keep it up!
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((openEyeCount / 5) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {isAlarming && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 text-red-800 animate-pulse">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-bold">
                        ⚠️ DROWSINESS ALERT! Wake up!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Camera Feed */}
            <div className="aspect-video bg-gray-800 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
              {isDetecting ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-xl"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="text-gray-400 text-center">
                  <Camera size={48} className="mx-auto mb-4" />
                  <p className="text-lg">Camera feed will appear here</p>
                  <p className="text-sm mt-2">
                    Click "Start Detection" to begin monitoring
                  </p>
                </div>
              )}
            </div>

            {/* Control Button */}
            <div className="text-center">
              <button
                onClick={onToggleDetection}
                className="group relative bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:from-cyan-300 hover:to-teal-400 hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/25 flex items-center gap-3 mx-auto overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

                {/* Button Content */}
                <div className="relative flex items-center gap-3">
                  {isDetecting ? (
                    <Pause
                      size={24}
                      className="group-hover:rotate-12 transition-transform duration-300"
                    />
                  ) : (
                    <Play
                      size={24}
                      className="group-hover:rotate-12 transition-transform duration-300"
                    />
                  )}
                  {isDetecting ? "Stop Detection" : "Start Detection"}
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </button>
            </div>
          </div>

          {/* Summary Section */}
          {summary && !isDetecting && (
            <div
              className="mt-8 bg-white rounded-2xl p-8 shadow-xl"
              data-aos="fade-up"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Detection Summary
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Session Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Frames:</span>
                      <span className="font-bold">{summary.total_frames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eyes Open:</span>
                      <span className="font-bold text-green-600">
                        {summary.opened}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eyes Closed:</span>
                      <span className="font-bold text-red-600">
                        {summary.closed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Analysis Result
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Alert Percentage:</span>
                      <span className="font-bold text-green-600">
                        {summary.percentage_opened}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drowsy Percentage:</span>
                      <span className="font-bold text-red-600">
                        {summary.percentage_closed}%
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <div className="text-center">
                        <span className="text-lg font-bold">
                          {summary.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;
