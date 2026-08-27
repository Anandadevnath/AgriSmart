import React, { useRef, useState } from "react";
import { usePestIdentification } from "../hooks/usePestIdentification";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "./common/Button";
import { ImagePlus, Loader2, AlertCircle, RefreshCw, ScanSearch } from "lucide-react";

const STRINGS = {
  bn: {
    upload: "ছবি আপলোড করুন",
    hint: "ক্ষতিগ্রস্ত পাতা বা পোকার ছবি আপলোড করুন",
    loading: "লোড হচ্ছে…",
    result: "ফলাফল",
    retry: "পুনরায় চেষ্টা করুন",
  },
  en: {
    upload: "Upload Image",
    hint: "Upload a photo of a damaged leaf or pest",
    loading: "Loading…",
    result: "Result",
    retry: "Try again",
  },
};

export default function PestUpload({ division = null, district = null }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { loading, result, error, identifyPest, setResult, setError } = usePestIdentification();
  const { lang } = useLanguage();
  const t = STRINGS[lang] || STRINGS.en;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    identifyPest(file, division, district);
  };

  const clearAll = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#e4eae3] p-6 md:p-8">
      <div className="text-center max-w-[520px] mx-auto">
        <Button onClick={() => fileInputRef.current?.click()} className="gap-2.5">
          <ImagePlus className="w-5 h-5" strokeWidth={2.2} />
          {t.upload}
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="mt-3 text-[13px] text-[#9aa79e]">{t.hint}</p>
      </div>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mx-auto max-w-[260px] max-h-[220px] object-contain rounded-[12px] my-5 border border-[#e4eae3]"
        />
      )}

      {loading && (
        <div className="my-4 flex items-center justify-center gap-2.5 rounded-[10px] border border-[#e4eae3] bg-[#f6f8f5] px-4 py-3 text-sm text-[#47564c]">
          <Loader2 className="w-4 h-4 text-[#7cc24a] animate-spin" />
          {t.loading}
        </div>
      )}

      {error && (
        <div className="my-4 flex items-start gap-2.5 rounded-[10px] border border-[#c75a45]/40 bg-[#c75a45]/8 px-4 py-3 text-sm text-[#c75a45]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-[12px] border border-[#e4eae3] p-5 text-left">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#e4eae3]">
            <ScanSearch className="w-4 h-4 text-[#7cc24a]" />
            <span className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#6f7d73]">
              {t.result}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-[1.85] text-[#47564c]">
            {result.answer}
          </p>
        </div>
      )}

      {(imagePreview || result) && (
        <div className="mt-6 text-center">
          <Button variant="outline" size="sm" onClick={clearAll} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t.retry}
          </Button>
        </div>
      )}
    </div>
  );
}
