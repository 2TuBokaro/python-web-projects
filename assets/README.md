# Assets Directory

This directory contains essential static assets for the Modi Medical application.

## Included Assets (Small files):
- logo.jpg - Main logo image
- MainYouTubeImageFinalInJPEG.jpg - Featured promotional image
- Red Green Minimalist Medical Logo.gif - Animated logo
- doctor-nurses-special-equipment.jpg - Medical staff image
- MMpromoTextInEng.txt - English promotional text
- MMpromotextInHindi.txt - Hindi promotional text
- CurrentObjective.txt - Current business objectives

## Excluded Assets (Large files):
The following asset types are excluded to keep deployment within free tier limits:
- Video files (*.mp4, *.mov) - Too large for free tier
- Large images (Data/, Meta/, Stickers/ folders) - Size constraints
- Document files (*.docx, *.xlsx, *.pdf) - Not needed for core functionality

## Fallback Handling:
The application has fallback logic to handle missing assets:
- On-error fallbacks to logo.jpg for images
- Graceful degradation for missing video files
- Text content loaded from included .txt files

## Production Recommendation:
For full asset support in production, consider:
1. Using external CDN for large files (Cloudflare, AWS S3)
2. Optimizing videos for web streaming
3. Implementing lazy loading for images
4. Using Vercel Blob storage for file uploads