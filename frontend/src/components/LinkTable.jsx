import React, { useState } from "react";
import { truncate, timeAgo, copyToClipboard } from "../utils/helpers";
import { api } from "../api/apiClient";
import { Link } from "react-router-dom";


export default function LinkTable({ links = [], onDelete }) {
  const [deleting, setDeleting] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);
  const base = import.meta.env.VITE_API_URL || "";

  const showToast = (message) => {
    const evt = new CustomEvent("show-toast", { detail: { message } });
    window.dispatchEvent(evt);
  };

  const handleCopy = async (code) => {
    const short = `${base}/${code}`;
    const ok = await copyToClipboard(short);

    showToast(ok ? "Copied to clipboard!" : "Failed to copy");
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete short link "${code}"?`)) return;

    try {
      setDeleting(code);
      await api.deleteLink(code);
      onDelete && onDelete(code);
      showToast("Link deleted");
    } catch (err) {
      showToast(err.payload?.error || err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!links.length) return <div className="empty-table">No links found.</div>;

  return (
    <div className="table-wrap">
      <table className="links-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((l) => (
            <tr key={l.code}>
              <td>
                <a
                  href={`${base}/${l.code}`}
                  className="code-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.code}
                </a>
              </td>

              <td title={l.long_url}>{truncate(l.long_url, 80)}</td>

              <td>{l.clicks ?? 0}</td>

              <td>{timeAgo(l.last_clicked)}</td>

              <td className="actions">
                <button
                  className="btn small"
                  onClick={() => handleCopy(l.code)}
                >
                  Copy
                </button>

                <Link
                  className="btn small ghost"
                  to={`/code/${encodeURIComponent(l.code)}`}
                >
                  Stats
                </Link>

                <button
                  className="btn small warn"
                  disabled={deleting === l.code}
                  onClick={() => handleDelete(l.code)}
                >
                  {deleting === l.code ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {copyStatus && <div className="toast">{copyStatus}</div>}
    </div>
  );
}
