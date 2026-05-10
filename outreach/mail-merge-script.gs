/**
 * FranchiseOntario.com — Gmail Mail Merge Script
 * ================================================
 * Google Apps Script for sending personalized outreach emails to franchise brands.
 *
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new Google Sheet
 * 2. Import franchise-contacts.csv into Sheet1 (File > Import)
 * 3. Add two new columns at the end: "email_sent" and "sent_date"
 * 4. Go to Extensions > Apps Script, paste this entire script, click Save
 * 5. Copy your HTML email template into the EMAIL_TEMPLATE constant below
 * 6. Run setupTrigger() ONCE to create the daily scheduler
 * 7. Run sendOutreachBatch() manually to test with first 5 rows
 *
 * LIMITS:
 * - Free Gmail: 500 emails/day
 * - Google Workspace: 1,500 emails/day
 * - Script processes DAILY_BATCH_SIZE rows per run to stay under quota
 *
 * HOW IT WORKS:
 * - Reads each row from the Google Sheet
 * - Skips rows already sent (email_sent = "TRUE")
 * - Skips rows with outreach_status = "research-needed"
 * - Replaces {{MERGE_FIELDS}} in the HTML template
 * - Sends via Gmail and marks row as sent
 * - Logs results to the sheet
 */

// ─── CONFIGURATION ──────────────────────────────────────────────────────────

const SENDER_NAME        = 'Corey — FranchiseOntario.com';
const REPLY_TO           = 'info@franchiseontario.com';
const SUBJECT_LINE       = '{{FRANCHISE_NAME}} is live on FranchiseOntario.com 🍁';
const DAILY_BATCH_SIZE   = 40;   // emails per run (stay well under 500/day limit)
const TEST_MODE          = false; // set to true to log emails without sending
const TEST_EMAIL         = 'info@franchiseontario.com'; // your email for test mode

// Column names in your Google Sheet (must match header row exactly)
const COL = {
  FRANCHISE_NAME : 'franchise_name',
  CONTACT_NAME   : 'contact_name',
  CONTACT_EMAIL  : 'contact_email',
  LISTING_ID     : 'listing_id',
  CATEGORY       : 'category',
  CURRENT_TIER   : 'current_tier',
  STATUS         : 'outreach_status',
  EMAIL_SENT     : 'email_sent',
  SENT_DATE      : 'sent_date',
};

// ─── EMAIL TEMPLATE ──────────────────────────────────────────────────────────
// Paste the full HTML from outreach-template.html here, as a template literal.
// Merge fields: {{CONTACT_NAME}} {{FRANCHISE_NAME}} {{FRANCHISE_ID}} {{CATEGORY}} {{TIER}}

const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FranchiseOntario Outreach Email</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">

    <!-- Header -->
    <div style="background:#00228e;padding:24px 32px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;text-align:center;line-height:36px">🍁</div>
        <div>
          <div style="color:white;font-weight:800;font-size:17px;margin:0">FranchiseOntario.com</div>
          <div style="color:rgba(255,255,255,0.6);font-size:12px;margin:2px 0 0">Ontario's #1 Franchise Directory</div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:32px">

      <p style="margin:0 0 6px;font-size:15px;color:#0a1428;font-weight:600">Hi {{CONTACT_NAME}},</p>

      <p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#374151">
        I wanted to reach out personally — we've featured <strong>{{FRANCHISE_NAME}}</strong> on
        <a href="https://www.franchiseontario.com/directory/{{FRANCHISE_ID}}" style="color:#ff000d;text-decoration:none;font-weight:600">FranchiseOntario.com</a>,
        Ontario's fastest-growing franchise discovery platform.
      </p>

      <p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#374151">
        Every month, <strong>2,500+ Ontario entrepreneurs</strong> actively searching for franchise opportunities visit our directory — and {{FRANCHISE_NAME}} is already appearing in their search results.
      </p>

      <!-- Listing preview box -->
      <div style="background:#f8faff;border:1px solid #d1dff5;border-radius:10px;padding:20px;margin:0 0 20px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#64748b">Your current listing</p>
        <p style="margin:0 0 10px;font-size:16px;font-weight:800;color:#00228e">{{FRANCHISE_NAME}}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px">
          <span style="background:#ffe0e0;color:#ff000d;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:0.05em">{{CATEGORY}}</span>
          <span style="background:#e8f4ff;color:#00228e;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px">{{TIER}} Listing</span>
        </div>
        <a href="https://www.franchiseontario.com/directory/{{FRANCHISE_ID}}"
           style="display:inline-block;background:#ff000d;color:white;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px">
          View Your Live Listing →
        </a>
      </div>

      <p style="margin:0 0 14px;font-size:14px;line-height:1.75;color:#374151">
        <strong>Your listing is currently on our Basic (free) plan.</strong> We wanted to let you know about a few things that could significantly increase the number of qualified leads you receive:
      </p>

      <!-- Feature bullets -->
      <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
        <tr>
          <td style="padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;margin:4px 0;font-size:13px;color:#374151;vertical-align:top;background:#fff">
            <strong style="color:#00228e">⚡ Premium ($79/mo)</strong><br />
            Priority placement in search results, highlighted listing, photo gallery, and detailed inquiry management. Typically generates 3–5× more contact requests than a basic listing.
          </td>
        </tr>
        <tr><td style="height:8px"></td></tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;color:#374151;vertical-align:top;background:#fff">
            <strong style="color:#00228e">👑 Enterprise ($199/mo)</strong><br />
            Gold VIP badge, top search placement, unlimited photos, press release distribution, and a dedicated account manager who helps optimize your listing monthly.
          </td>
        </tr>
        <tr><td style="height:8px"></td></tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;color:#374151;vertical-align:top;background:#fff">
            <strong style="color:#00228e">⭐ Homepage Feature Spot ($14.99/wk)</strong><br />
            Rotating weekly homepage placement visible to every visitor — our highest-visibility option. Popular with brands launching in a new Ontario market.
          </td>
        </tr>
      </table>

      <p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#374151">
        There's no obligation — your free listing stays up either way. If you're interested in upgrading or have any questions, just reply to this email or visit your listing page.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0">
        <a href="https://www.franchiseontario.com/register"
           style="display:inline-block;background:#ff000d;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:800;font-size:14px;letter-spacing:-0.01em">
          Upgrade Your Listing →
        </a>
        <br />
        <a href="https://www.franchiseontario.com/directory/{{FRANCHISE_ID}}"
           style="display:inline-block;margin-top:12px;color:#64748b;font-size:12px;text-decoration:none">
          Or view your current listing first
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 18px" />

      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
        FranchiseOntario.com — Ontario's #1 Franchise Directory<br />
        You're receiving this because {{FRANCHISE_NAME}} is listed on our platform.<br />
        <a href="https://www.franchiseontario.com/support" style="color:#05d4fe;text-decoration:none">Unsubscribe</a> ·
        <a href="https://www.franchiseontario.com/support" style="color:#05d4fe;text-decoration:none">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>`;

// ─── MAIN FUNCTION ──────────────────────────────────────────────────────────

function sendOutreachBatch() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data  = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());

  // Map column names to indices
  const idx = {};
  Object.entries(COL).forEach(([key, colName]) => {
    const i = headers.indexOf(colName);
    if (i === -1) throw new Error(`Column "${colName}" not found in sheet headers. Check your column names.`);
    idx[key] = i;
  });

  // Find or create email_sent and sent_date columns
  if (idx.EMAIL_SENT === undefined) {
    const lastCol = headers.length;
    sheet.getRange(1, lastCol + 1).setValue('email_sent');
    sheet.getRange(1, lastCol + 2).setValue('sent_date');
    idx.EMAIL_SENT = lastCol;
    idx.SENT_DATE  = lastCol + 1;
  }

  let sentCount = 0;
  const log = [];

  for (let i = 1; i < data.length; i++) {
    if (sentCount >= DAILY_BATCH_SIZE) break;

    const row    = data[i];
    const status = (row[idx.STATUS] || '').toString().trim().toLowerCase();
    const sent   = (row[idx.EMAIL_SENT] || '').toString().trim().toLowerCase();

    // Skip already sent, research-needed, or empty rows
    if (sent === 'true')              { log.push(`Row ${i+1}: SKIPPED (already sent)`);         continue; }
    if (status === 'research-needed') { log.push(`Row ${i+1}: SKIPPED (research needed)`);      continue; }
    if (!row[idx.CONTACT_EMAIL] || row[idx.CONTACT_EMAIL] === 'See website') {
                                       log.push(`Row ${i+1}: SKIPPED (no email)`);              continue; }

    const franchiseName = row[idx.FRANCHISE_NAME] || '';
    const contactName   = row[idx.CONTACT_NAME]   || 'Franchise Team';
    const contactEmail  = row[idx.CONTACT_EMAIL]  || '';
    const listingId     = row[idx.LISTING_ID]      || '';
    const category      = row[idx.CATEGORY]        || '';
    const tier          = capitalize(row[idx.CURRENT_TIER] || 'Basic');

    // Build personalized subject and body
    const subject = SUBJECT_LINE
      .replace(/{{FRANCHISE_NAME}}/g, franchiseName);

    const body = EMAIL_TEMPLATE
      .replace(/{{CONTACT_NAME}}/g,   contactName)
      .replace(/{{FRANCHISE_NAME}}/g, franchiseName)
      .replace(/{{FRANCHISE_ID}}/g,   listingId)
      .replace(/{{CATEGORY}}/g,       category)
      .replace(/{{TIER}}/g,           tier);

    const toEmail = TEST_MODE ? TEST_EMAIL : contactEmail;

    try {
      GmailApp.sendEmail(toEmail, subject, '', {
        htmlBody  : body,
        name      : SENDER_NAME,
        replyTo   : REPLY_TO,
        noReply   : false,
      });

      // Mark row as sent
      sheet.getRange(i + 1, idx.EMAIL_SENT + 1).setValue('TRUE');
      sheet.getRange(i + 1, idx.SENT_DATE  + 1).setValue(new Date().toISOString());

      sentCount++;
      log.push(`Row ${i+1}: SENT to ${toEmail} (${franchiseName})`);
      Utilities.sleep(1500); // 1.5s delay between sends — avoids spam triggers

    } catch (err) {
      log.push(`Row ${i+1}: ERROR — ${err.message}`);
    }
  }

  // Log summary to console
  Logger.log(`\n=== OUTREACH BATCH COMPLETE ===\nSent: ${sentCount} emails\n\n${log.join('\n')}`);
  SpreadsheetApp.getUi().alert(`Batch complete!\n\nSent: ${sentCount} emails\n\nCheck View > Logs for details.`);
}

// ─── SETUP DAILY TRIGGER ────────────────────────────────────────────────────
// Run this function ONCE to schedule automatic daily sends at 9am

function setupTrigger() {
  // Delete existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('sendOutreachBatch')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  Logger.log('Daily trigger created — script will run every day at ~9am.');
  SpreadsheetApp.getUi().alert('Daily trigger set! Emails will send automatically at 9am each day.');
}

// ─── TEST SINGLE EMAIL ──────────────────────────────────────────────────────
// Run this to send yourself a test preview with dummy data

function sendTestEmail() {
  const testBody = EMAIL_TEMPLATE
    .replace(/{{CONTACT_NAME}}/g,   'Franchise Director')
    .replace(/{{FRANCHISE_NAME}}/g, 'Sample Franchise Co.')
    .replace(/{{FRANCHISE_ID}}/g,   'sample-franchise')
    .replace(/{{CATEGORY}}/g,       'Fast Food')
    .replace(/{{TIER}}/g,           'Basic');

  GmailApp.sendEmail(TEST_EMAIL, '[TEST] Your Listing is Live on FranchiseOntario.com 🍁', '', {
    htmlBody : testBody,
    name     : SENDER_NAME,
    replyTo  : REPLY_TO,
  });

  SpreadsheetApp.getUi().alert(`Test email sent to ${TEST_EMAIL}! Check your inbox.`);
}

// ─── STATS DASHBOARD ────────────────────────────────────────────────────────

function showStats() {
  const sheet   = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data    = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const sentIdx = headers.indexOf('email_sent');

  if (sentIdx === -1) { SpreadsheetApp.getUi().alert('No email_sent column found.'); return; }

  const total  = data.length - 1;
  const sent   = data.slice(1).filter(r => (r[sentIdx] || '').toString().toLowerCase() === 'true').length;
  const unsent = total - sent;

  SpreadsheetApp.getUi().alert(
    `📊 Outreach Stats\n\n` +
    `Total contacts: ${total}\n` +
    `Emails sent:    ${sent}\n` +
    `Remaining:      ${unsent}\n` +
    `Est. days left: ${Math.ceil(unsent / DAILY_BATCH_SIZE)} day(s) at ${DAILY_BATCH_SIZE}/day`
  );
}

// ─── RESET SENT STATUS ──────────────────────────────────────────────────────
// Use carefully — clears all sent markers so you can re-send the campaign

function resetSentStatus() {
  const ui = SpreadsheetApp.getUi();
  const confirm = ui.alert('⚠️ Reset all sent status?', 'This will clear all "email_sent" markers, allowing emails to be sent again to all contacts. Are you sure?', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  const sheet   = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data    = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const sentIdx = headers.indexOf('email_sent');
  const dateIdx = headers.indexOf('sent_date');

  for (let i = 1; i < data.length; i++) {
    if (sentIdx !== -1) sheet.getRange(i + 1, sentIdx + 1).setValue('');
    if (dateIdx !== -1) sheet.getRange(i + 1, dateIdx + 1).setValue('');
  }

  ui.alert('Reset complete. All sent markers cleared.');
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
