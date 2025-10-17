# Modern CRS Calculator

A lightweight, modern Comprehensive Ranking System (CRS) calculator for Canadian Express Entry immigration, built with Preact, Tailwind CSS, and Vite.

## Features

- ✅ **Complete CRS Implementation** - All scoring factors from the official IRCC system
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Lightweight** - Bundle size under 15KB gzipped
- 🎨 **Modern UI** - Clean, intuitive interface with real-time calculations
- 🔢 **Accurate Calculations** - Based on the official CRS scoring tables
- 🛠 **No Heavy Frameworks** - Uses lightweight Preact instead of React
- 📊 **Detailed Breakdown** - Shows points for each section and factor

## Technology Stack

| Layer | Technology | Size | Purpose |
|-------|-------------|------|---------|
| Framework | Preact | ~3 KB gzipped | Component model, hooks |
| Validation | Zod | ~2 KB gzipped | Form validation and schema |
| Styling | Tailwind CSS | ~3 KB gzipped | Utility-first CSS |
| Bundler | Vite | N/A | Fast development and optimized builds |
| Total | - | **~23 KB gzipped** | Complete calculator |

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3001)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production files are generated in the `dist/` folder and are ready for deployment.

## Deployment

### WordPress Integration

1. Copy the `dist/` folder to your WordPress theme or plugin directory
2. Add the following to your theme's `functions.php`:

```php
function crs_enqueue() {
    wp_enqueue_script('crs-app', get_stylesheet_directory_uri() . '/dist/assets/index-[hash].js', [], null, true);
    wp_enqueue_style('crs-style', get_stylesheet_directory_uri() . '/dist/assets/index-[hash].css');
}

function crs_shortcode($atts) {
    crs_enqueue();
    return '<div id="crs-root"></div>';
}

add_shortcode('modern_crs_calculator', 'crs_shortcode');
```

3. Use the shortcode in any post or page:
```
[modern_crs_calculator]
```

### Static Site Hosting

The `dist/` folder contains a complete static site that can be hosted on:
- Netlify
- Vercel
- GitHub Pages
- Any static web server

## CRS Scoring Factors

The calculator implements all official CRS scoring factors:

### Section A: Core Human Capital Factors (Max 500 points)
- **Age** (17-44 years)
- **Education** (8 levels)
- **First Language** (CLB levels for IELTS, CELPIP, TEF, TCF)
- **Second Language** (Optional)
- **Canadian Work Experience** (0-5+ years)

### Section B: Spouse/Common-law Partner Factors (Max 40 points)
- Spouse Education
- Spouse Language Skills
- Spouse Canadian Experience

### Section C: Skill Transferability Factors (Max 100 points)
- Education + Language combinations
- Education + Experience combinations
- Foreign Experience + Canadian Experience

### Section D: Additional Points
- Provincial Nomination (600 points)
- Canadian Education (15-30 points)
- Family in Canada (15 points)
- French Language Skills (25 points)

> **Note:** As of March 25, 2025, arranged employment points (50-200 points) were eliminated from the CRS system. Job offers with LMIA no longer provide additional points.

## Project Structure

```
modern-crs-calculator/
├─ src/
│  ├─ App.jsx              # Main application component
│  ├─ crsLogic.js          # CRS calculation logic
│  ├─ main.jsx             # Application entry point
│  └─ styles.css           # Tailwind CSS styles
├─ dist/                   # Production build output
├─ index.html              # HTML template
├─ package.json            # Project configuration
├─ tailwind.config.js      # Tailwind CSS configuration
├─ postcss.config.js       # PostCSS configuration
└─ vite.config.js          # Vite bundler configuration
```

## Validation & Accuracy

The calculator uses Zod schemas for input validation and implements the official IRCC scoring tables:

- Age points based on exact age ranges
- Education levels matching IRCC classifications
- Language test conversions for all approved tests
- Work experience calculations for Canadian and foreign experience
- Skill transferability factors with proper combinations
- Additional points for provincial nominations and other factors

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with ES2020 support

## Contributing

This calculator is based on the official IRCC Comprehensive Ranking System. When IRCC updates the scoring tables, update the calculation functions in `src/crsLogic.js`.

## License

ISC License - Feel free to use and modify for your needs.

## Disclaimer

This calculator provides estimates based on publicly available CRS scoring information. Official scores may vary based on individual circumstances and IRCC policy changes. Always consult official IRCC resources for the most accurate information.