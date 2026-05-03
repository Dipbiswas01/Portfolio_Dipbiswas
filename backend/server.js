const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// GitHub API configuration
const GITHUB_USERNAME = 'Dipbiswas01';
const GITHUB_API_BASE = 'https://api.github.com';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets integration (optional)
const { google } = require('googleapis');
let sheetsClient = null;

const initSheetsClient = () => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
      console.log('⚠️ Google Sheets not configured (set GOOGLE_SHEET_ID)');
      return null;
    }

    // Prefer reading a keyfile path for local development
    const keyFilePath = process.env.GOOGLE_SHEETS_KEYFILE; // e.g., ./secrets/service-account.json
    let creds = null;

    if (keyFilePath && fs.existsSync(keyFilePath)) {
      const fileContent = fs.readFileSync(keyFilePath, 'utf8');
      creds = JSON.parse(fileContent);
    } else if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      // Fallback: credentials provided as escaped JSON in env var
      creds = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    } else {
      console.log('⚠️ Google Sheets credentials not provided. Set GOOGLE_SHEETS_KEYFILE or GOOGLE_SHEETS_CREDENTIALS');
      return null;
    }

    const jwtClient = new google.auth.JWT(
      creds.client_email,
      null,
      creds.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    sheetsClient = { auth: jwtClient, sheetId };
    return sheetsClient;
  } catch (err) {
    console.error('❌ Failed to initialize Google Sheets client:', err.message);
    sheetsClient = null;
    return null;
  }
};

const appendRowToSheet = async (messageData) => {
  try {
    if (!sheetsClient) initSheetsClient();
    if (!sheetsClient) return false;

    // Ensure auth client is ready
    await sheetsClient.auth.authorize();

    const sheets = google.sheets({ version: 'v4', auth: sheetsClient.auth });
    const values = [[new Date().toISOString(), messageData.name, messageData.email, messageData.message]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetsClient.sheetId,
      range: 'Sheet1!A:D',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });

    console.log('✅ Appended contact to Google Sheet');
    return true;
  } catch (err) {
    console.error('❌ Failed to append to Google Sheet:', err.message);
    return false;
  }
};

// Fallback messages file (when MongoDB is down)
const messagesFilePath = path.join(__dirname, 'messages.json');

// MongoDB Connection with optimized pool configuration
// Connection pool configured for long-running server (OLTP workload)
// Based on typical portfolio traffic patterns
const mongoURI = process.env.MONGODB_URI || 'mongodb://dip0biswas:dipbiswas@cluster0-shard-00-00.son3gol.mongodb.net:27017,cluster0-shard-00-01.son3gol.mongodb.net:27017,cluster0-shard-00-02.son3gol.mongodb.net:27017/portfolio?ssl=true&replicaSet=atlas-kvl8u0-shard-0&authSource=admin&retryWrites=true&w=majority';

let isMongoDBConnected = false;

// Connect to MongoDB without blocking app startup
mongoose.connect(mongoURI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('✅ MongoDB connection established successfully');
  isMongoDBConnected = true;
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️ Server running but MongoDB is unavailable. Messages will not be saved.');
  isMongoDBConnected = false;
});

// Message Schema for storing contact form submissions
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

// Create Message model
const Message = mongoose.model('Message', messageSchema);

// GitHub API Fetcher - Get repositories from GitHub
const getGitHubProjects = async () => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error('Failed to fetch GitHub repos');
    
    const repos = await response.json();
    
    // Transform GitHub repos to portfolio project format
    return repos
      .filter(repo => !repo.fork && !repo.private) // Only public, non-forked repos
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by latest update
      .slice(0, 10) // Limit to 10 most recent
      .map((repo, index) => ({
        id: index + 1,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        company: `Project, ${new Date(repo.created_at).getFullYear()}`,
        description: repo.description || 'A portfolio project',
        tags: repo.topics && repo.topics.length > 0 
          ? repo.topics.map(t => t.charAt(0).toUpperCase() + t.slice(1))
          : ['Development'],
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        year: new Date(repo.updated_at).getFullYear().toString(),
        goal: `Repository: ${repo.name}`,
        results: `Stars: ⭐ ${repo.stargazers_count} | Forks: 🍴 ${repo.forks_count} | Language: ${repo.language || 'N/A'}`,
        overview: repo.description || 'Check out this project on GitHub',
        detailImages: [
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
        ],
        link: repo.html_url,
        github_url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updated_at: repo.updated_at
      }));
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    return null; // Return null if GitHub fetch fails
  }
};

// Cache for GitHub projects (refresh every 1 hour)
let cachedGitHubProjects = null;
let lastGitHubFetch = 0;
const GITHUB_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Portfolio Data
const portfolioData = {
  personal: {
    name: 'Dip Biswas',
    title: 'Engineer & Full Stack Developer',
    location: 'Raipur, India',
    email: 'biddo470@email.com',
    phone: '+880 170 7690 5536',
    linkedin: 'https://www.linkedin.com/in/dip-biswas-7b897a243/',
    about: 'The most valuable lesson I\'ve learned is the importance of smart work and focus. I aspire to be an Engineer and have developed a passion for AI/ML innovations. My studies in Information Technology have provided me with valuable insights into the field and a clear vision for my future career. I\'m excited to continue learning and applying my skills to real-world challenges.'
  },
  skills: [
    { category: 'Problem Solving', level: 'Expert' },
    { category: 'Frontend', level: 'Advanced' },
    { category: 'Backend', level: 'Advanced' },
    { category: 'UI/UX Design', level: 'Intermediate' },
    { category: 'Multi-tasking', level: 'Advanced' }
  ],
  experience: [
    {
      id: 1,
      icon: 'IEEE',
      company: 'IEEE Computer Society',
      position: 'Graphic Designer & Webmaster',
      period: 'Jan 2023 - Dec 2024',
      description: [
        'Designed promotional materials (posters, social media graphics) to support events and branding initiatives',
        'Collaborated with marketing team to achieve engaging content on a consistent schedule',
        'Managed and updated the chapter\'s website, ensuring timely posting of events and relevant content',
        'Improved site performance and usability while maintaining alignment with IEEE branding and accessibility goals'
      ]
    },
    {
      id: 2,
      icon: 'UR',
      company: 'UncleFAB',
      position: 'Web Developer',
      period: '2023 - 2025',
      description: [
        'Assist in updating and maintaining the UncaRob website, ensuring content, product, listings, and promotional materials are always up to date and clearly visible',
        'Collaborate with the design team to implement responsive, mobile-friendly web pages that align with UncaRob\'s brand aesthetics and user experience goals'
      ]
    },
    {
      id: 3,
      icon: 'BL',
      company: 'Biostack',
      position: 'UI/UX Designer',
      period: '2023 - 2024',
      description: [
        'Created user research and create wireframes, prototypes, and high-fidelity designs to prioritize usability and accessibility',
        'Work closely with product managers, developers, and stakeholders to ensure the seamless integration of design with functional requirements'
      ]
    }
  ],
  education: [
    {
      id: 1,
      icon: '🏫',
      image: '/chandigarh-university.png',
      degree: 'Bachelor of Engineering in Information Technology',
      institution: 'Chandigarh University',
      period: 'Jan 2022 - Dec 2026',
      details: 'Pursuing (7.35 CGPA)',
      location: 'Mohali, Punjab'
    },
    {
      id: 2,
      icon: '🎓',
      image: '/images.png',
      degree: 'Class 12',
      institution: 'Kumarkhatri Govt. College, Kushia',
      period: 'Completed in 2022',
      location: 'Kumarkhatri, Arunha'
    }
  ],
  projects: [
    {
      id: 1,
      title: 'Fika Bakery & Coffee Bar',
      company: 'Brand Identity, 2024',
      description: 'Warm identity exploration with a soft, premium visual direction.',
      tags: ['Brand Identity', 'Visual Design', 'Art Direction'],
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      year: '2024',
      goal: 'Build a warm and memorable identity that feels calm, approachable, and premium across every brand touchpoint.',
      results: 'The final identity system stayed consistent across menus, signage, packaging, and social previews while remaining easy to scale.',
      overview: 'A brand identity concept centered on handwritten personality, soft textures, and quiet visual balance for a modern coffee space.',
      detailImages: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80'
      ],
      link: '#'
    },
    {
      id: 2,
      title: 'La Barbetta',
      company: 'Brand Identity, 2025',
      description: 'Editorial brand mood with dramatic contrast and motion.',
      tags: ['Brand Identity', 'Editorial', 'Visual System'],
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      year: '2025',
      goal: 'Create a bold editorial identity with cinematic contrast, motion, and a refined luxury feeling.',
      results: 'The visual system translated well across large-format visuals, digital assets, and presentation mockups.',
      overview: 'A dramatic identity study that combines black-and-white imagery, light trails, and elegant typography.',
      detailImages: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'
      ],
      link: '#'
    },
    {
      id: 3,
      title: 'Farrow Studio',
      company: 'Web Design, 2024',
      description: 'Product-led landing page concept with a bright, modern feel.',
      tags: ['Web Design', 'UI Design', 'Prototype'],
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      year: '2024',
      goal: 'Design a bright, product-focused web experience that feels polished and easy to scan.',
      results: 'The concept balances promotional storytelling with strong imagery and clean spacing.',
      overview: 'A landing page exploration built around type hierarchy, bold photography, and modern editorial rhythm.',
      detailImages: [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
      ],
      link: '#'
    },
    {
      id: 4,
      title: 'Aurelic',
      company: 'Brand Identity, 2022',
      description: 'Luxury-focused visual identity with strong cinematic contrast.',
      tags: ['Brand Identity', 'Luxury', 'Typography'],
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      year: '2022',
      goal: 'Shape a luxury identity that feels minimal, cinematic, and timeless.',
      results: 'The visual direction created a premium mood across signage, packaging, and social media previews.',
      overview: 'A moody identity study focused on typography, contrast, and high-end presentation.',
      detailImages: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507914372368-b37b7a1e8b81?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
      ],
      link: '#'
    },
    {
      id: 5,
      title: 'Studio Flow',
      company: 'Brand Identity, 2024',
      description: 'Minimal studio concept with a clean image-led presentation.',
      tags: ['Brand Identity', 'Minimal', 'Design System'],
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      year: '2024',
      goal: 'Create a minimal studio identity that feels calm, modern, and flexible for multiple formats.',
      results: 'The system stayed lightweight and adaptable while keeping the visual tone cohesive.',
      overview: 'A clean identity concept using restrained color, spacing, and atmospheric photography.',
      detailImages: [
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
      ],
      link: '#'
    },
    {
      id: 6,
      title: 'Monochrome Fashion',
      company: 'Brand Identity, 2023',
      description: 'High-contrast visual direction with a fashion-forward image.',
      tags: ['Brand Identity', 'Fashion', 'Art Direction'],
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      year: '2023',
      goal: 'Develop a fashion-focused identity with strong contrast and a premium editorial feel.',
      results: 'The presentation worked across posters, social tiles, and brand mockups without losing clarity.',
      overview: 'A monochrome concept that highlights figure, fabric, and atmosphere through composition.',
      detailImages: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'
      ],
      link: '#'
    }
  ],
  achievements: [
    {
      id: 1,
      title: 'Got The IEEE Start Award',
      year: 2023
    },
    {
      id: 2,
      title: '1st Position - Web Design Competition by Hack TechSociety',
      year: 2023
    },
    {
      id: 3,
      title: '1st Position - Photography Competition by Photonics Society, Chandigarh University',
      year: 2023
    }
  ],
  toolbox: [
    { id: 1, name: 'Figma', image: '/Figma.png' },
    { id: 2, name: 'VS Code', image: '/VSCode.png' },
    { id: 3, name: 'ChatGPT', image: '/Chatgpt.png' },
    { id: 4, name: 'Photoshop', image: '/Photoshop.png' },
    { id: 5, name: 'Canva', image: '/Canva.png' },
    { id: 6, name: 'IntelliJ', image: '/IntelliJ_IDEA.png' },
    { id: 7, name: 'MongoDB', image: '/MongoDB.png' }
  ],
  testimonials: [
    {
      id: 1,
      name: 'UX Anudeep',
      role: 'UX GYM Founder & Mentor',
      testimonial: 'One of the most important reasons someone should hire Piyush is that he has an insane amount of attention to detail. Whatever he delivers, he goes very deep into it and that depth is clearly reflected in his thinking, the visuals, everything. You can just give him surface level ideas and he will take you to that depth. You can be pretty confident you don\'t have to handhold every small thing with him.',
      avatar: '👤'
    },
    {
      id: 2,
      name: 'Muhammad Jaseen',
      role: 'Head of Design',
      testimonial: 'Watching Piyush grow from an intern to a creative, accountable, and a problem solver has been impressive. His attention to detail and ability to deliver thoughtful design solutions is truly remarkable.',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Priya Singh',
      role: 'Product Manager',
      testimonial: 'Working with Dip has been an absolute pleasure. His understanding of user needs and ability to translate them into beautiful, functional designs is outstanding. Highly recommend!',
      avatar: '👩'
    }
  ]
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: isMongoDBConnected ? '✅ Connected' : '❌ Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.get('/api/portfolio', (req, res) => {
  res.json(portfolioData);
});

app.get('/api/portfolio/personal', (req, res) => {
  res.json(portfolioData.personal);
});

app.get('/api/portfolio/skills', (req, res) => {
  res.json(portfolioData.skills);
});

app.get('/api/portfolio/projects', async (req, res) => {
  try {
    const now = Date.now();
    
    // Always fetch fresh GitHub projects if cache is stale or empty
    if (!cachedGitHubProjects || now - lastGitHubFetch > GITHUB_CACHE_DURATION) {
      console.log('🔄 Fetching GitHub projects...');
      const gitHubProjects = await getGitHubProjects();
      if (gitHubProjects && gitHubProjects.length > 0) {
        cachedGitHubProjects = gitHubProjects;
        lastGitHubFetch = now;
        console.log('✅ GitHub projects updated:', gitHubProjects.length, 'projects');
      }
    }
    
    // ALWAYS return GitHub projects (never fallback to hardcoded)
    if (cachedGitHubProjects && cachedGitHubProjects.length > 0) {
      res.json(cachedGitHubProjects);
    } else {
      // If GitHub fetch completely failed, try once more
      console.log('⚠️  No cached GitHub projects, attempting fresh fetch...');
      const gitHubProjects = await getGitHubProjects();
      cachedGitHubProjects = gitHubProjects || [];
      lastGitHubFetch = Date.now();
      res.json(cachedGitHubProjects);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return empty array or cached data if available
    res.json(cachedGitHubProjects || []);
  }
});

app.get('/api/portfolio/experience', (req, res) => {
  res.json(portfolioData.experience);
});

app.get('/api/portfolio/education', (req, res) => {
  res.json(portfolioData.education);
});

app.get('/api/portfolio/achievements', (req, res) => {
  res.json(portfolioData.achievements);
});

app.get('/api/portfolio/toolbox', (req, res) => {
  res.json(portfolioData.toolbox);
});

app.get('/api/portfolio/testimonials', (req, res) => {
  res.json(portfolioData.testimonials);
});

// ==================== MESSAGE ENDPOINTS ====================

// Helper function to save message to JSON file (fallback when MongoDB is down)
const saveMessageToFile = (messageData) => {
  try {
    let messages = [];
    if (fs.existsSync(messagesFilePath)) {
      const data = fs.readFileSync(messagesFilePath, 'utf8');
      messages = JSON.parse(data);
    }
    messages.push({
      id: Date.now().toString(),
      ...messageData,
      savedAt: new Date().toISOString()
    });
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    console.log('💾 Message saved to file:', messagesFilePath);
    return true;
  } catch (error) {
    console.error('❌ Error saving message to file:', error.message);
    return false;
  }
};

// GitHub Routes
// GET - Fetch all GitHub projects (with caching)
app.get('/api/github/projects', async (req, res) => {
  try {
    const now = Date.now();
    
    // Refresh if cache is stale or doesn't exist
    if (!cachedGitHubProjects || now - lastGitHubFetch > GITHUB_CACHE_DURATION) {
      const gitHubProjects = await getGitHubProjects();
      if (gitHubProjects) {
        cachedGitHubProjects = gitHubProjects;
        lastGitHubFetch = now;
        console.log('✅ GitHub projects fetched from API');
      }
    }
    
    res.json({
      success: true,
      projects: cachedGitHubProjects || [],
      cached: true,
      lastUpdated: new Date(lastGitHubFetch).toISOString()
    });
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub projects'
    });
  }
});

// GET - Manually refresh GitHub projects
app.get('/api/github/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual GitHub projects refresh triggered');
    cachedGitHubProjects = null; // Clear cache
    lastGitHubFetch = 0;
    
    const gitHubProjects = await getGitHubProjects();
    if (gitHubProjects) {
      cachedGitHubProjects = gitHubProjects;
      lastGitHubFetch = Date.now();
      
      res.json({
        success: true,
        message: 'GitHub projects refreshed successfully',
        projectCount: gitHubProjects.length,
        projects: gitHubProjects
      });
    } else {
      throw new Error('Failed to fetch projects from GitHub');
    }
  } catch (error) {
    console.error('GitHub refresh error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Receive and save messages from contact form
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const messageData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      createdAt: new Date()
    };

    // Try to save to MongoDB first
    if (isMongoDBConnected) {
      try {
        const newMessage = new Message(messageData);
        await newMessage.save();
        console.log('✅ Message saved to MongoDB:', newMessage._id);
        // Try to append to Google Sheets (best-effort)
        try {
          await appendRowToSheet(messageData);
        } catch (e) {
          // swallow — already logged inside appendRowToSheet
        }
        return res.status(201).json({
          success: true,
          message: 'Message received successfully',
          data: {
            id: newMessage._id,
            ...messageData
          }
        });
      } catch (dbError) {
        console.error('❌ MongoDB save error:', dbError.message);
        // Fall back to file if MongoDB fails
        isMongoDBConnected = false;
      }
    }

    // Fallback: save to file if MongoDB is down
    if (!isMongoDBConnected) {
      const saved = saveMessageToFile(messageData);
      if (saved) {
        // Try to append to Google Sheets (best-effort)
        try {
          await appendRowToSheet(messageData);
        } catch (e) {}
        return res.status(201).json({
          success: true,
          message: 'Message received! Saving locally...',
          data: messageData
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Failed to save message'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error in message handler:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
});

// GET - Retrieve all messages (admin view)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages'
    });
  }
});

// GET - Retrieve unread messages count
app.get('/api/messages/stats/unread', async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({ isRead: false });
    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error retrieving unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve unread count'
    });
  }
});

// PUT - Mark message as read
app.put('/api/messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID'
      });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update message'
    });
  }
});

// DELETE - Delete a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message ID'
      });
    }

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

// DEBUG: Test Sheets append without submitting the contact form
app.get('/api/test-sheet', async (req, res) => {
  try {
    // Initialize if needed
    initSheetsClient();
    if (!sheetsClient) {
      return res.status(500).json({ success: false, error: 'Google Sheets not configured or keyfile missing' });
    }

    const sample = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test row appended at ' + new Date().toISOString()
    };

    const ok = await appendRowToSheet(sample);
    if (ok) return res.json({ success: true, message: 'Appended test row to sheet' });
    return res.status(500).json({ success: false, error: 'Failed to append to sheet (check server logs)' });
  } catch (err) {
    console.error('Test sheet endpoint error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN: Resend locally saved messages in messages.json to Google Sheets
app.post('/api/resend-messages-to-sheet', async (req, res) => {
  try {
    initSheetsClient();
    if (!sheetsClient) return res.status(500).json({ success: false, error: 'Google Sheets not configured' });

    if (!fs.existsSync(messagesFilePath)) return res.status(404).json({ success: false, error: 'No messages.json file found' });

    const data = fs.readFileSync(messagesFilePath, 'utf8');
    const messages = JSON.parse(data || '[]');
    let appended = 0;
    for (const m of messages) {
      const ok = await appendRowToSheet({ name: m.name, email: m.email, message: m.message });
      if (ok) appended++;
      // small delay to avoid quota bursts
      await new Promise(r => setTimeout(r, 200));
    }

    res.json({ success: true, appended, total: messages.length });
  } catch (err) {
    console.error('Resend messages error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Initialize GitHub projects cache on startup
  console.log('🔄 Initializing GitHub projects cache...');
  const gitHubProjects = await getGitHubProjects();
  if (gitHubProjects && gitHubProjects.length > 0) {
    cachedGitHubProjects = gitHubProjects;
    lastGitHubFetch = Date.now();
    console.log(`✅ Loaded ${gitHubProjects.length} GitHub projects from @${GITHUB_USERNAME}`);
  } else {
    console.log('⚠️ Failed to load GitHub projects on startup');
  }
});
