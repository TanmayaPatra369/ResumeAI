# AI-Powered Resume Builder

A web-based resume builder that leverages machine learning to provide intelligent content suggestions, professional design templates, and comprehensive career optimization tools.

![AI Resume Builder](/generated-icon.png)

## Features

- **AI-Powered Content Enhancement**: Get smart suggestions for skills, job descriptions, and achievements tailored to your profile
- **Bold Text Formatting**: Easily format text with bold styling to highlight important achievements
- **Job Description Matching**: Analyze job descriptions to optimize your resume for specific positions (with enhanced support for Indian job market)
- **Professional Templates**: Multiple professional resume templates with automatic formatting
- **Real-Time Preview**: See changes to your resume in real-time
- **PDF Export**: Download your finalized resume as a professional PDF
- **Resume Analysis**: Get AI-powered feedback and improvement suggestions

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **AI Integration**: Perplexity API (with OpenAI API fallback)
- **State Management**: Zustand
- **PDF Generation**: jspdf, html2canvas
- **Form Handling**: react-hook-form with zod validation

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
   - `PERPLEXITY_API_KEY`: Your Perplexity API key
   - `OPENAI_API_KEY`: Your OpenAI API key (optional, used as fallback)
6. Click "Create Web Service"

### Method 2: Deploy with Blueprint (render.yaml)

1. Log in to your Render account
2. Click on "New +" and select "Blueprint"
3. Connect your repository
4. Render will automatically detect the `render.yaml` file
5. Configure your services and environment variables
6. Click "Apply"

### Important Notes

- You'll need to set up your API keys in Render's environment variables
- The free tier on Render will spin down after inactivity, which might cause a delay on the first request after a period of inactivity
- Consider upgrading to a paid plan for production use

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm run dev`

## Environment Variables

- `PERPLEXITY_API_KEY`: Your Perplexity API key (primary AI provider)
- `OPENAI_API_KEY`: Your OpenAI API key (fallback AI provider)
- `NODE_ENV`: Set to `development` for local, `production` for deployment
- `PORT`: (Optional) Port for the server
  > > > > > > > 87a5762 (Configure application for deployment on the Render cloud platform)

## Features in Detail

### Bold Text Formatting

Select text in experience or project descriptions and click the "B" button to make it bold. This helps emphasize important achievements and skills in your resume.

### Job Description Matching

Upload a job description to get personalized insights on how well your resume matches the requirements. The system analyzes skills match and experience requirements with special optimization for the Indian job market.

### Indian Context Support

The application features default examples and templates specifically designed for Indian professionals, including:

- Relevant educational institutions (IITs, NITs, etc.)
- Common Indian company names and job titles
- Appropriate formatting for Indian address and contact information

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
