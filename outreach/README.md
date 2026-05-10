# FranchiseOntario.com — Franchise Outreach System

Send personalized HTML emails to 100+ Canadian franchise brands for **completely free** using Gmail + Google Sheets + Apps Script.

**Capacity:** 500 emails/day (free Gmail) · No Mailchimp, no Resend, no cost.

---

## Files in This Folder

| File | Purpose |
|---|---|
| `outreach-template.html` | Branded HTML email template with merge fields |
| `franchise-contacts.csv` | 100+ Canadian franchise brand contacts |
| `mail-merge-script.gs` | Google Apps Script for automated Gmail sending |
| `README.md` | This guide |

---

## Quick Start (15 minutes)

### Step 1 — Import Contacts into Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Click **File → Import → Upload** and select `franchise-contacts.csv`
3. In import settings: **Replace current sheet**, separator: **Comma**, **Do not convert numbers** → click **Import**
4. Your sheet now has all franchise contacts with these columns:
   - `franchise_name` · `contact_name` · `contact_email` · `franchise_inquiry_url`
   - `category` · `website` · `listing_id` · `current_tier` · `outreach_status` · `notes`

### Step 2 — Research Missing Emails (optional but recommended)

Some contacts are marked `outreach_status = research-needed`. For each:
1. Visit the `franchise_inquiry_url` in that row
2. Find their franchise contact email on the Franchise/Partner page
3. Update `contact_email` with the real email
4. Change `outreach_status` to `ready`

Skip this step if you want to start with the `ready` contacts only — there are 50+ with emails already filled in.

### Step 3 — Set Up the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Open `mail-merge-script.gs` from this folder and paste the entire contents
4. Update the configuration at the top of the script:
   ```
   const SENDER_NAME = 'Your Name — FranchiseOntario.com';
   const REPLY_TO    = 'info@franchiseontario.com';
   const TEST_EMAIL  = 'your-email@gmail.com';
   ```
5. Click **Save** (disk icon)

### Step 4 — Send a Test Email First

1. In Apps Script, select function `sendTestEmail` from the dropdown at the top
2. Click **▶ Run**
3. Grant permissions when prompted (Gmail access + Sheets access)
4. Check your inbox — you'll receive a preview of exactly what franchise contacts will see

### Step 5 — Send Your First Batch

1. Select function `sendOutreachBatch` from the dropdown
2. Click **▶ Run**
3. The script sends 40 emails (configurable), marks each row as "sent", then shows a summary dialog
4. Check the **View → Logs** tab to see which emails went out

### Step 6 — Automate Daily Sending (optional)

To send automatically every morning at 9am:
1. Select function `setupTrigger`
2. Click **▶ Run**
3. That's it — the script will send 40 more emails each day until all `ready` contacts are reached

---

## Email Template Variables

The HTML template uses these merge fields that are auto-filled per contact:

| Merge Field | Value From | Example |
|---|---|---|
| `{{CONTACT_NAME}}` | `contact_name` column | "Franchise Director" |
| `{{FRANCHISE_NAME}}` | `franchise_name` column | "Turtle Jack's" |
| `{{FRANCHISE_ID}}` | `listing_id` column | "sourced-turtle-jack-s" |
| `{{CATEGORY}}` | `category` column | "Bar & Grill" |
| `{{TIER}}` | `current_tier` column (capitalized) | "Basic" |

---

## Contact List Overview

The CSV has two groups:

### Group 1 — Already Listed (50 brands)
Franchises currently on FranchiseOntario.com on the free Basic plan. Email goal: let them know their listing is live and pitch a paid upgrade.

These all have `current_tier = basic` and `outreach_status = ready`.

### Group 2 — Prospects (50+ brands)
Major Canadian franchise brands NOT yet on the directory. Email goal: announce their free listing is ready (create one first) or invite them to join.

These have `current_tier = prospect` and `outreach_status = research-needed` — visit their franchise inquiry page to get their contact email.

**Top priority prospects (biggest Ontario reach):**
- Boston Pizza — franchiseinfo@bostonpizza.com ✅
- Mary Brown's Chicken — (visit marybrowns.com/franchise)
- Osmow's Shawarma — (Ontario-born, massive growth)
- Hero Certified Burgers — (Ontario-only brand)
- Wild Wing — (Ontario-born, perfect fit)
- Mr. Lube — info@mrlube.com ✅
- The UPS Store Canada — (visit theupsstore.ca/franchise)
- Kumon Canada — (400+ Canadian centres)
- Comfort Keepers Canada — (senior care boom)
- Anytime Fitness Canada — (large Ontario gym presence)

---

## Sending Strategy

### Week 1 — Existing Listings (warm outreach)
Send to all `current_tier = basic` contacts first. These are the easiest wins — the listing already exists, they just need to know about it and see the upgrade value.

**Subject:** "{{FRANCHISE_NAME}} is live on FranchiseOntario.com 🍁"

### Week 2-3 — Top Prospects
Research emails for top 20 prospects, create basic free listings for them, then send. The listing makes the email credible — you're not just cold pitching, you're showing them something that already exists.

### Week 4+ — Full Prospect List
Work through the remaining prospects in batches.

---

## Staying Out of Spam

1. **Use your real Gmail** (not a new account) — established accounts have better deliverability
2. **Keep DAILY_BATCH_SIZE at 40–50** — don't blast 500 on day one
3. **Space sends with Utilities.sleep(1500)** — already built in (1.5s between emails)
4. **Personalize the subject line** — merge fields are already included
5. **Include unsubscribe link** — already in the template footer
6. **Reply-To is set** — franchise contacts can reply directly to your email

---

## Adding New Contacts

To add a franchise brand to your outreach list:

1. Add a new row in the Google Sheet with these fields filled in:
   - `franchise_name` — exact brand name
   - `contact_name` — "Franchise Director" if unknown
   - `contact_email` — found on their franchise inquiry page
   - `listing_id` — the ID from FranchiseOntario.com (or blank if prospect)
   - `category` — match to existing directory categories
   - `current_tier` — `basic` if listed, `prospect` if not
   - `outreach_status` — `ready` if email found, `research-needed` if not
2. The script will pick it up on the next run

---

## Script Functions Reference

| Function | What It Does |
|---|---|
| `sendTestEmail()` | Sends a preview to your TEST_EMAIL address |
| `sendOutreachBatch()` | Sends next batch of `DAILY_BATCH_SIZE` emails |
| `setupTrigger()` | Schedules automatic daily sending at 9am |
| `showStats()` | Shows how many sent vs remaining |
| `resetSentStatus()` | Clears all sent markers (use carefully) |

---

## Production Email Setup (When Ready to Scale)

Once you set up Resend (free tier = 3,000 emails/month with custom domain):

1. Add `RESEND_API_KEY` to your Vercel environment variables
2. Transactional emails (registration confirmations, upgrade receipts, inquiry alerts) will flow through the Resend API automatically
3. For outreach campaigns at scale (10,000+/month), upgrade to Resend's $20/month plan or use Loops.so (built for SaaS lifecycle emails)

For now, Gmail mail merge handles outreach perfectly.

---

## Environment Variables Needed in Vercel

These are still needed before going fully live:

| Variable | Status | Action |
|---|---|---|
| `RESEND_API_KEY` | ❌ Missing | Sign up at resend.com, verify franchiseontario.com domain, copy API key |
| `HMAC_SECRET` | ❌ Missing | Use: `62351bbc5b108ec835443d7b7cf48b04c001a1931ff7c80fee2f5e2fe6caba67` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Set in .env.local | Verify it's also in Vercel dashboard |
| `STRIPE_SECRET_KEY` | ✅ Set in .env.local | Verify it's also in Vercel dashboard |
| `STRIPE_WEBHOOK_SECRET` | ✅ Set in .env.local | Verify it's also in Vercel dashboard |

To add to Vercel:
1. Go to vercel.com → Your Project → Settings → Environment Variables
2. Add each variable with value, select all environments (Production, Preview, Development)
3. Redeploy after adding

---

*FranchiseOntario.com Outreach System — Last updated May 2026*
