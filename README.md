# IoT Admin Console

A premium, production-ready admin dashboard tailored for managing Internet of Things (IoT) infrastructure. Built with React and Vite, this console features a dark-mode glassmorphism aesthetic, robust authentication scaffolding, and highly interactive data visualizations.

## 🌟 Key Features

*   **Authentication Flow**: Complete login and session management simulated using React Context and `sessionStorage`. All internal routes are guarded by a `ProtectedRoute`.
*   **Dynamic Dashboard**: Real-time traffic, active node tracking, and simulated server uptime metrics using `Recharts`.
*   **Global Command Palette**: Press `Ctrl+K` or `Cmd+K` anywhere in the app to open an intelligent, keyboard-navigable search menu to access pages and quick actions instantly.
*   **Device & User Directories**: Extensive data tables for managing physical gateway fleets and team member permissions. Includes inline-editing, status toggling, and broadcast email capabilities.
*   **Security & Governance**: Interface for adjusting firewall rules, generating API keys, and monitoring critical access events.
*   **Admin Modals**: Custom-built, animated modals for:
    *   **System Health**: Polling-based live server resource metrics.
    *   **Team Settings**: Advanced user provisioning and role management.
    *   **Help & Feedback**: Built-in support desk and feedback submission pipeline.
*   **Fully Responsive**: Meticulously designed to function flawlessly on both 4K desktop monitors and mobile devices without horizontal scrolling or overlap.

## 🛠 Tech Stack

*   **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
*   **Component Library**: [HeroUI](https://heroui.com/) (formerly NextUI)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

Ensure you have Node.js installed, then clone the repository and run:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## 🔐 Demo Credentials

To access the locked-down dashboard, use the following simulated credentials on the `/login` screen:

*   **Email**: `admin` or `admin@iot-console.com`
*   **Password**: `admin`

## 🎨 Design Philosophy

This project uses a "Glassmorphism" aesthetic. The `index.css` is configured with comprehensive `.glass` utility classes combined with custom translucent Tailwind backgrounds (e.g. `bg-black/40`, `bg-white/5`) to create a deep, layered, and visually striking interface.

## ♿ Accessibility

The application is built with modern accessibility standards in mind:
*   Semantic HTML (`main`, `nav`, `aside`).
*   `aria-labels` and screen-reader only (`sr-only`) utilities for icon buttons.
*   `prefers-reduced-motion` media queries applied to keyframe animations.
*   Keyboard focus rings (`focus-visible`) globally configured in CSS.
*   Skip-to-nav links implemented for power users.
