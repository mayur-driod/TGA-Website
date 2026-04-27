<div align="center">

<!-- Replace with your actual logo -->
<img src="public/assets/logo/TGA_Main_Logo_with_colour.jpeg" alt="Green Alliance Logo" width="120" />

# Green Alliance

**A student-led environmental initiative — connecting campus communities to nature, science, and action.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[🌐 Live Site](#) · [📸 Screenshots](#screenshots) · [🐛 Report a Bug](issues) · [✨ Request a Feature](issues)

<img width="1470" height="883" alt="Screenshot 2026-04-27 at 10 38 48 AM" src="https://github.com/user-attachments/assets/abb4610e-1083-4460-9cb8-52bb0807d1d2" />

</div>

---

## 🌍 What is Green Alliance?

**Green Alliance Website** is a student-driven platform built to bring environmental awareness, biodiversity data, and eco-action together in one place. Whether you're a fellow student passionate about wildlife, a faculty member tracking campus biodiversity, or a curious visitor — Green Alliance is your digital hub for everything green on campus.

The platform integrates real-world biodiversity data from **iNaturalist** and **eBird**, allows users to explore species sightings on an interactive globe, read campaign blogs, register for eco-events, and volunteer for local initiatives — all with a clean, modern interface.

> *"Think globally, act locally."* — Green Alliance was built on this principle.

---

## ✨ Features

### 🗺️ Interactive Biodiversity Globe
An immersive **3D globe powered by Globe.js** that visualizes real-time species sightings sourced from iNaturalist and eBird APIs. Explore what's been spotted on and around your campus, from birds to butterflies.

### 📋 Biodiversity Assessment Reports
Generate and browse structured **biodiversity assessment reports** for campus ecosystems — tracking species richness, sighting trends, and conservation status over time.

### 🐦 iNaturalist & eBird Integration
Live data pulled from community science platforms — putting real field observations from naturalists and birders directly into the hands of students.

### 📅 Events & Campaigns
Browse and register for upcoming eco-drives, tree plantations, clean-up campaigns, nature walks, and awareness events organized by the club.

### 📰 Blog & News
A curated space for articles, field notes, environmental news, and student-written pieces on sustainability, wildlife, and green living.

### 🙋 Volunteer & Membership Sign-Up
Students can sign up to volunteer for initiatives or become formal members of the Green Alliance — with email confirmations powered by **Nodemailer**.

### 🖼️ Media & Image Management
Rich media uploads with **Cloudinary** integration and in-app image cropping via **react-easy-crop** — for event galleries, blog covers, and species photo submissions.

### 🔐 Authentication
Secure sign-in and sign-up flows built with **NextAuth.js**, supporting credential-based and OAuth authentication.

### 🛠️ Admin Dashboard
A dedicated admin panel for managing events, blog posts, volunteer registrations, and member data — with role-based access control.

### 👥 Team & About Pages
Showcasing the people behind the initiative, the club's mission, and its journey.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) |
| **Database ORM** | [Prisma](https://www.prisma.io/) |
| **Caching** | Redis |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Image Storage** | [Cloudinary](https://cloudinary.com/) |
| **Image Cropping** | react-easy-crop |
| **Email** | Nodemailer |
| **Globe Visualization** | Globe.js |
| **Validation** | Zod |
| **Biodiversity Data** | iNaturalist API + eBird API |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A running PostgreSQL (or your configured) database
- A Redis instance (local or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/green-alliance.git
cd green-alliance
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/green_alliance"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# Nodemailer (e.g. Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# iNaturalist / eBird
INATURALIST_API_KEY="your-key"
EBIRD_API_KEY="your-key"
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app. 🌱

---

## 📁 Project Structure

```
green-alliance/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Auth routes (sign-in, sign-up)
│   ├── admin/              # Admin dashboard
│   ├── blog/               # Blog & news
│   ├── events/             # Events & campaigns
│   ├── globe/              # Interactive biodiversity globe
│   ├── reports/            # Biodiversity assessment reports
│   ├── team/               # Team page
│   ├── volunteer/          # Volunteer & membership sign-up
│   └── about/              # About page
├── components/             # Reusable UI components (shadcn + custom)
├── lib/                    # Utility functions, Prisma client, auth config
├── prisma/                 # Prisma schema & migrations
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

---

## 📸 Screenshots

> *Coming soon — add screenshots of the globe, dashboard, blog, and events pages here.*

---

## 🌱 Roadmap

- [ ] Species sighting submission by users
- [ ] Push notifications for upcoming events
- [ ] Multilingual support
- [ ] Carbon footprint tracker
- [ ] Integration with Google Scholar for campus eco-research
- [ ] Mobile app (flutter)

---

## 🤝 Contributing

This is currently a solo project, but contributions, suggestions, and feedback are always welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please make sure your code follows the existing style and passes all checks.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💚 Acknowledgements

- [iNaturalist](https://www.inaturalist.org/) — community biodiversity data
- [eBird](https://ebird.org/) — bird sighting data by Cornell Lab
- [Globe.gl](https://globe.gl/) — 3D globe visualization
- [shadcn/ui](https://ui.shadcn.com/) — beautiful accessible components
- Every student who showed up for the planet 🌍

---

<div align="center">

Made with 💚 by **@mayur-driod** · The Green Alliance Initiative

</div>
