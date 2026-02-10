# Musab Ahmed Khan - Portfolio

A modern, professional portfolio website built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Dark Mode**: Elegant theme toggle with smooth transitions
- **JSON-Driven Content**: All content managed through JSON files - no code changes needed
- **Project Filtering**: Smart tag-based filtering system
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Professional animations using Framer Motion
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Zero Maintenance**: Update content by editing JSON files only

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

### Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

### Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 📝 Content Management

All content is managed through JSON files in `src/data/`:

### Update Profile Information
Edit `src/data/profile.json`:
```json
{
  "name": "Your Name",
  "title": "Your Title",
  "bio": "Your bio...",
  ...
}
```

### Add a New Project
Edit `src/data/projects.json`:
```json
{
  "id": "unique-id",
  "title": "Project Name",
  "description": "Project description...",
  "tech": ["React", "Node.js"],
  "tags": ["Web", "AI"],
  ...
}
```

### Add Experience
Edit `src/data/experience.json`

### Add Research Publications
Edit `src/data/publications.json`

### Add Awards, Grants & Scholarships
Edit `src/data/awards.json`

### Add Workshops & Training
Edit `src/data/workshops.json`

### Add Certificates
Edit `src/data/certificates.json`

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    DEFAULT: '#3B82F6', // Change this
    dark: '#60A5FA',    // And this
  },
  ...
}
```

### Fonts
Change the font in `index.html` (Google Fonts link) and `tailwind.config.js`.

## 📁 Project Structure

```
portfolio/
├── public/               # Static assets
│   ├── favicon.svg
│   └── projects/         # Project images
├── src/
│   ├── components/       # React components
│   ├── data/            # JSON content files
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons

## 📦 Deployment

This portfolio is configured for GitHub Pages deployment:

1. Make sure your repository is named `<username>.github.io`
2. Run `npm run deploy`
3. Your site will be live at `https://<username>.github.io`

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Found a bug or have a suggestion? Open an issue or submit a pull request!

---

Built with ❤️ by Musab Ahmed Khan
