// services/smsService.js — Real SMS delivery with a graceful demo fallback.
//
// AgriSmart BD sends emergency SMS to farmers' phones. A real carrier
// requires a bulk-SMS gateway account (API key + sender ID). We support a
// generic HTTP gateway (GreenWeb-style by default) configured via env vars:
//
//   SMS_GATEWAY=greenweb          # gateway name (any non-empty value enables it)
//   SMS_API_URL=https://api.greenweb.com.bd/api.php
//   SMS_API_KEY=your-api-token
//   SMS_SENDER_ID=AgriSmart       # optional sender mask
//
// When no gateway credentials are set we return { sent:false, simulated:true }
// so callers can show an in-app "demo" alert instead of failing loudly.

/**
 * Normalize a Bangladeshi phone number to the gateway-friendly form.
 * Accepts "+880 1XXX XXX XXX", "01812345678", "8801812345678" → "8801812345678".
 */
export function normalizePhone(to) {
  if (!to) return "";
  let p = String(to).replace(/[^\d+]/g, "");
  if (p.startsWith("+")) p = p.slice(1); // +880... → 880...
  if (p.length === 11 && p.startsWith("01")) p = "880" + p.slice(1); // 01XXXXXXXXX → 8801XXXXXXXXX
  if (p.length === 10 && p.startsWith("1")) p = "880" + p; // 1XXXXXXXXX → 8801XXXXXXXXX
  return p;
}

/**
 * Send a single SMS. Returns:
 *   { sent:true, simulated:false, to, gateway }  — delivered to the gateway
 *   { sent:false, simulated:true, to }            — no gateway configured
 *   { sent:false, simulated:false, error }        — gateway call failed
 * Never throws; always resolves within ~3.5s.
 */
export async function sendSms({ to, message }) {
  const number = normalizePhone(to);
  if (!number) return { sent: false, simulated: false, error: "No recipient phone" };
  if (!message || !message.trim()) return { sent: false, simulated: false, error: "No message" };

  const gateway = process.env.SMS_GATEWAY;
  const apiKey = process.env.SMS_API_KEY;
  if (!gateway || !apiKey) {
    return { sent: false, simulated: true, to: number };
  }

  const apiUrl =
    process.env.SMS_API_URL || "https://api.greenweb.com.bd/api.php";
  const sender = process.env.SMS_SENDER_ID || "";

  const params = new URLSearchParams({
    token: apiKey,
    to: number,
    message: message.trim(),
  });
  if (sender) params.set("sender", sender);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    clearTimeout(timer);
    const text = await res.text().catch(() => "");
    // GreenWeb returns "Success" / error text or JSON — treat non-2xx as failure.
    if (!res.ok) return { sent: false, simulated: false, error: `Gateway HTTP ${res.status}: ${text.slice(0, 120)}` };
    return { sent: true, simulated: false, to: number, gateway, raw: text.slice(0, 200) };
  } catch (err) {
    clearTimeout(timer);
    return { sent: false, simulated: false, error: err.name === "AbortError" ? "Gateway timeout" : err.message };
  }
}

export default { sendSms, normalizePhone };
