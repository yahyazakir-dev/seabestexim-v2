"""Cut fish out of their photos: python cutout.py SRC_DIR OUT_DIR name[:flip] ..."""
import sys, os
from PIL import Image, ImageOps
from rembg import remove, new_session

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
session = new_session("isnet-general-use")
for arg in sys.argv[3:]:
    name, _, flip = arg.partition(":")
    im = Image.open(os.path.join(src, name + ".jpg")).convert("RGB")
    cut = remove(im, session=session, post_process_mask=True)
    a = cut.getchannel("A").point(lambda v: 0 if v < 12 else v)
    cut.putalpha(a)
    cut = cut.crop(a.getbbox())
    if flip:
        cut = ImageOps.mirror(cut)
    cut.save(os.path.join(out, name + ".png"))
    # preview on navy so halos show up
    bg = Image.new("RGBA", cut.size, (2, 30, 70, 255))
    bg.alpha_composite(cut)
    bg.convert("RGB").resize((900, max(1, int(900 * cut.height / cut.width)))).save(os.path.join(out, name + "-check.jpg"))
    print(name, cut.size)
