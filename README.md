# IntelliScrape - Web Scraping and Content Summarization Tool

## Overview
IntelliScrape is a college project developed as a full-stack web application to scrape web content, generate AI-powered summaries, and export results as PDFs. Built using the MERN stack (MongoDB, Express.js, React, Node.js), it leverages Puppeteer for efficient scraping and the Google Gemini 2.5 Flash API for intelligent summarization. The project includes JWT-based authentication for security and ethical scraping practices (robots.txt compliance and captcha detection), designed for academic research and data extraction tasks.

## Features
- **Web Scraping**: Extracts content from over 20 websites, handling diverse structures with Puppeteer.
- **AI Summarization**: Generates concise summaries (200-290 words) and highlights key points using the Gemini API.
- **PDF Export**: Converts scraped data and summaries into downloadable PDFs for offline use.
- **Secure Authentication**: Implements JWT tokens to authenticate and authorize 10+ test users.
- **Ethical Scraping**: Ensures compliance with robots.txt and detects captchas to avoid unethical practices.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Scraping**: Puppeteer
- **AI**: Google Gemini 2.5 Flash API
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render (Backend), Netlify (Frontend)

## Project Structure
```
New_IntelliScrape/
│
├── Intelliscrape_Backend/
│   ├── src/
│   │   ├── Controllers/
│   │   ├── DB/
│   │   ├── Middlewares/
│   │   ├── Models/
│   │   ├── Routes/
│   │   ├── Utils/
│   │   ├── app.js
│   │   ├── constants.js
│   │   └── index.js
│   │
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
│
├── Intelliscrape_Frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── images/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md

```

## Installation
This project is deployed, but for local development or contributions:

1. Clone the repository:
   ```bash
   git clone https://github.com/Devagyam-199/New_IntelliScrape.git
   cd New_IntelliScrape
   ```
2. Install dependencies:
   ```bash
   cd Intelliscrape_Backend && npm install
   cd ../Intelliscrape_Frontend && npm install
   ```
3. Set up environment variables in the `Intelliscrape_Backend/.env` file:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_API_KEY=your_google_api_key
   JWT_SECRET=your_jwt_secret
   ```
4. Start the application locally:
   ```bash
   cd Intelliscrape_Backend && npm start
   cd ../Intelliscrape_Frontend && npm run dev
   ```
   - Note: Ensure MongoDB is running locally or use a cloud instance (e.g., MongoDB Atlas).

## Usage
- Access the live application:
  - **Frontend**: [https://intelliscrape.netlify.app/](https://intelliscrape.netlify.app/)
  - **Backend API**: [https://new-intelliscrape.onrender.com](https://new-intelliscrape.onrender.com)
- Log in with a registered account (JWT-protected).
- Enter a URL in the input field and click "Scrape" to view the summary, highlights, and download a PDF.

## Deployment
- **Frontend**: Deployed on Netlify at [ https://intelliscrape.netlify.app/]( https://intelliscrape.netlify.app/).
- **Backend**: Deployed on Render at [https://new-intelliscrape.onrender.com](https://new-intelliscrape.onrender.com).
- Environment variables are configured securely on both platforms.

## Contributions
Developed as a college project by Devagyam-199 to explore web scraping, AI integration, and full-stack development. Contributions are welcome! Please submit a pull request or open an issue for suggestions.

## Future Improvements
- Implement batch processing for multiple URLs.
- Add a history feature to view past scrapes.
- Enhance UI with real-time progress indicators.

## License
MIT License - This project is open-source for educational purposes.

## Contact
- **Author**: Devagyam-199
- **GitHub**: [https://github.com/Devagyam-199](https://github.com/Devagyam-199)
- **Updated**: September 14, 2025