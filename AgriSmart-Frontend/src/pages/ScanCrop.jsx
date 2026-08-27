import React, { useEffect, useRef, useState } from "react";
import PestUpload from "../components/PestUpload";
import { motion } from "framer-motion";
import { Button } from "../components/common/Button";
import { useLanguage } from "../context/LanguageContext";
import {
  Camera,
  ImagePlus,
  Loader2,
  AlertCircle,
  Trash2,
  Sun,
  Scan,
  Bug,
  CheckCircle2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45 } },
};

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const STRINGS = {
  bn: {
    kicker: "ফসল স্বাস্থ্য পরীক্ষক",
    title: "ফসলের রোগ পরীক্ষক",
    subtitle: "পাতার ছবি তুলুন বা আপলোড করুন, এআই রোগ শনাক্ত করুক।",
    useCamera: "ক্যামেরা ব্যবহার করুন",
    upload: "ছবি আপলোড করুন",
    captureLabel: "ছবি তুলুন",
    resultLabel: "ফলাফল",
    cameraHint: "ভালো আলোতে একটি পাতার উপর ক্যামেরা ঠিকভাবে ধরুন।",
    captureCheck: "ছবি তুলুন ও পরীক্ষা করুন",
    uploadHint1: "গ্যালারি থেকে একটি পরিষ্কার পাতা নির্বাচন করুন।",
    uploadHint2: "পাতাটি যেন ছবিতে পরিষ্কার দেখা যায়।",
    noImage: "এখনও কোনো ছবি নেই। আপলোড করুন বা ক্যামেরা ব্যবহার করুন।",
    checking: "পাতা পরীক্ষা করা হচ্ছে…",
    noPrediction: "কোনো ফলাফল পাওয়া যায়নি।",
    clear: "সব মুছুন",
    tip: "দিনের আলোতে ছবি তুলুন, ক্যামেরা স্থির রাখুন।",
    healthy: "সুস্থ",
    diseased: "রোগাক্রান্ত",
    healthyExtra: "পাতাটি দেখতে সুস্থ মনে হচ্ছে।",
    diseasedExtra: "পাতাটি অসুস্থ হতে পারে, গাছটি ভালোভাবে পরীক্ষা করুন।",
    confidence: "আত্মবিশ্বাস",
    pestKicker: "পোকা শনাক্তকরণ",
    pestTitle: "পোকা / ক্ষতি চিহ্নিতকরণ",
    pestDesc: "ছবি আপলোড করুন, এআই পোকা বা ক্ষতির ধরন শনাক্ত করুক।",
  },
  en: {
    kicker: "Crop Health Scanner",
    title: "Crop Disease Checker",
    subtitle: "Take or upload a leaf photo and let AI detect diseases instantly.",
    useCamera: "Use Camera",
    upload: "Upload Image",
    captureLabel: "Capture",
    resultLabel: "Result",
    cameraHint: "Hold steady & focus on a leaf in good lighting.",
    captureCheck: "Capture & Check",
    uploadHint1: "Upload a clear photo of a leaf.",
    uploadHint2: "Make sure the leaf is visible & centered.",
    noImage: "No image yet. Use camera or upload.",
    checking: "Checking leaf…",
    noPrediction: "No prediction received.",
    clear: "Clear all",
    tip: "Use daylight, keep the camera steady.",
    healthy: "Healthy",
    diseased: "Diseased",
    healthyExtra: "This leaf looks healthy.",
    diseasedExtra: "This leaf might be diseased.",
    confidence: "Confidence",
    pestKicker: "Pest Identification",
    pestTitle: "Identify pests & damage",
    pestDesc: "Upload a photo and let AI identify the pest or type of damage.",
  },
};

export default function ScanCrop() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const { lang } = useLanguage();
  const t = STRINGS[lang] || STRINGS.en;

  const [mode, setMode] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode !== "camera") stopCamera();
  }, [mode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraActive(true);
    } catch (e) {
      alert("Camera permission required.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      uploadAndPredict(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const capture = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 224, 224);
    const data = canvas.toDataURL("image/jpeg");
    setImagePreview(data);
    uploadAndPredict(data);
  };

  const uploadAndPredict = async (base64) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      setPrediction(data[0]);
    } catch (e) {
      setError("Prediction failed");
    }
    setLoading(false);
  };

  const isHealthy =
    prediction &&
    (prediction.label.toLowerCase().includes("healthy") ||
      prediction.label.toLowerCase().includes("fresh"));

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fade}
      className="min-h-screen bg-[#f6f8f5] pt-[72px]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* HEADER — editorial kicker + title */}
        <motion.header variants={rise} className="max-w-[720px] mb-10">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] bg-white border border-[#0b3b2a]/10 rounded-[10px] px-3.5 py-2">
            <Scan className="w-4 h-4 text-[#7cc24a]" />
            {t.kicker}
          </span>
          <h1 className="mt-5 font-display font-extrabold text-[#0b3b2a] text-3xl sm:text-4xl md:text-[40px] leading-[1.12] tracking-[-0.02em]">
            {t.title}
          </h1>
          <p className="mt-3 text-[#47564c] text-base md:text-lg leading-[1.85] max-w-[56ch]">
            {t.subtitle}
          </p>
        </motion.header>

        {/* ACTION ROW — camera (primary) / upload (outline) */}
        <motion.div variants={rise} className="flex flex-wrap items-center gap-4 mb-10">
          <Button
            onClick={() => {
              setMode("camera");
              startCamera();
            }}
            className="gap-2.5"
          >
            <Camera className="w-5 h-5" strokeWidth={2.2} />
            {t.useCamera}
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current.click()}
            className="gap-2.5"
          >
            <ImagePlus className="w-5 h-5" strokeWidth={2.2} />
            {t.upload}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </motion.div>

        {/* WORKSPACE — two hairline-bordered ledger surfaces */}
        <motion.div variants={rise} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT — capture surface */}
          <div className="bg-white rounded-[16px] border border-[#e4eae3] p-6">
            <div className="flex items-center gap-2 pb-5 mb-5 border-b border-[#e4eae3]">
              <Camera className="w-4 h-4 text-[#7cc24a]" />
              <span className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#6f7d73]">
                {t.captureLabel}
              </span>
            </div>

            {mode === "camera" ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full aspect-[4/3] object-cover rounded-[12px] bg-black mb-4"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-[#6f7d73] leading-relaxed">{t.cameraHint}</p>
                  <Button size="sm" onClick={capture} className="gap-2 shrink-0">
                    <Camera className="w-4 h-4" strokeWidth={2.4} />
                    {t.captureCheck}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-14 px-4 rounded-[12px] border border-dashed border-[#0b3b2a]/15 bg-[#f6f8f5]">
                <div className="w-11 h-11 rounded-[12px] bg-[#0b3b2a]/5 text-[#0b3b2a]/70 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-[#47564c] text-sm leading-relaxed">{t.uploadHint1}</p>
              </div>
            )}
          </div>

          {/* RIGHT — preview & result surface */}
          <div className="bg-white rounded-[16px] border border-[#e4eae3] p-6">
            <div className="flex items-center gap-2 pb-5 mb-5 border-b border-[#e4eae3]">
              <Scan className="w-4 h-4 text-[#7cc24a]" />
              <span className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#6f7d73]">
                {t.resultLabel}
              </span>
            </div>

            {/* preview drop zone */}
            <div className="border-2 border-dashed border-[#0b3b2a]/15 bg-[#f6f8f5] h-52 rounded-[12px] flex items-center justify-center overflow-hidden mb-6">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={t.title}
                  className="max-h-full max-w-full object-contain rounded-[10px]"
                />
              ) : (
                <div className="text-center px-6">
                  <ImagePlus className="w-7 h-7 text-[#9aa79e] mx-auto mb-3" />
                  <span className="text-[#9aa79e] text-sm">{t.noImage}</span>
                </div>
              )}
            </div>

            {/* loading */}
            {loading && (
              <div className="flex items-center gap-2.5 rounded-[10px] border border-[#e4eae3] bg-[#f6f8f5] px-4 py-3 text-sm text-[#47564c]">
                <Loader2 className="w-4 h-4 text-[#7cc24a] animate-spin shrink-0" />
                {t.checking}
              </div>
            )}

            {/* prediction */}
            {prediction && !loading && (
              <div
                className={`rounded-[12px] border p-4 ${
                  isHealthy
                    ? "border-[#7cc24a]/50 bg-[#7cc24a]/8"
                    : "border-[#c75a45]/50 bg-[#c75a45]/8"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isHealthy ? (
                    <CheckCircle2 className="w-4 h-4 text-[#7cc24a]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#c75a45]" />
                  )}
                  <span
                    className={`text-[12px] font-bold tracking-[0.08em] uppercase ${
                      isHealthy ? "text-[#0b3b2a]" : "text-[#c75a45]"
                    }`}
                  >
                    {isHealthy ? t.healthy : t.diseased}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-display font-extrabold text-xl tracking-tight text-[#0b3b2a]">
                    {prediction.label}
                  </div>
                  <div className="text-sm text-[#47564c]">
                    {t.confidence}:{" "}
                    <span className="font-bold text-[#0b3b2a] tabular">
                      {(prediction.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-[#47564c] leading-relaxed">
                  {isHealthy ? t.healthyExtra : t.diseasedExtra}
                </p>
              </div>
            )}

            {/* error */}
            {error && !loading && (
              <div className="flex items-center gap-2.5 rounded-[10px] border border-[#c75a45]/40 bg-[#c75a45]/8 px-4 py-3 text-sm text-[#c75a45]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* footer — clear + tip */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImagePreview(null);
                  setPrediction(null);
                  setError(null);
                }}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t.clear}
              </Button>
              <span className="flex items-center gap-1.5 text-xs text-[#9aa79e]">
                <Sun className="w-3.5 h-3.5" />
                {t.tip}
              </span>
            </div>
          </div>
        </motion.div>

        {/* PEST IDENTIFICATION — ledger-ruled section */}
        <div className="mt-14 pt-10 border-t border-[#e4eae3]">
          <div className="max-w-[720px] mb-8">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#0b3b2a] bg-white border border-[#0b3b2a]/10 rounded-[10px] px-3.5 py-2">
              <Bug className="w-4 h-4 text-[#7cc24a]" />
              {t.pestKicker}
            </span>
            <h2 className="mt-4 font-display font-extrabold text-[#0b3b2a] text-2xl tracking-[-0.02em]">
              {t.pestTitle}
            </h2>
            <p className="mt-2 text-[#6f7d73] text-[15px] leading-[1.8]">{t.pestDesc}</p>
          </div>
          <PestUpload />
        </div>
      </div>
      <canvas ref={canvasRef} width={224} height={224} className="hidden"></canvas>
    </motion.div>
  );
}
