import { useState, useEffect, useCallback } from "react";
export default function LoginModal({ onClose, onSuccess }) {
  const [user, setUser] = useState("village123");
  const [pass, setPass] = useState("pass123");
  const [err, setErr] = useState(false);

  const submit = () => {
    if (user === "village123" && pass === "pass123") {
      onSuccess();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 1600);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lbox">
        <button className="lbox-close" onClick={onClose}>✕</button>
        <div className="lbox-head">
          <div className="lbox-logo">🌿</div>
          <h2>Gramam Portal</h2>
          <p>Sign in to access the village directory</p>
        </div>
        <div className="lfield">
          <label>Mobile / Voter ID</label>
          <input
            type="text" value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter your ID"
          />
        </div>
        <div className="lfield">
          <label>Password</label>
          <input
            type="password" value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={err ? "error" : ""}
            placeholder="Enter password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <button className="l-submit" onClick={submit}>Sign In →</button>
        <div className="l-hint">Demo — ID: <strong>village123</strong> &nbsp;/&nbsp; Pass: <strong>pass123</strong></div>
      </div>
    </div>
  );
}