# Photo Gallery Images

## How to Add Your Photos

Add your favorite photos together to this directory with the following naming convention:

### Naming Convention
- `photo1.jpg` - First photo
- `photo2.jpg` - Second photo
- `photo3.jpg` - Third photo
- ... and so on

### Recommendations
- **Number of photos**: 5-10 photos (sweet spot for engagement)
- **Format**: JPG or PNG
- **Size**: Optimize for web (resize to max 1920px width)
- **Aspect ratio**: Any ratio works, but consistent ratios look better

### Photo Ideas
1. Your first date/meeting
2. A special trip or vacation
3. Candid moments together
4. Celebration photos (birthday, anniversary)
5. Silly/fun moments
6. Recent favorite memories

### How to Update Captions

After adding photos, you'll need to update the photo data in `src/App.tsx`:

```typescript
const photos = [
  {
    src: '/images/photo1.jpg',
    caption: 'Our first date at the coffee shop',
    date: 'January 2024'
  },
  {
    src: '/images/photo2.jpg',
    caption: 'Beach trip - best day ever!',
    date: 'March 2024'
  },
  // Add more photos here
];
```

## Image Optimization Tips
- Use tools like [TinyPNG](https://tinypng.com/) to compress images
- Resize large images before adding (use Preview on Mac or any image editor)
- Keep total size under 10MB for all photos combined

## Current Status
- [ ] Add photos to this directory
- [ ] Update captions in App.tsx
