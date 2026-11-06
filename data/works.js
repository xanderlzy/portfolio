/*
  All site content that changes lives here.
  To add a film: copy an entry in WORKS and change the fields.
  Original stills go in assets/works/<slug>/frames/ (kept locally, not published).
  Run scripts/stills.sh to make web copies in assets/stills/<slug>/, then set
  `frames: stills("<slug>", <count>)`.
  `aspect` is the frame shape used before an image loads (default 16 / 9).
*/

// "assets/stills/<slug>/01.jpg" … up to `count`
function stills(slug, count) {
  var list = [];
  for (var n = 1; n <= count; n++) {
    list.push("assets/stills/" + slug + "/" + (n < 10 ? "0" : "") + n + ".jpg");
  }
  return list;
}

window.SITE = {
  email: "xanderlzy@gmail.com",
  instagram: "kneesurgerey",
  linkedin: "https://www.linkedin.com/in/xanderlzy/",
  // YouTube ID of the showreel. Leave empty to hide the reel section.
  showreelId: "",
  // Formspree form ID (the part after formspree.io/f/). Leave empty until set up.
  formspreeId: "meaapllz",
  cv: "assets/cv/XANDERLEE_RESUME.pdf",
  portrait: "assets/about/portrait.jpg"
};

window.WORKS = [
  {
    slug: "anya-vapa",
    title: "ANYA VAPA",
    year: 2026,
    type: "Short film",
    roles: ["Director of Photography", "Colourist"],
    short: "DOP / Colour",
    kit: "Sony NX5P",
    programme: "NP School of Film & Media Studies",
    blurb:
      "As the DOP, I was responsible for the look of the film. I decided to go for a handheld style to give the film a more intimate feeling. I was also the colourist for this project, which meant I was responsible for the final look of the film. The most challenging part of this was grading the film to be day for night.",
    youtubeId: "Rem9z2wEJGM",
    tone: "#2a2420",
    aspect: "4 / 3",
    frames: stills("anya-vapa", 7)
  },
  {
    slug: "tipped",
    title: "TIPPED",
    year: 2026,
    type: "Short film",
    roles: ["Editor"],
    short: "Editor",
    kit: "Sony PMW-F5 CineAlta",
    programme: "NP School of Film & Media Studies",
    blurb:
      "As the editor, I was responsible for the pacing and structure of the film. I worked closely with the director to ensure that the story was told in the most effective way possible. The most challenging part of this was finding the right balance between tension and release.",
    youtubeId: "Lm9FZ-67Puc",
    tone: "#241c1c",
    frames: stills("tipped", 7)
  },
  {
    slug: "forget-the-club",
    title: "FORGET THE CLUB",
    year: 2026,
    type: "Short film",
    roles: ["Director", "Editor", "Colourist"],
    short: "Director / Editor / Colour",
    kit: "Sony FX3",
    programme: "NP School of Film & Media Studies",
    blurb:
      "This is my first short film as a director. I was responsible for the overall vision of the film, seeing it through from concept to completion. The most challenging part of this was making sure that the story was told in a way that was engaging and entertaining.",
    youtubeId: "WSkiffl-vps",
    tone: "#1f2226",
    frames: stills("forget-the-club", 7)
  },
  {
    slug: "reunion",
    title: "REUNION",
    year: 2026,
    type: "Short film",
    roles: ["Sound", "Art"],
    short: "Sound / Art",
    kit: "Sony FX3",
    programme: "NP School of Film & Media Studies",
    blurb:
      "Sound and Art: Two jobs nobody notices when they're done right. This was my first stint doing sound for a film, and I learned a lot about how to make a film sound good. I also did some art direction for this film, which meant I was responsible for the look of the film. The most challenging part of this was making sure that the sound and visuals worked together to create the right mood, as well as making the scene fit the setting of the story.",
    youtubeId: "0R0SapdQEkc",
    tone: "#26221b",
    frames: stills("reunion", 8)
  },
  {
    slug: "oh-shoot",
    title: "OH SHOOT!",
    year: 2025,
    type: "Short film",
    roles: ["Editor"],
    short: "Editor",
    kit: "Sony NX5P",
    programme: "NP School of Film & Media Studies",
    blurb:
      "OH SHOOT! is a comedy short film. The biggest challenge in the comedy genre is never in the jokes itself, but the timing and delivery. Therefore, as the editor, I could make or break the film. I had to make sure that the pacing was just right, and that the jokes landed as intended. The most challenging part of this was making sure that the timing of the jokes was perfect, as well as making sure that the film flowed well from scene to scene.",
    youtubeId: "vMbxpeb2DIQ",
    tone: "#1c2120",
    frames: stills("oh-shoot", 7)
  }
];

/*
  PRINTS: photography (section 02), shown as one stack of prints per category.
  Clicking a stack opens that category full screen.
  To add photos to a category:
    1. Put the originals in assets/photos/<category>/ (kept locally, not published),
       e.g. assets/photos/creative/. Name your 3 stack covers "Cover 1", "Cover 2",
       "Cover 3"; they come first, then the rest in name order.
    2. Run scripts/stills.sh to make web copies in assets/prints/<category>/01.jpg, 02.jpg, …
    3. Below, add the category's photos with set("<category>", <count>).
  To caption one photo (shown in the viewer), list it on its own instead:
    { src: photo("corporate", 4), category: "corporate", caption: "…", client: "…", year: 2025, kit: "A7III" }
  Inside a category, each photo keeps its real shape, so portrait and landscape can mix.
*/

// "assets/prints/corporate/04.jpg" for photo("corporate", 4)
function photo(category, n) {
  return "assets/prints/" + category + "/" + (n < 10 ? "0" : "") + n + ".jpg";
}

// every photo in a category, uncaptioned: set("corporate", 14)
function set(category, count) {
  var list = [];
  for (var n = 1; n <= count; n++) list.push({ src: photo(category, n), category: category });
  return list;
}

// One stack per category in the Prints section, in this order. The first 3 photos of each
// category make up its stack (the first one is on top). A category with no photos is left out.
window.PHOTO_CATEGORIES = [
  { id: "corporate", label: "Corporate" },
  { id: "creative", label: "Creative" },
  { id: "others", label: "Others" }
];

window.PHOTOS = [].concat(
  set("corporate", 14)
);
