"""Fetch Commons files: python3 commons.py OUTDIR WIDTH < titles.txt  (lines: name|File:Title)
Writes OUTDIR/name.jpg and appends credits to OUTDIR/credits.json."""
import json, sys, time, urllib.parse, urllib.request, os

UA = {"User-Agent": "SeaBestEximSite/1.0 (yahyazakir@gmail.com)"}
out, width = sys.argv[1], int(sys.argv[2])
os.makedirs(out, exist_ok=True)

def get(url, tries=6):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception as e:
            print("  retry", i, e, file=sys.stderr)
            time.sleep(4 * (i + 1))
    raise SystemExit("failed " + url)

credits_path = os.path.join(out, "credits.json")
credits = json.load(open(credits_path)) if os.path.exists(credits_path) else {}
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    name, title = line.split("|", 1)
    q = urllib.parse.urlencode({"action": "query", "format": "json", "prop": "imageinfo", "titles": title,
        "iiprop": "url|extmetadata", "iiurlwidth": width,
        "iiextmetadatafilter": "LicenseShortName|Artist|LicenseUrl|Credit"})
    page = list(json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))["query"]["pages"].values())[0]
    ii = page["imageinfo"][0]
    md = {k: v.get("value", "") for k, v in ii.get("extmetadata", {}).items()}
    open(os.path.join(out, name + ".jpg"), "wb").write(get(ii.get("thumburl") or ii["url"]))
    credits[name] = {"title": title, "page": ii["descriptionurl"], "license": md.get("LicenseShortName"),
                     "licenseUrl": md.get("LicenseUrl"), "artist": md.get("Artist"), "credit": md.get("Credit")}
    print("ok", name, md.get("LicenseShortName"))
    time.sleep(1.5)
json.dump(credits, open(credits_path, "w"), indent=2)
