# Spotify Playlist Analyzer

A modern web application that analyzes Spotify playlists to provide deep insights and visualizations. Built with React, Vite, Supabase, and Clerk.

## Features

- **Playlist Analysis:** Input any Spotify playlist URL to get detailed analysis.
- **Visual Insights:** Interactive charts and data visualizations powered by Recharts.
- **Secure Authentication:** User authentication managed by Clerk.
- **Data Persistence:** User data and analysis history stored in Supabase.
- **Modern UI:** Beautiful and responsive interface built with Shadcn UI and Tailwind CSS.

## Tech Stack

- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **State Management:** TanStack Query
- **Authentication:** Clerk
- **Backend/Database:** Supabase (Database & Edge Functions)
- **Charts:** Recharts
- **Icons:** Lucide React

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/) installed.
- A [Clerk](https://clerk.com/) account for authentication.
- A [Supabase](https://supabase.com/) account for the database and backend logic.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```

    Or using Bun:
    ```bash
    bun install
    ```

## Configuration

1.  **Environment Variables:**

    Copy the example environment file to create your local `.env` file:

    ```bash
    cp .env.example .env
    ```

2.  **Update `.env`:**

    Open the `.env` file and fill in your credentials from Clerk and Supabase:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
    ```

## Running the Application

Start the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:8080](http://localhost:8080) (or the port shown in your terminal) to view the application in your browser.

## Building for Production

To create a production build:

```bash
npm run build
# or
bun run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

You can easily deploy this project for free using **Vercel** or **Netlify**.

### Deploying to Vercel (Recommended)

1.  **Push to GitHub:** Ensure your code is pushed to a GitHub repository.
2.  **Import into Vercel:**
    -   Log in to [Vercel](https://vercel.com/).
    -   Click "Add New..." -> "Project".
    -   Import your GitHub repository.
3.  **Configure Build Settings:**
    -   Framework Preset: **Vite**
    -   Build Command: `npm run build` (default)
    -   Output Directory: `dist` (default)
4.  **Add Environment Variables:**
    -   In the "Environment Variables" section, add all the keys from your `.env` file:
        -   `VITE_SUPABASE_URL`
        -   `VITE_SUPABASE_PUBLISHABLE_KEY`
        -   `VITE_CLERK_PUBLISHABLE_KEY`
        -   `VITE_SUPABASE_PROJECT_ID`
5.  **Deploy:** Click "Deploy". Vercel will build and host your site.

### Deploying to Netlify

1.  **Push to GitHub.**
2.  **Import into Netlify:**
    -   Log in to [Netlify](https://www.netlify.com/).
    -   Click "Add new site" -> "Import from existing project".
    -   Connect to GitHub and select your repository.
3.  **Configure Build Settings:**
    -   Build Command: `npm run build`
    -   Publish directory: `dist`
4.  **Add Environment Variables:**
    -   Go to "Site configuration" -> "Environment variables".
    -   Add the keys and values from your `.env` file.
5.  **Deploy:** Click "Deploy site".

### Note on Backend (Supabase)

This application relies on Supabase Edge Functions (specifically `spotify-playlist`) for backend logic. If you are deploying your own instance, you must also deploy the edge functions to your Supabase project using the Supabase CLI:

```bash
supabase functions deploy spotify-playlist
```

Ensure your Supabase project is set up with the necessary database schema and policies.
