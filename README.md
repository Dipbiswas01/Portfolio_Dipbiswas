# Dip Biswas - Portfolio

A modern, responsive portfolio website showcasing professional experience, skills, education, and achievements.

## Project Structure

```
Portfolio Dip Biswas/
├── backend/          # Node.js + Express API
└── frontend/         # React + Tailwind CSS
```

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with React and Tailwind CSS for a clean, professional look
- **Backend API**: Express server providing portfolio data
- **Smooth Scrolling**: Easy navigation between sections
- **Contact Form**: Built-in contact functionality using mailto
- **Social Links**: Direct links to LinkedIn and email

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- CORS
- dotenv

## Installation

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

- `GET /api/portfolio` - Get all portfolio data
- `GET /api/portfolio/personal` - Get personal information
- `GET /api/portfolio/skills` - Get skills list
- `GET /api/portfolio/experience` - Get work experience
- `GET /api/portfolio/education` - Get education details
- `GET /api/portfolio/achievements` - Get achievements

## Sections

1. **Hero** - Eye-catching introduction
2. **About** - Personal information and biography
3. **Skills** - Professional skills with levels
4. **Experience** - Work experience and responsibilities
5. **Education** - Educational background
6. **Achievements** - Notable awards and recognitions
7. **Contact** - Contact form and information
8. **Footer** - Copyright and links

## Customization

To customize the content, edit the `portfolioData` object in [backend/server.js](backend/server.js).

## Deployment

### Frontend
Deploy on Vercel, Netlify, or any static hosting service.

### Backend
Deploy on Heroku, Railway, or any Node.js hosting service.

## License

MIT License - Feel free to use this template for your own portfolio.

## Contact

- Email: biddo470@email.com
- LinkedIn: https://www.linkedin.com/in/dip-biswas-7b897a243/
- Phone: +880 170 7690 5536
