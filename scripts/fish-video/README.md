# Parade fish clips

`public/fish-video/<slug>.mp4` are 8-second clips scrubbed by the scroll on the home page,
with `-first.jpg` (poster) and `-last.jpg` (reduced-motion still) frames.

How they were made:

1. Real photographs from Wikimedia Commons (credits and licences in `credits.json`, shown on the site
   via `content/fish-clips.ts`): `python commons.py src 3000 < titles.txt`.
2. Backgrounds removed and each fish placed on the site's navy background (`cutout.py`, then a
   1920x1080 start frame; frozen end frames add a frost overlay).
3. Tuna end frame (pre-cooked loins left, frozen half right) made with Nano Banana in Google Flow from
   the real tuna photo.
4. Clips generated in Google Flow, Veo 3.1 Fast, "Frames" mode (start + end frame) with the prompts in
   `PROMPTS.md`; the cleanest of two versions kept.
5. Re-encoded for smooth scrubbing (short keyframe interval, no audio):
   `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart -vf scale=1280:-2 out.mp4`
