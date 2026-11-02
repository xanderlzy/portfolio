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
  // YouTube ID of the showreel. Leave empty to hide the reel section.
  showreelId: "",
  // Formspree form ID (the part after formspree.io/f/). Leave empty until set up.
  formspreeId: "",
  cv: "assets/cv/Xander-Lee-CV.pdf",
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
      "I lit it, shot it, then took it into the grade so the look stayed the same from set to screen. [Draft: add a line about the look you were going for.]",
    youtubeId: "Rem9z2wEJGM",
    tone: "#2a2420",
    aspect: "4 / 3",
    frames: stills("anya-vapa", 7)
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
      "My film from first idea to final grade. I directed it, cut it and coloured it, which also meant I was the only one to blame. [Draft: what's it about?]",
    youtubeId: "",
    tone: "#1f2226",
    frames: []
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
      "Two jobs nobody notices when they're done right. I dressed the world on screen and made sure it sounded like somewhere real. [Draft: add a detail you're proud of.]",
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
      "I found the rhythm in the footage and cut it into a film. [Draft: one line on the edit.]",
    youtubeId: "vMbxpeb2DIQ",
    tone: "#1c2120",
    frames: stills("oh-shoot", 7)
  }
];
