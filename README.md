# Public Event Calendar

A modern, responsive event calendar with Discord server integration and public sharing capabilities.

## Features

- 📅 Interactive monthly calendar view
- ➕ Add events with name, Discord server, date, and time
- 🔗 Public calendar sharing via URL
- 💾 Local storage for event persistence
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🚀 Vercel-ready deployment

## Quick Start

### Local Development

1. Clone or download this repository
2. Navigate to the project directory
3. Run the local server:

```bash
python -m http.server 8000
```

4. Open `http://localhost:8000` in your browser

### Vercel Deployment

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### Option 2: Vercel Dashboard
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Deploy with one click

## Usage

1. **Add Events**: Click any date on the calendar or use the "Add Event" button
2. **Fill Details**: Enter event name, Discord server, date, and time
3. **Share Calendar**: Use the "Share Calendar" button to get a public link
4. **Manage Events**: View upcoming events and delete as needed

## Project Structure

```
event-calendar/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
└── README.md          # Documentation
```

## Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - No dependencies required
- **Font Awesome** - Icons
- **LocalStorage API** - Client-side data persistence

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## License

MIT License - feel free to use this project for personal or commercial purposes.
