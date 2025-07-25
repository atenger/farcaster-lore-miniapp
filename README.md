# Farcaster Lore MiniApp

A Farcaster MiniApp that displays all the casts mentioned on GM Farcaster episodes. Built with Next.js and designed to be embedded within Farcaster or TBA or used as a standalone web app.

---

## 🧱 Project Structure

```
farcaster-lore-miniapp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── casts/
│   │   │   │   ├── search/
│   │   │   │   │   └── route.ts          # Cast search API
│   │   │   │   └── index/
│   │   │   │       └── route.ts          # Cast index API
│   │   │   └── episodes/
│   │   │       └── [videoId]/
│   │   │           └── route.ts          # Episode data API
│   │   ├── leaderboard/
│   │   │   └── page.tsx                  # Main leaderboard page
│   │   └── layout.tsx
│   ├── components/                       # Reusable UI components
│   ├── lib/                             # Utility functions
│   └── data/                            # Data files (not public)
│       ├── casts_index.json             # Lightweight cast index
│       └── episodes/                    # Episode-specific data
│           ├── Episode_VIDEOID1.json
│           └── Episode_VIDEOID2.json
├── public/                              # Static assets
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone this repo
```bash
git clone https://github.com/atenger/farcaster-lore-miniapp.git
cd farcaster-lore-miniapp
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Add your data files
Place your data files in the `src/data/` directory:

- `casts_index.json` - Lightweight index of all casts
- `episodes/Episode_*.json` - Enriched data for each episode

### 4. Run locally
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📊 Data Architecture

The app uses a two-tier data structure for optimal performance:

### Cast Index (`casts_index.json`)
Lightweight catalog of all casts with basic metadata:
```json
{
  "cast_hash": "0x5ae4c143",
  "url": "https://farcaster.xyz/sqx/0x5ae4c143",
  "author_username": "sqx",
  "show_date": "2025-07-24",
  "show_title": "GM Farcaster ep269 Wednesday July 23, 2025",
  "source_episode_id": "thsYOpMZbC0"
}
```

### Episode Files (`Episode_VIDEOID.json`)
Enriched data for each episode containing detailed cast information, engagement metrics, and context.

---

## 🖥 Features

### Current (MVP)
- 📋 Display all casts in a searchable grid layout
- 🔍 Search and filter by FID, username, or date
- 🔗 Direct links to original Farcaster posts
- 📱 Responsive design for mobile and desktop
- ⚡ Fast loading with progressive data enrichment

### Planned
- 📱 Farcaster MiniApp integration
- 🎨 Enhanced UI with cast previews

---

## 🛠 Built With

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Farcaster SDK](https://docs.farcaster.xyz/)** - Farcaster integration
- **[Neynar React](https://docs.neynar.com/)** - MiniApp framework

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npm run deploy:vercel
```

### Manual Deployment
```bash
npm run build
npm run start
```

---

## 🧠 Context

This MiniApp is part of the "Farcaster Lore" project - a comprehensive archive of Farcaster's history through the lens of GM Farcaster episodes. It works alongside the `farcaster-lore-database` project to create a browsable database of all conversation and context surrounding Farcaster's development.

The app serves as both a standalone web application and a Farcaster MiniApp that can be embedded within Warpcast.

---

## 🔧 Development

### API Routes
- `GET /api/casts/search` - Search and filter casts
- `GET /api/casts/index` - Get cast index data
- `GET /api/episodes/[videoId]` - Get episode-specific data

### Environment Variables
```env
NEXT_PUBLIC_URL=http://localhost:3000
NEYNAR_API_KEY=your_api_key
NEYNAR_CLIENT_ID=your_client_id
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

Maintained by the GM Farcaster team.

Built with ❤️ for the Farcaster community.
