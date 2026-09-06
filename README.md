<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d00cf3e9-508b-423b-bafb-6301019fc717

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
## Cloudinary image storage

Admin-uploaded menu, category, and gallery images are sent to Cloudinary. The app stores only the Cloudinary secure URL in the local data store. No uploaded image is saved to a local `uploads` directory.

Before using Admin image uploads, create a `.env` file in the project root and set:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=al-taj-hotel
```

You can find the Cloud Name, API Key, and API Secret in your Cloudinary dashboard. Keep the API Secret private and never put it in frontend code.

After editing `.env`, restart `npm run dev`. If Cloudinary is not configured, the Admin upload button will show a clear configuration error instead of silently storing the image locally.
"# Al-Taj-Hotel" 
"# Al-Taj-Hotel" 
