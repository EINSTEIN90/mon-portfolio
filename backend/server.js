// backend/server.js (ESM)
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // accepte JSON

// helper simple pour échapper HTML (déclaration hoistée)
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.post("/contact", async (req, res) => {
  try {
    // Récupère tout depuis le body
    const {
      name = '',
      email = '',
      phone = '',
      subject = '',
      budget = '',
      message = '',
      website = '' // honeypot
    } = req.body || {};

    // ANTI-SPAM: si honeypot rempli => on ignore
    if (website && website.trim() !== '') {
      return res.status(200).json({ success: true, ignored: true });
    }

    // Validation très basique (tu peux renforcer)
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Nom, email et message sont requis." });
    }

    // Prépare le transporteur SMTP (GMAIL exemple)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Construire un HTML propre (template stylé)
    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Nouveau Message - Portfolio</title>
  <style>
    html,body{margin:0;padding:0;height:100%;}
    img{border:0;display:block;outline:none;text-decoration:none;}
    a{x-apple-data-detectors:none; color:inherit; text-decoration:none;}
    body {
      background-color: #eef2f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
      color: #111827;
    }
    .container { max-width:600px; margin:0 auto; }
    .header { padding:28px 24px; color:#fff; text-align:center; border-radius:12px 12px 0 0; }
    .header h1 { margin:0; font-size:20px; font-weight:800; letter-spacing:-0.4px; }
    .header p { margin:6px 0 0; opacity:0.95; font-size:14px; }
    .content { padding:32px 28px; background:#ffffff; border-left:1px solid rgba(15,23,42,0.04); border-right:1px solid rgba(15,23,42,0.04); }
    .content h2 { font-size:18px; margin:0 0 16px 0; color:#0f172a; font-weight:700; }
    .info-table { width:100%; border-collapse:collapse; margin-bottom:22px; }
    .info-table th, .info-table td { text-align:left; padding:12px 10px; font-size:14px; vertical-align:top; }
    .info-table th { color:#4b5563; font-weight:700; width:140px; background:#fbfdff; border-radius:4px; }
    .info-table td { color:#111827; }
    .message-box { background:#f8fafc; padding:16px; border-radius:8px; white-space:pre-wrap; font-family:monospace; font-size:14px; color:#0f172a; border-left:4px solid #2563eb; box-shadow: inset 0 1px 2px rgba(2,6,23,0.03); margin-bottom:20px; }
    .button { display:inline-block; text-decoration:none; font-weight:700; border-radius:8px; box-shadow:0 6px 18px rgba(59,130,246,0.18); }
    .footer { padding:20px 28px; text-align:center; font-size:13px; color:#6b7280; background:#fbfdff; border-radius:0 0 12px 12px; border-top:1px solid rgba(15,23,42,0.04); }
    @media screen and (max-width:600px) {
      .content { padding:20px; }
      .header { padding:22px 18px; border-radius:0; }
      .footer { padding:18px; }
      .info-table th, .info-table td { display:block; width:100%; box-sizing:border-box; padding:10px 0; border-bottom:none; }
      .container { width:100% !important; }
    }
  </style>
</head>
<body style="margin:0; padding:24px 0; background-color:#eef2f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:transparent;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; margin:0 auto;">
          <tr>
            <td style="padding:0;">
              <div class="header" style="background:linear-gradient(135deg,#0f172a 0%,#2563eb 100%);">
                <div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;">
                  <div aria-hidden="true" style="display:flex;align-items:center;gap:10px;">
                    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logo">
                      <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                          <stop offset="0" stop-color="#34d399" />
                          <stop offset="1" stop-color="#2563eb" />
                        </linearGradient>
                      </defs>
                      <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#g1)" opacity="0.95"/>
                      <path d="M20 42 L32 18 L44 42 H37 L32 30 L27 42 Z" fill="white" opacity="0.95"/>
                    </svg>
                    <div style="text-align:left;">
                      <div style="font-weight:800; font-size:16px; color:#ffffff; line-height:1;">Albert Sama</div>
                      <div style="font-size:12px; color:rgba(255,255,255,0.85); line-height:1;">Portfolio · Contact</div>
                    </div>
                  </div>
                </div>
                <div style="margin-top:12px;">
                  <h1 style="margin:0; font-size:20px; font-weight:800; color:#fff;">Nouveau message</h1>
                  <p style="margin:6px 0 0; font-size:13px; color:rgba(255,255,255,0.92);">Reçu de <strong style="color:#fff">**${escapeHtml(name)}**</strong></p>
                </div>
              </div>
              <div class="content" style="background:#ffffff;">
                <h2>Détails du contact</h2>
                <table class="info-table" role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                  <tr>
                    <th>Nom</th>
                    <td>${escapeHtml(name)}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td><a href="mailto:${escapeHtml(email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(email)}</a></td>
                  </tr>
                  <tr>
                    <th>Téléphone</th>
                    <td>${escapeHtml(phone) || '—'}</td>
                  </tr>
                  <tr>
                    <th>Sujet</th>
                    <td>${escapeHtml(subject) || '—'}</td>
                  </tr>
                  <tr>
                    <th>Budget</th>
                    <td>${escapeHtml(budget) || '—'}</td>
                  </tr>
                </table>
                <h2>Message</h2>
                <div class="message-box">${escapeHtml(message)}</div>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;">
                  <tr>
                    <td align="left">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-radius:8px; background:linear-gradient(90deg,#2563eb,#60a5fa);">
                            <a href="mailto:${escapeHtml(email)}?subject=Re:%20${encodeURIComponent(subject || 'Votre message')}" class="button" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                              ✉️ Répondre au message
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="padding-left:12px; vertical-align:middle;">
                      <div style="font-size:13px;color:#6b7280;">Reçu le<br><strong style="color:#111827;">${new Date().toLocaleString()}</strong></div>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="footer" style="background:#fbfdff;">
                <div style="display:flex;align-items:center;justify-content:center;gap:8px; margin-bottom:6px;">
                  <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                      <linearGradient id="g2" x1="0" x2="1">
                        <stop offset="0" stop-color="#34d399" />
                        <stop offset="1" stop-color="#2563eb" />
                      </linearGradient>
                    </defs>
                    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#g2)" opacity="0.95"/>
                    <path d="M22 44 L32 24 L42 44 H36 L32 34 L28 44 Z" fill="white" opacity="0.95"/>
                  </svg>
                  <div style="font-size:13px; color:#6b7280;">Ce message a été envoyé depuis ton portfolio.</div>
                </div>
                <div style="font-size:12px; color:#9aa3b2;">&copy; ${new Date().getFullYear()} Albert Sama. Tous droits réservés.</div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Plain text fallback
    const textBody = `
Nouveau message depuis le site
-----------------------------
Nom: ${name}
Email: ${email}
Téléphone: ${phone}
Sujet: ${subject}
Budget: ${budget}

Message:
${message}

Reçu le: ${new Date().toLocaleString()}
    `;

    // Mail options: from = ton SMTP user (évite rejet Gmail)
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // l'expéditeur visible (utilise ton SMTP_USER)
      to: process.env.RECEIVER_EMAIL,
      subject: (subject ? `${subject} — ` : '') + `Nouveau message du site de ${name}`,
      replyTo: email || process.env.RECEIVER_EMAIL, // quand tu cliques "répondre", ça va au client
      text: textBody,
      html: htmlBody
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));


