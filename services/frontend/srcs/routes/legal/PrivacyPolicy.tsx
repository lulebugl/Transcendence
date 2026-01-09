import { LegalPage } from "./LegalPage";

export const PrivacyPolicy = () => {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="2025-12-12">
      <p>
        This Privacy Policy explains how ft_transcendence collects, uses, and protects your personal information when you use our 3D Pong game platform. We value your privacy and are committed to safeguarding your data.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Account data: username, avatar, password hash, 2FA secret, API key</li>
        <li>Game data: match history, scores, achievements, stats</li>
        <li>Technical data: IP address, device/browser info (for security)</li>
      </ul>
      <h2>How We Use Your Data</h2>
      <ul>
        <li>To provide game services and features</li>
        <li>To enable matchmaking, leaderboards, tournaments, and achievements</li>
        <li>To secure your account (authentication, 2FA)</li>
        <li>To improve the platform and fix bugs</li>
      </ul>
      <h2>Data Sharing</h2>
      <ul>
        <li>We do not sell your data.</li>
        <li>Data may be shared with blockchain services for match recording (if enabled).</li>
        <li>We may share data with law enforcement if required by law.</li>
      </ul>
      <h2>Your Rights</h2>
      <ul>
        <li>Access, update, or delete your account at any time</li>
        <li>Request data export or removal by contacting support</li>
      </ul>
      <h2>Security</h2>
      <ul>
        <li>We use encryption, secure authentication, and best practices to protect your data.</li>
      </ul>
      <h2>Changes</h2>
      <p>
        We may update this policy. Changes will be posted here with the last updated date.
      </p>
      <p>
        Contact: support@fttranscendence.com
      </p>
    </LegalPage>
  );
};
