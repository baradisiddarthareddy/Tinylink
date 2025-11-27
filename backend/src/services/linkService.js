import db from "../db.js";

// Generate code 6–8 chars (letters + numbers)
export function generateCode() {
  const length = Math.floor(Math.random() * 3) + 6; // 6–8
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function isCodeExists(code) {
  const [rows] = await db.query("SELECT id FROM links WHERE code = ?", [code]);
  return rows.length > 0;
}

export function normalizeUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}
