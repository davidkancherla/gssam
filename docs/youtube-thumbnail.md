# YouTube Thumbnail

The church YouTube thumbnail is generated from the existing GSSAM logo and church photography in `public/`.

Run:

```bash
npm run thumbnail
```

By default, the generator picks the next upcoming Sunday using the `America/Los_Angeles` timezone and writes:

```text
public/generated/gssam-youtube-thumbnail.png
```

To make a thumbnail for a specific service date:

```bash
python3 scripts/generate-youtube-thumbnail.py --date 2026-09-06
```

To write the PNG somewhere else:

```bash
python3 scripts/generate-youtube-thumbnail.py --output ../outputs/gssam-youtube-thumbnail.png
```
