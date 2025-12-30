# Gallery Images

Place your gallery images in this directory.

## Image Requirements

- **Format**: JPEG or PNG
- **Recommended Size**: 800-1200px width
- **Aspect Ratio**: Square (1:1) works best for grid layout
- **File Size**: Optimize images to under 500KB for faster loading

## Adding Images

1. Add your image files to this directory
2. Update `gallery.html` with new image entries:

```html
<div class="gallery-item" onclick="openLightbox('assets/images/gallery/your-image.jpg', 'Image Description')">
    <img src="assets/images/gallery/your-image.jpg" alt="Image Description" loading="lazy">
</div>
```

## Image Optimization

Use tools like:
- [TinyPNG](https://tinypng.com/) for compression
- [Squoosh](https://squoosh.app/) for format conversion
- ImageMagick for batch processing
