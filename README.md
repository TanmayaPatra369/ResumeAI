<<<<<<< HEAD
# ResumeAI
=======
# AI-Powered Resume Builder

A web-based resume builder with ML-powered content suggestions, professional templates, and PDF export functionality.

## Features

- Smart content suggestions for skills, job descriptions, and achievements
- Professional resume templates with automatic formatting
- Real-time preview and PDF export
- AI-powered resume analysis and improvement suggestions

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI API
- **State Management**: Zustand
- **PDF Generation**: jspdf, html2canvas

## Deployment on Render

This application is optimized for deployment on Render.com. Follow these steps to deploy:

### Method 1: Deploy with Dashboard UI

1. Log in to your Render account
2. Click on "New +" and select "Web Service"
3. Connect your repository
4. Fill in the following details:
   - **Name**: `ai-resume-builder` (or whatever you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `OPENAI_API_KEY`: Your OpenAI API key
6. Click "Create Web Service"

### Method 2: Deploy with Blueprint (render.yaml)

1. Log in to your Render account
2. Click on "New +" and select "Blueprint"
3. Connect your repository
4. Render will automatically detect the `render.yaml` file
5. Configure your services and environment variables
6. Click "Apply"

### Important Notes

- You'll need to set up your OpenAI API key in Render's environment variables
- The free tier on Render will spin down after inactivity, which might cause a delay on the first request after a period of inactivity
- Consider upgrading to a paid plan for production use

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm run dev`

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to `development` for local, `production` for deployment
- `PORT`: (Optional) Port for the server
>>>>>>> 87a5762 (Configure application for deployment on the Render cloud platform)
