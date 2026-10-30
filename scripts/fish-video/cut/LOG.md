# Cut clips log

One entry per clip (see `../CUT-CLIPS.md`, Step 3).

| Species | End image made with | Clip model | Versions tried | Notes |
|---|---|---|---|---|
| Swordfish | Nano Banana 2.1 in Flow, 2 rounds of 4 | Veo 3.1 Quality, first + last frame | 2 | **Not committed, needs a redo.** Both versions turn the swordfish into a tuna-like fish mid-clip (the bill disappears) and morph back to the end image in the last second. One version also has cubes flying off. |
| Mahi-mahi | Nano Banana 2.1 in Flow, 2 rounds of 4 | Veo 3.1 Quality, first + last frame | 2 | Kept version B. The cuts appear, cubes separate and settle cleanly. A light sweep crosses the frame around 6–7 s. Fillet is skin-on (the default). |
| Sailfish | Nano Banana 2.1 in Flow, 2 rounds of 4 | Veo 3.1 Quality, first + last frame | 2 | **Not committed, needs a redo.** Version A sends white cubes flying around the fish. Version B cuts a white grid across the whole body, sail included, then snaps to the end image. |
| Red snapper | Nano Banana 2.1 in Flow, 2 rounds of 4 | Veo 3.1 Quality, first + last frame | 2 | Kept version B. The fish splits into head, rear-body blocks and tail, then the blocks become cubes. A light sweep crosses the frame around 6–7 s. |

Notes for all four:
- End images: the first round put cubes on the tail fin. At Yahya's request they were remade so the tail fin stays one whole frozen piece and cubes appear only in the fleshy rear body. The committed `end/*.png` files are that second round. Flow outputs 1376×768, so each was scaled to 1080 px high and centre-cropped to 1920×1080.
- Clips are 1280×720, 7.92 s, exactly as downloaded from Flow. They include an audio track that Veo adds; the website's re-encode (`-an`) drops it.
- Swordfish and sailfish need new clips once Flow credits reset (12 Nov). Try Veo 3.1 Fast with 4 versions each, and drop the "soft light glides" line from the prompt to avoid the light sweep.

Retry on 30 Oct with Veo 3.1 Lite (10 credits each, 1 version per fish, the last credits until the 12 Nov reset; prompt also asked for no light sweeps and no change of species):
- Swordfish: same failure. The fish loses its bill and turns tuna-like mid-clip, and pieces fly off before settling. Not committed.
- Sailfish: cubes fly out in a ring around the fish and the sail disappears mid-clip. Not committed.
Veo seems to struggle when the end frame differs this much from the start frame for these two long-billed fish. Options: more versions after the credit reset, or build this stage on the site as a crossfade or split animation between `start/` and `end/` instead of a generated clip.

Swordfish and sailfish, final for now (30 Oct): made without AI video, from `start/<slug>-frozen.png` and `end/<slug>-cut.png` with ffmpeg. They hold the start frame for 1.5 s, then a soft-edged wipe runs from head to tail over 5 s (xfade `smoothleft`), then they hold the end frame. 1280×720, 24 fps, 8 s, no audio. The command, per fish:
`ffmpeg -loop 1 -t 6.5 -i start/<slug>-frozen.png -loop 1 -t 6.5 -i end/<slug>-cut.png -filter_complex "[0]scale=1280:720,fps=24,format=yuv420p,setsar=1[a];[1]scale=1280:720,fps=24,format=yuv420p,setsar=1[b];[a][b]xfade=transition=smoothleft:duration=5:offset=1.5,format=yuv420p" -c:v libx264 -crf 16 -preset slow -movflags +faststart -an clips/<slug>-cut.mp4`
Yahya may replace these with clips from another AI video tool (e.g. Higgsfield); the file names stay the same.

Retry on 31 Oct, second Google account, Veo 3.1 Fast (1 version per fish, shorter prompt). Neither clip is committed; the wipe versions stay:
- Swordfish: kept its bill this time, but a teal glow flashes over the first second (that would jump visibly after the freeze clip), the cubes run up to the head, and it snaps to the end frame.
- Sailfish: cubes drop out of the bottom of the frame.
A separate test on Artlist's free Kling 2.5 Turbo Pro (start + end frame, 5 s, 1080p) gave the cleanest swordfish so far, but downloading it needs a paid Artlist plan. If better clips are wanted later, Kling is the one to try.
