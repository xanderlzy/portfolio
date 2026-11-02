# xanderlzy.xyz

Portfolio site for Xander Lee. Plain HTML/CSS/JS, no build step.

## Run locally
```
python3 -m http.server 8765
```
Then open http://localhost:8765

## Where things live
- `data/works.js` — the films and site settings (showreel, Formspree ID, CV, portrait). Almost every update happens here.
- `index.html` — page structure and the About / Contact copy.
- `css/style.css` — the look.
- `js/main.js` — contact sheet rendering, project view, copy-email, form.
- `assets/works/<slug>/frames/` — original stills for each film (full-res, kept locally, not published).
- `assets/stills/<slug>/` — web copies the site loads. Generated; don't edit by hand.

## Add a film
1. Upload it to YouTube as Unlisted; copy the ID (the part after `youtu.be/` or `v=`).
2. Put 6–8 stills in `assets/works/<slug>/frames/`, named in the order you want them.
3. Run `./scripts/stills.sh` to make the web copies.
4. Copy an entry in `data/works.js`, fill in the fields, set `youtubeId` and `frames: stills("<slug>", <count>)`.
