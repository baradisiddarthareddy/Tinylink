import db from "../db.js";
import { validateUrl } from "../middleware/validateUrl.js";
import {
  generateCode,
  isCodeExists,
  normalizeUrl,
} from "../services/linkService.js";

// ------------------------
// CREATE LINK
// ------------------------
export const createLink = async (req, res) => {
  try {
    let { longUrl, customCode } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "Long URL is required" });
    }

    longUrl = normalizeUrl(longUrl);

    if (!validateUrl(longUrl)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    // Validate custom code if provided
    if (customCode) {
      const codeRegex = /^[A-Za-z0-9]{6,8}$/;
      if (!codeRegex.test(customCode)) {
        return res.status(400).json({
          error: "Custom code must be 6–8 characters and alphanumeric only",
        });
      }
    }

    let code = customCode || generateCode();

    if (await isCodeExists(code)) {
      return res.status(409).json({ error: "Code already exists" });
    }

    await db.query("INSERT INTO links (code, long_url) VALUES (?, ?)", [
      code,
      longUrl,
    ]);

    return res.json({
      message: "Short link created",
      code,
      shortUrl: `${process.env.BASE_URL}/${code}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// LIST ALL LINKS
// ------------------------
export const getAllLinks = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM links ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// GET LINK STATS
// ------------------------
export const getLinkStats = async (req, res) => {
  try {
    const code = req.params.code;
    const [rows] = await db.query("SELECT * FROM links WHERE code = ?", [code]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// DELETE LINK
// ------------------------
export const deleteLink = async (req, res) => {
  try {
    const code = req.params.code;

    await db.query("DELETE FROM links WHERE code = ?", [code]);

    res.json({ message: "Link deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------
// REDIRECT HANDLER
// ------------------------
export const redirectHandler = async (req, res) => {
  try {
    const code = req.params.code;

    const [rows] = await db.query("SELECT * FROM links WHERE code = ?", [code]);

    if (rows.length === 0) {
      return res.status(404).send("Short link not found");
    }

    const link = rows[0];

    // Update stats
    await db.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = ?",
      [code]
    );

    return res.redirect(302, link.long_url);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
