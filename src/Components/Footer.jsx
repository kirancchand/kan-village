export default function Footer({ onSignOut, loggedIn }) {
  return (
    <footer>
      <div className="ft-inner">
        <div className="ft-brand">
          <div className="ft-brand-icon">🌿</div>
          <span className="ft-brand-name">Gramam</span>
        </div>
        <div className="ft-links">
          <a>Home</a>
          <a>Emergency</a>
          <a>About</a>
          {loggedIn
            ? <a onClick={onSignOut}>Sign Out</a>
            : <a>Sign In</a>}
        </div>
      </div>
      <div className="ft-bot">© 2025 Gramam Panchayat · Village Portal · All rights reserved</div>
    </footer>
  );
}