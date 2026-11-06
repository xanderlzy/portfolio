# xanderlzy.xyz

Portfolio site for Xander Lee. Plain HTML/CSS/JS, no build step.

## Run locally
```
python3 -m http.server 8765
```
Then open http://localhost:8765

## Where things live
- `data/works.js` — the films, the photos (`PHOTOS`) and site settings (showreel, Formspree ID, CV, portrait). Almost every update happens here.
- `index.html` — page structure and the About / Contact copy.
- `css/style.css` — the look.
- `js/main.js` — contact sheet rendering, project view, print stacks, album view and enlarger, copy-email, form.
- `assets/works/<slug>/frames/` — original stills for each film (full-res, kept locally, not published).
- `assets/stills/<slug>/` — web copies the site loads. Generated; don't edit by hand.
- `assets/photos/<category>/` — original photos for Prints (full-res, kept locally, not published).
- `assets/prints/<category>/` — web copies of those photos. Generated; don't edit by hand.

## Add a film
1. Upload it to YouTube as Unlisted; copy the ID (the part after `youtu.be/` or `v=`).
2. Put 6–8 stills in `assets/works/<slug>/frames/`, named in the order you want them.
3. Run `./scripts/stills.sh` to make the web copies.
4. Copy an entry in `data/works.js`, fill in the fields, set `youtubeId` and `frames: stills("<slug>", <count>)`.

## Add photos (Prints)
1. Put the originals in `assets/photos/<category>/` (`corporate`, `creative` or `others`). Name the three stack covers `Cover 1`, `Cover 2`, `Cover 3`; they come first, the rest follow in name order.
2. Run `./scripts/stills.sh` to make `assets/prints/<category>/01.jpg`, `02.jpg`…
3. In `data/works.js`, add the category to `PHOTOS`: `set("creative", 10)`. To caption a photo, list it on its own: `{ src: photo("corporate", 4), category: "corporate", caption: "…", client: "…", year: 2025 }`.
4. Categories and their order live in `PHOTO_CATEGORIES`. A category with no photos gets no stack.
5. Shareable links: a category opens with `#prints/corporate`; one photo with `#print-01`, `#print-02`… (its place in `PHOTOS`).
