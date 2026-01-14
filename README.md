# JOB PORTAL

A comprehensive job portal application with video interview capabilities powered by ZEGOCLOUD.

## Features

- Job posting and browsing
- Application management
- Video interviews via ZEGOCLOUD
- User authentication with Clerk
- Database integration with Supabase

## Video Interview Integration

The application includes integrated video interviews using ZEGOCLOUD:

- One-on-one interview calls
- Professional video interface
- Interview status tracking
- Automatic call logging

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your credentials
4. Run the development server: `npm run dev`

### Environment Variables

You need to configure the following environment variables in your `.env` file:

- `VITE_ZEGOCLOUD_APP_ID` - Your ZEGOCLOUD App ID
- `VITE_ZEGOCLOUD_SERVER_SECRET` - Your ZEGOCLOUD Server Secret
- `VITE_SUPABASE_URL` - Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase Anon Key
- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk Publishable Key

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` 
