import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import {
  MessageCircle, Send, User, ChevronLeft, Phone, Package, MapPin, Search, X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { cropLabel } from "../data/bangladesh";

const fmtTime = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const fmtDay = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    return sameDay
      ? fmtTime(iso)
      : d.toLocaleDateString([], { day: "numeric", month: "short" });
  } catch {
    return "";
  }
};

function ConversationRow({ convo, active, onClick, isBn }) {
  const other = convo.other || {};
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${active ? "bg-[#eaf7ef]" : "hover:bg-green-50/70"}`}
    >
      <span className="w-11 h-11 rounded-full bg-[#0b6b3a]/10 flex items-center justify-center text-[#0b6b3a] shrink-0">
        {other.avatar ? <img src={other.avatar} alt="" className="w-11 h-11 rounded-full object-cover" /> : <User size={20} />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center justify-between gap-2">
          <span className="font-bold text-green-950 text-[14px] truncate">{other.name || (isBn ? "ক্রেতা" : "Buyer")}</span>
          <span className="text-[11px] text-green-500 shrink-0">{fmtDay(convo.lastMessageAt)}</span>
        </span>
        <span className="flex items-center gap-2 text-[12.5px] text-green-700/70 truncate">
          {convo.listing?.cropType ? (
            <>
              <span className="text-[11px] font-bold text-[#0b6b3a] bg-white rounded px-1.5 py-0.5 border border-green-100 shrink-0">
                {cropLabel(convo.listing.cropType, isBn ? "bn" : "en")}
              </span>
              <span className="shrink-0">৳{convo.listing.pricePerKg}/kg</span>
              <span className="truncate">· {convo.lastMessage || (isBn ? "নতুন কথোপকথন" : "New conversation")}</span>
            </>
          ) : (
            <span className="truncate">{convo.lastMessage || (isBn ? "নতুন কথোপকথন" : "New conversation")}</span>
          )}
        </span>
      </span>
    </button>
  );
}

export default function Chat() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const recipientParam = searchParams.get("recipient");
  const listingParam = searchParams.get("listing");
  const cropParam = searchParams.get("crop");

  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null); // conversation id
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [socketStatus, setSocketStatus] = useState("connecting"); // connecting | online | offline
  const socketRef = useRef(null);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);
  const isTypingRef = useRef(false);
  const activeRef = useRef(null); // latest active id, readable inside socket handlers

  const meId = user?._id;

  // --- load conversation list ---
  const loadConversations = useCallback(async () => {
    if (!meId) return;
    setLoadingList(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { ok, data } = await api.get("/chat/conversations", { headers: { Authorization: `Bearer ${token}` } });
      if (ok) setConversations(data?.data || []);
    } catch (e) {
      /* offline */
    } finally {
      setLoadingList(false);
    }
  }, [meId]);

  // --- socket lifecycle (connect ONCE per login, not per conversation switch) ---
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !meId) return;
    const sock = io(api.API_BASE, { auth: { token } });
    socketRef.current = sock;

    sock.on("connect", () => {
      setSocketStatus("online");
      sock.emit("conversation:join", activeRef.current);
    });
    sock.on("disconnect", () => setSocketStatus("offline"));
    sock.on("connect_error", () => setSocketStatus("offline"));

    sock.on("message:new", (msg) => {
      if (msg.conversationId === activeRef.current) {
        setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      }
      // refresh the conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversationId
            ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt }
            : c
        )
      );
    });

    // Re-fetch conversation list when backend signals an update (e.g. new message
    // from the other participant changes the sort order).
    sock.on("conversation:updated", () => {
      loadConversations();
    });

    sock.on("typing", ({ userId, isTyping }) => {
      if (userId !== meId) setTyping(isTyping);
    });

    return () => { sock.disconnect(); socketRef.current = null; setSocketStatus("connecting"); };
  }, [meId, loadConversations]);

  // Keep activeRef in sync and re-join conversation room on switch.
  useEffect(() => {
    activeRef.current = active;
    socketRef.current?.emit("conversation:join", active);
  }, [active]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // --- start a conversation from marketplace deep-link ---
  const ensureConversation = useCallback(async (recipientId, listingId) => {
    if (!meId || !recipientId) return;
    try {
      const token = localStorage.getItem("accessToken");
      const { ok, data } = await api.post(
        "/chat/conversations",
        { recipientId, listingId: listingId || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (ok && data?.data?._id) {
        setActive(data.data._id);
        // move to front of list
        setConversations((prev) => [data.data, ...prev.filter((c) => c._id !== data.data._id)]);
        setSearchParams({}, { replace: true });
      }
    } catch (e) {
      toast.error(isBn ? "কথোপকথন শুরু করা যায়নি" : "Could not start conversation");
      setSearchParams({}, { replace: true });
    }
  }, [meId, isBn, setSearchParams]);

  useEffect(() => {
    if (recipientParam) ensureConversation(recipientParam, listingParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- load messages for active conversation ---
  useEffect(() => {
    if (!active) { setMessages([]); return; }
    setLoadingMsgs(true);
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { ok, data } = await api.get(`/chat/conversations/${active}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled && ok) setMessages(data?.data || []);
      } catch (e) {
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoadingMsgs(false);
      }
    })();
    return () => { cancelled = true; };
  }, [active]);

  // --- near-real-time fallback when the socket is not available (Vercel
  // serverless has no WebSocket, so socketStatus stays "offline"). Poll the open
  // conversation so the other participant's messages still appear — no manual
  // refresh needed. Merges by id so optimistic ("tmp-") messages aren't lost. ---
  useEffect(() => {
    if (!active || socketStatus === "online") return;
    const token = localStorage.getItem("accessToken");
    let cancelled = false;

    const poll = async () => {
      try {
        const { ok, data } = await api.get(`/chat/conversations/${active}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled && ok) {
          setMessages((prev) => {
            const server = data?.data || [];
            const serverIds = new Set(server.map((m) => String(m._id)));
            const pending = prev.filter((m) => String(m._id).startsWith("tmp-"));
            return [...server, ...pending.filter((m) => !serverIds.has(String(m._id)))];
          });
        }
      } catch (e) {
        /* ignore transient network failures */
      }
    };

    poll();
    const timer = setInterval(poll, 4000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [active, socketStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, active, typing]);

  // --- send ---
  const send = async () => {
    const t = text.trim();
    if (!t || !active) return;
    setText("");
    if (typingTimeout.current) { clearTimeout(typingTimeout.current); typingTimeout.current = null; }
    isTypingRef.current = false;
    socketRef.current?.emit("typing", { conversationId: active, isTyping: false });

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      conversationId: active,
      senderId: meId,
      text: t,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const removeOptimistic = () => setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    const replaceOptimistic = (data) => setMessages((prev) => prev.map((m) => (m._id === optimistic._id ? data : m)));

    // Fast path: real-time socket connected → emit with ack.
    if (socketRef.current?.connected) {
      socketRef.current.emit("message:send", { conversationId: active, text: t }, ({ ok, data, error }) => {
        if (!ok) {
          removeOptimistic();
          toast.error(error || (isBn ? "বার্তা পাঠানো যায়নি" : "Could not send message"));
        } else {
          // replace optimistic with server version
          replaceOptimistic(data);
        }
      });
      return;
    }

    // Fallback: socket offline (Vercel serverless has no WebSocket) → REST.
    try {
      const token = localStorage.getItem("accessToken");
      const { ok, data } = await api.post(`/chat/conversations/${active}/messages`, { text: t }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ok) {
        replaceOptimistic(data?.data);
      } else {
        removeOptimistic();
        toast.error(isBn ? "বার্তা পাঠানো যায়নি" : "Could not send message");
      }
    } catch (e) {
      removeOptimistic();
      toast.error(isBn ? "বার্তা পাঠানো যায়নি" : "Could not send message");
    }
  };

  const onTyping = (val) => {
    setText(val);
    const nowTyping = val.trim().length > 0;
    if (nowTyping !== isTypingRef.current && socketRef.current?.connected) {
      isTypingRef.current = nowTyping;
      socketRef.current.emit("typing", { conversationId: active, isTyping: nowTyping });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socketRef.current?.emit("typing", { conversationId: active, isTyping: false });
      }
    }, 1500);
  };

  const activeConvo = useMemo(() => conversations.find((c) => c._id === active), [conversations, active]);
  const other = activeConvo?.other || {};
  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) => (c.other?.name || "").toLowerCase().includes(q) || (c.listing?.cropType || "").toLowerCase().includes(q)
    );
  }, [conversations, search]);

  if (!meId) {
    return (
      <div className="min-h-screen bg-[#f2faf5] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0b6b3a]/10 flex items-center justify-center mb-5">
            <MessageCircle className="text-[#0b6b3a]" size={40} />
          </div>
          <h1 className="text-2xl font-extrabold text-green-950 mb-2">{isBn ? "লগইন করুন" : "Please login"}</h1>
          <p className="text-green-700/70 text-sm mb-6">
            {isBn ? "ক্রেতার সঙ্গে সরাসরি চ্যাট করতে লগইন করুন।" : "Login to chat directly with buyers and farmers."}
          </p>
          <a href="/login" className="inline-flex items-center gap-2 bg-[#0b6b3a] text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-[#085b30] transition-colors">
            {isBn ? "লগইন করুন →" : "Login →"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2faf5] px-5 py-8 mt-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-950 inline-flex items-center gap-3">
              <MessageCircle className="text-[#0b6b3a]" size={26} />
              {isBn ? "সরাসরি চ্যাট" : "Direct Chat"}
            </h1>
            <p className="text-green-700/60 text-sm mt-1">
              {isBn ? "ক্রেতা ও কৃষক — দরদাম ও চুক্তি সরাসরি করুন।" : "Buyers and farmers — negotiate and close deals directly."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-5">
          {/* Conversation list */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[420px]">
            <div className="p-4 border-b border-green-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isBn ? "চ্যাট খুঁজুন…" : "Search chats…"}
                  className="w-full rounded-xl border border-green-200 bg-green-50/50 pl-9 pr-3 py-2.5 text-sm text-green-950 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-[#49c74f]/40 transition"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-green-50">
              {loadingList ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-green-50 animate-pulse" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                    <MessageCircle className="text-green-300" size={26} />
                  </div>
                  <p className="text-green-700/60 text-sm">
                    {isBn ? "এখনও কোনো চ্যাট নেই। বাজারে গিয়ে ক্রেতার সঙ্গে কথা বলুন।" : "No conversations yet. Head to the marketplace and reach out to a buyer."}
                  </p>
                </div>
              ) : (
                filtered.map((c) => (
                  <ConversationRow key={c._id} convo={c} active={active === c._id} onClick={() => setActive(c._id)} isBn={isBn} />
                ))
              )}
            </div>
          </motion.div>

          {/* Chat thread */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl border border-green-100 shadow-[0_6px_24px_rgba(0,60,30,0.07)] overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[420px]">
            {!active ? (
              <div className="flex-1 flex items-center justify-center p-10">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0b6b3a]/8 flex items-center justify-center mb-4">
                    <MessageCircle className="text-[#0b6b3a]/50" size={40} />
                  </div>
                  <h3 className="font-extrabold text-green-950 text-lg mb-2">
                    {isBn ? "একটি কথোপকথন নির্বাচন করুন" : "Select a conversation"}
                  </h3>
                  <p className="text-green-700/60 text-sm">
                    {isBn ? "বাম পাশের তালিকা থেকে চ্যাট বেছে নিন, অথবা বাজারে গিয়ে কোনো ফসলের ওপর চ্যাট বাটনে ক্লিক করুন।" : "Pick a chat from the list, or visit the marketplace and press Chat on any listing."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-green-100 bg-green-50/40 flex items-center gap-3">
                  <button onClick={() => setActive(null)} className="md:hidden text-green-700 p-1">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="w-10 h-10 rounded-full bg-[#0b6b3a]/10 flex items-center justify-center text-[#0b6b3a] shrink-0">
                    {other.avatar ? <img src={other.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <User size={18} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-green-950 text-[15px] truncate">{other.name || (isBn ? "ক্রেতা" : "Buyer")}</div>
                    <div className="text-[12px] text-green-600 flex items-center gap-1.5">
                      <Phone size={12} /> {other.phone || (isBn ? "ফোন নম্বর নেই" : "No phone")}
                    </div>
                  </div>
                  {activeConvo?.listing && (
                    <div className="hidden sm:flex items-center gap-2 bg-white rounded-xl border border-green-100 px-3 py-2">
                      <Package size={15} className="text-[#0b6b3a]" />
                      <div className="text-[12px] leading-tight">
                        <div className="font-bold text-green-900">{cropLabel(activeConvo.listing.cropType, isBn ? "bn" : "en")}</div>
                        <div className="text-green-600">৳{activeConvo.listing.pricePerKg}/kg</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#fbfefc]">
                  {loadingMsgs ? (
                    <div className="space-y-3 pt-2">
                      {[1, 2, 3].map((i) => <div key={i} className={`h-10 rounded-2xl animate-pulse ${i % 2 ? "bg-green-100/60 w-2/3" : "bg-green-50 w-1/2 ml-auto"}`} />)}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-green-700/50 text-sm text-center">
                        {isBn ? "কথোপকথন শুরু করুন — দরদাম করুন!" : "Start the conversation — negotiate a fair deal!"}
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((m) => {
                        const mine = String(m.senderId) === String(meId);
                        return (
                          <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                                mine
                                  ? "bg-[#0b6b3a] text-white rounded-br-md"
                                  : "bg-white text-green-950 border border-green-100 rounded-bl-md"
                              }`}
                            >
                              <div className="whitespace-pre-wrap break-words">{m.text}</div>
                              <div className={`text-[10.5px] mt-1 ${mine ? "text-green-100/70" : "text-green-500"}`}>
                                {fmtTime(m.createdAt)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {typing && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-green-100 rounded-2xl rounded-bl-md px-4 py-3 inline-flex items-center gap-1">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div ref={bottomRef} />
                    </>
                  )}
                </div>

                {socketStatus === "offline" && (
                  <div className="px-5 py-2 bg-amber-50 border-t border-amber-100 text-[12px] text-amber-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {isBn ? "রিয়েল-টাইম সংযোগ নেই — বার্তা সার্ভারের মাধ্যমে যাবে।" : "Real-time unavailable — messages send via server."}
                  </div>
                )}

                {/* Composer */}
                <div className="p-4 border-t border-green-100 bg-white flex items-end gap-2">
                  <textarea
                    rows={1}
                    value={text}
                    onChange={(e) => onTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                    }}
                    placeholder={isBn ? "বার্তা লিখুন…" : "Type a message…"}
                    className="flex-1 resize-none rounded-2xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm text-green-950 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-[#49c74f]/40 transition max-h-32"
                  />
                  <button
                    onClick={send}
                    disabled={!text.trim()}
                    className="w-11 h-11 rounded-full bg-[#0b6b3a] hover:bg-[#085b30] text-white flex items-center justify-center disabled:opacity-40 disabled:hover:bg-[#0b6b3a] transition-colors shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
