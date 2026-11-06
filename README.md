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
- `assets/photos/originals/` — original photos for the Prints wall (full-res, kept locally, not published).
- `assets/prints/` — web copies of those photos. Generated; don't edit by hand.

## Add a film
1. Upload it to YouTube as Unlisted; copy the ID (the part after `youtu.be/` or `v=`).
2. Put 6–8 stills in `assets/works/<slug>/frames/`, named in the order you want them.
3. Run `./scripts/stills.sh` to make the web copies.
4. Copy an entry in `data/works.js`, fill in the fields, set `youtubeId` and `frames: stills("<slug>", <count>)`.

## Add a photo (Prints)
1. Put the original in `assets/photos/originals/`. Files are numbered in name order, so prefix them `01-`, `02-`… for the order you want.
2. Run `./scripts/stills.sh` to make `assets/prints/01.jpg`, `02.jpg`…
3. In `data/works.js`, add to `PHOTOS`: `{ src: photo(1), category: "corporate", caption: "Annual dinner", client: "Acme", year: 2025, kit: "A7III" }`. `src` and `category` are required; leave `client` out if you can't name them. Delete the placeholder entries once real photos are in.
4. Categories (`corporate`, `creative`, `others`) and their order live in `PHOTO_CATEGORIES` in the same file. Each category is a stack on the page; the first 3 photos listed in it make the stack, first one on top. A category with no photos gets no stack.
5. Shareable links: one category opens with `#prints/corporate`; one photo with `#print-01`, `#print-02`… (the number is its place in `PHOTOS`).
