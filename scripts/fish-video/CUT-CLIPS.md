# Brief: "cut" clips for the home page fish animation

**Who this is for:** a Claude session with browser access to Google Flow (labs.google/flow), working for Sea Best Exim's website.
**Repo:** `yahyazakir-dev/seabestexim-v2`, branch `claude/nice-davinci-b99aic`.
**Your job:** make 4 new 8-second videos (plus their end images) in Google Flow and commit them to this folder. Do not change any website code; the website session wires the clips in afterwards.

## What the animation does today, and what changes

On the home page each fish is a scroll-controlled video. Today, the frozen-only fish (swordfish, mahi-mahi, sailfish, red snapper, ribbonfish) play one clip: the fresh fish slowly frosts over until it is frozen (`public/fish-video/<slug>.mp4`). The tuna clips (yellowfin, skipjack) are unchanged by this brief.

The customer wants each fish to show **how it is sold**: first it freezes (the existing clip), then **it is cut into its product forms**. Your new clip is that second stage. It **must start on exactly the frozen fish the current clip ends on**, so the two play back to back as one continuous animation.

## The four clips

The fish face right (head on the right, tail on the left). The head section always stays a whole frozen piece so the species stays recognisable; the products appear toward the tail.

| # | Species (slug) | Sections, head → tail (right → left) | Product facts from the customer |
|---|---|---|---|
| 1 | Swordfish (`swordfish`) | **Frozen** head section → **steaks** (middle) → **cubes** (tail end) | frozen; cubes and steaks, skinless and boneless |
| 2 | Mahi-mahi (`mahi-mahi`) | **Frozen** head section → **fillet** (middle) → **cubes** (tail end) | frozen; fillet; cubes skinless and boneless |
| 3 | Sailfish (`sailfish`) | **Frozen** front half (head, bill, sail) → **cubes** (rear half) | frozen; cubes skinless and boneless |
| 4 | Red snapper (`red-snapper`) | **Frozen** front half (head) → **cubes** (rear half) | frozen; cubes skinless and boneless |

Not in scope: ribbonfish (frozen only, keeps its current clip) and the tunas (keep their current pre-cooked / frozen clips).

Open question for the customer, use the default unless told otherwise: the mahi-mahi fillet is shown **skin-on** (its blue-green-gold skin keeps it recognisable). If Yahya says skinless, use the skinless wording in the prompt below.

## Inputs (already in this folder)

`start/<slug>-frozen.png`: 1920×1080, the last frame of each existing freeze clip (navy background, frozen fish in profile, facing right). Every new clip and end image starts from this.

Reference for what real product looks like (the customer's own photos, in `../src-photos/`): `sailfish-cubes.jpg` (cubes, 35/45 g), `sailfish-portions.jpg` (portions/steaks), `red-snapper-fillet-skin-on.jpg` (skin-on fillets). Upload these to Flow as extra image references when making the end images if it helps realism.

## Step 1: make the END image for each species (Nano Banana / image model in Flow)

Edit `start/<slug>-frozen.png` with the prompt below (replace the bracketed part from the table). Keep the image 1920×1080, 16:9.

Base prompt:

```
Edit this image. Keep the camera, framing, lighting, the dark navy background with its soft teal glow, and the fish's exact position, size and outline unchanged. The frozen fish (facing right) is now cleanly separated into sections, with a small even gap (about a finger's width) between sections, all still lying in a straight line in the fish's original silhouette, as if the fish had been cut and the parts pulled slightly apart:
[SECTIONS]
Each section sits exactly where that part of the fish was. Clean professional seafood-processing cuts, premium export product photography, photorealistic, crisp detail, soft studio light from above, subtle shadow under each piece. No knives, hands, people, cutting board, plate, packaging, text, labels, logos or watermark. Background stays identical.
```

`[SECTIONS]` per species:

1. **Swordfish**
   ```
   - Right third (head, bill and front of the body): stays the whole frozen fish section, frost-covered, exactly as in the original.
   - Middle third: becomes a neat row of 4–5 thick swordfish steaks standing on edge, skinless and boneless, pale ivory-pink flesh with the characteristic swirled muscle rings, lightly frosted.
   - Left third (rear body and tail area): becomes a tidy cluster of 12–16 skinless, boneless swordfish cubes, about 3 cm, pale ivory-pink, lightly frosted, arranged to fill the outline of the tail section (the tail fin itself is gone).
   ```
2. **Mahi-mahi**
   ```
   - Right third (blunt head and front body): stays the whole frozen fish section, frost-covered, exactly as in the original.
   - Middle third: becomes one long mahi-mahi fillet lying flat, skin-on, the skin side showing its blue-green and gold colour with small dark spots, the cut edge showing firm white-pink flesh, lightly frosted.
   - Left third (rear body and tail area): becomes a tidy cluster of 12–16 skinless, boneless mahi-mahi cubes, about 3 cm, white-pink flesh, lightly frosted, filling the outline of the tail section (the tail fin itself is gone).
   ```
   (Skinless variant of the middle line: "becomes one long skinless mahi-mahi fillet lying flat, firm white-pink flesh, no skin, lightly frosted.")
3. **Sailfish**
   ```
   - Right half (head, long bill, the tall sail fin and front body): stays the whole frozen fish section, frost-covered, exactly as in the original.
   - Left half (rear body and tail area): becomes a tidy cluster of 14–18 skinless, boneless sailfish cubes, about 3 cm, pinkish-beige flesh with fine grain, lightly frosted, filling the outline of the rear body (the tail fin itself is gone).
   ```
4. **Red snapper**
   ```
   - Right half (head and front body): stays the whole frozen fish section with its rosy red-pink frosted skin, exactly as in the original.
   - Left half (rear body and tail area): becomes a tidy cluster of 10–14 skinless, boneless red snapper cubes, about 3 cm, white flesh with a faint pink edge, lightly frosted, filling the outline of the rear body (the tail fin itself is gone).
   ```

Make 2–4 versions; keep the one where the head section is unchanged, the background is unchanged, and the pieces look like real food (not plastic). Save as `end/<slug>-cut.png` (1920×1080).

## Step 2: make the CLIP (Veo 3.1 in Flow, "Frames to Video")

- First frame: `start/<slug>-frozen.png`. Last frame: `end/<slug>-cut.png`.
- 16:9, 8 seconds, sound off. Veo 3.1 Quality if credits allow, otherwise Fast.
- Make 2–4 versions. Keep the one where the camera never moves, the background never changes, the head section never moves, and the separation reads clearly.

Prompt (replace `[SPECIES]` with: swordfish / mahi-mahi / sailfish / red snapper, and `[PRODUCTS]` with: "steaks and cubes" / "a fillet and cubes" / "cubes" / "cubes"):

```
Locked-off studio product shot, completely static camera, no zoom, no pan, no camera shake. A whole frozen [SPECIES], frost-covered, lies perfectly still in profile, facing right, floating centred over a smooth dark navy-blue background with a soft teal glow. The fish does not swim, rotate or move; the head section never moves.

0–1.5 s: the frozen fish holds still, ice crystals glinting.
1.5–6.5 s: clean, invisible cuts appear across the body and the rear sections separate smoothly and slightly apart, transforming in place into [PRODUCTS]: the pieces stay in the fish's original line and silhouette, as if an unseen precision cutter processed the fish. Gentle, continuous, satisfying motion, no splashing, no debris.
6.5–8 s: everything settles and holds still: the frozen head section on the right and the finished [PRODUCTS] toward the tail, lightly frosted, soft light glides once across the pieces.

Photorealistic, premium seafood-export commercial, soft cool studio lighting from above, subtle shadows, crisp detail, 4K quality.

Avoid: knives, blades, saws, hands, people, cutting board, plate, packaging, blood, fragments flying, ice blocks, steam, fog, text, labels, logos, watermark, water, bubbles, other fish, background change, camera movement, the fish swimming or moving.
```

If Frames to Video will not take a last frame, use only the first frame with the same prompt.

## Step 3: hand back through GitHub

Commit to branch `claude/nice-davinci-b99aic` of `yahyazakir-dev/seabestexim-v2`:

- `scripts/fish-video/cut/end/<slug>-cut.png`: the chosen end image (4 files)
- `scripts/fish-video/cut/clips/<slug>-cut.mp4`: the chosen clip, as downloaded from Flow (4 files, do not re-encode)
- Append a short entry per clip to `scripts/fish-video/cut/LOG.md`: which model (Quality/Fast), how many versions were tried, and anything that went wrong (for example "used first frame only").

Commit message: `Add cut clips for the home fish animation`. Then tell Yahya it is done. Do **not** edit anything under `app/`, `components/`, `content/` or `public/`; the website session re-encodes the clips for smooth scrolling, adds the section labels (Frozen / Steaks / Fillet / Cubes) on top of the video and publishes them.

## What the website session will do with them (for reference)

- Re-encode each clip for scroll scrubbing: `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart -vf scale=1280:-2 out.mp4` → `public/fish-video/<slug>-cut.mp4`, plus `-cut-last.jpg`.
- Play the freeze clip, then the cut clip, as one scroll-controlled stage per fish, with the labels fading in over each section.
