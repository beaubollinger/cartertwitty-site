# Setup Guide — Carter's Website

This is the plain-English, step-by-step, first-time-ever guide. Do these in order. Don't skip.

## Phase 0 — Accounts + software (do before anything else)

### Create these free accounts:
1. **GitHub** → github.com
2. **Vercel** → vercel.com (sign up *with GitHub* — links them)
3. **Cloudflare** → cloudflare.com
4. **Cal.com** → cal.com (Carter's account — get his booking link)

### Install these on your computer:
1. **Node.js** → nodejs.org, click "LTS", run the installer
2. **Git** → git-scm.com (Mac may already have it — try typing `git --version` in Terminal)
3. **Claude Code** → claude.com/code
4. **VS Code** *(optional)* → code.visualstudio.com

### Things to have ready:
- Carter's credit card (for the domain, ~$10/yr)
- Carter's email (for handoff later)

---

## Phase 1 — Get the files

1. Download this project as a zip (use the "Download" button in the chat).
2. Unzip to `~/Projects/carter-site` (or wherever — pick a spot you'll remember).
3. Open Terminal:
   - Mac: `Cmd+Space`, type "Terminal", enter
   - Windows: Start menu → "PowerShell"
4. Navigate to the folder:
   ```
   cd ~/Projects/carter-site
   ```
5. Start Claude Code:
   ```
   claude
   ```

---

## Phase 2 — Convert prototype to production

Inside Claude Code, type this exactly:

> Convert this React-Babel HTML prototype into an Astro project so it can deploy to Vercel. Keep the exact design, copy, portrait photo, tweaks behavior, and animations. Split each section into its own `.astro` component. Import `carter.css` globally. Put the portrait in `/public/assets/`. When you're done, run `npm run dev` so I can preview it.

Wait. Claude Code will:
- Create an Astro project
- Port each section
- Install dependencies
- Start a local preview at `http://localhost:4321`

Open that URL in your browser. Check that:
- The photo shows up
- The sections all load
- Clicking "Apply" opens the Calendly placeholder URL

If anything looks off, tell Claude Code what's wrong. It fixes.

---

## Phase 3 — Push to GitHub

1. Go to github.com → click **+** (top right) → **New repository**
2. Name it `cartertwitty-site` → **Create repository**
3. Copy the URL it gives you (looks like `https://github.com/yourname/cartertwitty-site.git`)
4. Back in Claude Code, say:

> Initialize git in this folder and push to this GitHub repo: [paste URL]

Claude Code will ask you to sign in to GitHub once. Approve it. Code is now online.

---

## Phase 4 — Deploy to Vercel

1. Go to **vercel.com/new**
2. Click your `cartertwitty-site` repo
3. Click **Deploy** (don't touch the settings)
4. Wait ~30 seconds
5. You get a URL like `cartertwitty-site.vercel.app`
6. Open it. **The site is live.**

Every time you push changes to GitHub after this, Vercel auto-updates the live site within 60 seconds.

---

## Phase 5 — Buy the domain

1. In **Cloudflare**, go to **Domain Registration → Register**
2. Search `cartertwitty.com` (or your pick)
3. Buy it (~$10/yr) with Carter's card
4. In **Vercel**: open the project → **Settings → Domains**
5. Type `cartertwitty.com` → Vercel shows you 2 DNS records
6. Copy those records → back in Cloudflare → **DNS** → add both records
7. Wait 10 minutes. Type `cartertwitty.com` in your browser. Site loads.

---

## Phase 6 — Swap placeholder values

Before you send Carter the link, tell Claude Code:

> Update the booking URL throughout the site from the Calendly placeholder to [paste Carter's real Cal.com link]. Also remove the testimonial section until we have real testimonials. Commit and push.

Wait 60 seconds. Live site is updated.

---

## Phase 7 — Handoff

Create a shared **1Password** vault (free for 2 users) with:
- Cloudflare login (domain renewal)
- Vercel login
- GitHub login
- Cal.com login

Record a 3-5 minute Loom showing:
- The live site
- How he logs into Cal.com to see bookings
- How he texts you when he wants changes

Done.

---

## Ongoing loop

Carter texts: *"Change the headline to X"*

1. `cd ~/Projects/carter-site`
2. `claude`
3. Tell it the change
4. Tell it: *"commit and push"*
5. Vercel auto-updates. Done. 2 minutes.

---

## What Carter pays

| Item | Cost |
|---|---|
| Domain | ~$10/year |
| Vercel hosting | $0 (free tier) |
| Cal.com | $0 (free tier) |
| **Total** | **~$10/year** |

---

## If something breaks

- **Site is down?** Check vercel.com → your project → "Deployments". Red = broken build. Click it, read the error, paste it into Claude Code, say "fix this."
- **Domain not working?** DNS takes up to 24 hours sometimes. Wait.
- **Can't push to GitHub?** Claude Code usually handles auth. If stuck, run `gh auth login` and follow prompts.
