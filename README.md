
# Urban Spoon Cafe

A modern, interactive cafe ordering web application featuring a dynamic menu, AI-powered food recommendations, and a seamless ordering experience.

## Features

- **Dynamic Menu:** Categorized food items with beautiful animations.
- **AI Chef:** Powered by Google Gemini to give food recommendations.
- **Cart System:** Fully functional cart with calculations for taxes and service charges.
- **Admin Dashboard:** Inventory management protected by a PIN.
- **Mobile Responsive:** Optimized for all devices.

## Setup & Installation

1. Clone the repository or download the files.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Google Gemini API key:
   ```
   API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Uploading to GitHub (Alternative Methods)

### Method 1: Web Interface (No Code)
1. Create a new repository on GitHub.
2. Click the link **"uploading an existing file"** on the setup page.
3. Drag and drop all your project files into the browser.
4. Click **Commit changes**.

### Method 2: GitHub Desktop
1. Open GitHub Desktop and select **File > Add Local Repository**.
2. Point to this project folder.
3. Click **Publish Repository** to send it to GitHub.

## Deployment

This app is optimized for deployment on Vercel or Netlify.
1. Push your code to GitHub.
2. Go to Vercel/Netlify and import the project.
3. **Important:** Add your `API_KEY` in the environment variables settings of your deployment dashboard.
