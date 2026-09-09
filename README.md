# Piece Unique OC — pieceuniqueoc.com

A static website with a free admin panel. No build step, no framework, no
monthly software cost. Inventory and contact details are edited through a web
form; everything else is plain HTML.

---

## 1. What's in here

```
index.html          Home
watches.html        Watches, with brand filters
bags.html           Handbags, with brand filters
gallery.html        Photo grid — still here but no longer linked in the menu
sell.html           Sell Your Watch + inquiry form
consign.html        Consign Your Watch + consignment form
appointment.html    Request an appointment
contact.html        Contact details + general message form
thanks.html         Shown after a form is submitted
404.html            Not-found page

content/inventory.json   ← watches and handbags (edited in the admin panel)
content/site.json        ← phone, email, address, Instagram (same)
.pages.yml               Admin panel configuration — leave it alone
netlify.toml             Hosting configuration — leave it alone

assets/css/site.css      All styling, one file, commented by section
assets/js/site.js        Navigation, animation, contact details
assets/js/inventory.js   Renders the shop from inventory.json
assets/img/              Photos and the placeholder illustration

robots.txt, sitemap.xml  Search engines
```

---

## 2. One-time setup: the admin panel

This takes about twenty minutes and you only do it once. Afterwards you manage
the site from a web form on any device, including your phone.

The site currently deploys by dragging a folder onto Netlify. To get an admin
panel, the site needs to live in a **GitHub repository** instead — the panel
saves your edits to GitHub, and Netlify rebuilds automatically. Nothing about
the site itself changes.

### Step 1 — Put the site on GitHub

1. Create a free account at **github.com** if you don't have one.
2. Click **+** (top right) → **New repository**.
3. Name it `pieceuniqueoc`. Choose **Private**. Don't add a README.
   Click **Create repository**.
4. On the next screen, click **uploading an existing file**.
5. Drag in **the contents of this folder** — all the files and the `assets`
   and `content` folders, but not the enclosing `pieceuniqueoc` folder itself.
   Wait for the upload to finish, then click **Commit changes**.

Make sure `.pages.yml` uploaded. Files starting with a dot are sometimes
hidden by macOS — press **Cmd + Shift + .** in Finder to show them.

### Step 2 — Point Netlify at the repository

1. In Netlify, open your site → **Project configuration** → **Build & deploy**.
2. Under **Continuous deployment**, click **Link repository** and choose
   GitHub, then your `pieceuniqueoc` repo.
3. Leave the build command empty and the publish directory as `.` —
   `netlify.toml` already sets this.
4. Click **Deploy**.

From now on Netlify redeploys automatically whenever the repository changes.
You never drag a folder again.

### Step 3 — Connect the admin panel

1. Go to **app.pagescms.org** and sign in with GitHub.
2. Grant it access to the `pieceuniqueoc` repository only.
3. It reads `.pages.yml` and builds your admin screens automatically.

Bookmark that page on your phone. That's your inventory manager.

---

## 3. Managing inventory

In the admin panel, open **Inventory**. You get one list holding both watches
and handbags, with an **Add** button.

| Field | What it does |
|---|---|
| Category | Watches or Handbags. Decides which of the two pages it appears on. Nothing else to do — the page picks it up automatically. |
| Brand | Also creates the filter button. Spell it identically across pieces of the same brand or you'll get two buttons. Hermès needs its accent. |
| Model | The large name on the card. |
| Reference and specs | The grey line underneath. Watches: `Ref. 116500LN — Oystersteel, White Dial`. Bags: `Togo Leather, Gold Hardware — Stamp B`. |
| Price | Typed exactly as shown — `$46,000`, or `Inquire` for price on request. |
| Badge | New Arrival, Consignment, Sold, or None. |
| Photo | Upload straight from your phone. Square, around 1200 × 1200. |
| Show on the home page | Keep four on at a time — a mix of watches and bags reads best. |

Click **Save**. The site updates in under a minute — Netlify rebuilds as soon
as the change lands in GitHub.

Photos land in `assets/img/`. Keep them under about 300KB;
[Squoosh](https://squoosh.app) compresses them without visible loss.

**To mark something sold**, set the badge to `Sold` rather than deleting it.
A sold Daytona or Birkin with a price still tells a visitor what you handle.
Delete it once it stops being useful.

**The menu is Watches, Bags, Sell, Consign, Contact.** Two separate shop
pages, each with its own brand filters, and matching Shop Watches / Shop Bags
cards on the home page. The old `/shop.html` address redirects to
`/watches.html`, so any link already out there still works.

Gallery was removed from the menu — `gallery.html` is still in the folder, so
it can come back by adding one line to the nav in each page.

---

## 4. Changing your phone, email or address

Admin panel → **Contact details**. One form and every page updates at once —
footers, call buttons, the contact page.

The street address has been removed from the site until you have one. The
contact page shows a **Service Area** line instead. The address fields are
still in the admin panel, but nothing displays them right now — tell me when
you have a location and I'll put them back.

Two phone fields, because they do different jobs:

- **Phone (as shown)** — what visitors read: `+1 (949) 555-1234`
- **Phone (digits only)** — what tapping the number dials: `+19495551234`

Until the real phone number is filled in, a small dashed **Placeholder** badge
appears next to it on the contact page. It disappears by itself once you enter
a real value.

---

## 5. Where form submissions go

All four forms — Sell, Consign, Request Appointment, Contact — post to Netlify
Forms and land in your Netlify dashboard.

**Enable it once:** Netlify → **Forms** → **Enable form detection**, then
redeploy. Netlify only scans deploys made *after* detection is switched on.

**Reading them:** Netlify → **Forms**. Four separate inboxes:

| On the site | Called in Netlify |
|---|---|
| Sell Your Watch | `sell-inquiry` |
| Consign Your Watch | `consignment-request` |
| Request Appointment | `appointment-request` |
| Contact message | `general-inquiry` |

**Get them by email:** Forms → **Settings and usage** → **Form notifications**
→ **Add notification** → **Email notification**. Do this immediately, or
inquiries sit unread in a dashboard you never open.

**Attachments.** Sell and Consign accept one photo or PDF each. Netlify caps a
submission at 8 MB, so a large phone photo can bounce.

**Spam.** Each form has an invisible honeypot field plus Netlify's own
filtering. Check the **Spam** tab occasionally in case something real is caught.

---

## 6. Editing page text

Headlines and body copy live in the HTML files. Open one in any text editor,
find the sentence, change it, and either commit the file on GitHub (click the
file → pencil icon → Commit changes) or ask for it to be changed.

The home page service area list — Newport Beach, Corona del Mar, Laguna Beach,
Irvine, Costa Mesa, Huntington Beach, Dana Point, San Clemente — is the
`<ul class="areas">` block in `index.html`.

---

## 7. Still outstanding

- [ ] Real phone number in the admin panel
- [ ] Real inventory and photography — watches and bags
- [ ] Form notification email switched on and test-submitted
- [ ] Instagram link pointed at the real account
- [ ] Privacy Policy, Terms, and Shipping & Returns written — the footer links
      point at `contact.html` as a stand-in
- [ ] Site submitted in Google Search Console
- [ ] Google Business Profile created for the OC location — it does most of the
      local-search work for a business like this

---

## 8. Design notes

Cormorant Garamond display type, uppercase letter-spaced labels, a champagne
gold accent, hard 90° corners, generous white space. Coastal navy replaces flat
black in the hero and feature sections; the ground is a sand off-white rather
than pure white. The hero horizon, the coastal panel, and the watch
illustration are drawn in CSS and SVG, so there are no image dependencies and
nothing to license.

Colors are CSS custom properties at the top of `site.css` — change them once
there and the whole site follows.
