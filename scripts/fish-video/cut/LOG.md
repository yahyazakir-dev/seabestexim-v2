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
