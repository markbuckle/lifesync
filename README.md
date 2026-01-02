# LifeSync - AI-Powered Life Management Platform

A full-stack portfolio project demonstrating product design and software development skills through an intelligent life management platform.

## Overview

LifeSync consolidates appointments, tasks, projects, and calendar management into a single platform, powered by an AI assistant that helps users stay organized like a personal CEO assistant.

## Target Roles

This project showcases skills for:
- **Product Designer** - UX/UI design, design systems, complex workflows
- **Full-Stack Developer** - React, TypeScript, Python, GraphQL, cloud deployment

## Core Features

- **Smart Dashboard** - Unified view of appointments, tasks, and projects
- **Appointment Booking** - Schedule and manage appointments with reminders
- **Task Management** - Create, prioritize, and track tasks with AI assistance
- **Project Tracker** - Monitor project progress with milestones and timelines
- **AI Assistant** - Natural language interaction for task creation, scheduling, and insights
- **Calendar Integration** - Comprehensive calendar views with smart scheduling

## Tech Stack

### Frontend
- React 18 + TypeScript
- Webpack 5
- Tailwind CSS (Function Health-inspired design)
- Apollo Client (GraphQL)
- Jest + Playwright (testing)

### Backend
- Python 3.11+ with FastAPI
- Strawberry GraphQL
- PostgreSQL (Cloud SQL) - structured data
- Firestore - NoSQL for AI conversations and logs
- Docker containerization

### Infrastructure
- Frontend: Vercel
- Backend: Google Cloud Run
- Database: Cloud SQL (PostgreSQL) + Firestore
- CI/CD: Cloud Build + GitHub Actions
- Container Registry: Google Artifact Registry

## Architecture
```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Vercel)                  │
│            React + TypeScript + Tailwind            │
│                  Apollo Client                      │
└────────────────────┬────────────────────────────────┘
                     │ GraphQL API
                     │
┌────────────────────▼────────────────────────────────┐
│              BACKEND (Cloud Run)                    │
│           Python FastAPI + Strawberry               │
│                                                     │
│  ┌──────────────────┐      ┌────────────────────┐   │
│  │  Cloud SQL       │      │    Firestore       │   │
│  │  (PostgreSQL)    │      │    (NoSQL)         │   │
│  │  - Users         │      │  - AI chats        │   │
│  │  - Appointments  │      │  - Activity logs   │   │
│  │  - Tasks         │      │  - Sessions        │   │
│  │  - Projects      │      └────────────────────┘   │
│  └──────────────────┘                               │
└─────────────────────────────────────────────────────┘
                     │
                     │ API calls
                     │
            ┌────────▼────────┐
            │  Anthropic      │
            │  Claude API     │
            │  (AI Assistant) │
            └─────────────────┘
```
## Design Philosophy

- **Warm & Approachable** - Function Health-inspired terracotta color palette
- **Clean & Organized** - GitHub/Notion-inspired layouts
- **AI-First** - Natural language interaction throughout
- **Focus-Friendly** - Collapsible navigation, distraction-free modes

## DevOps

### Merge Staging → Main

#### Step 1: Make sure staging is clean and pushed
Switch to staging
`git checkout staging`

Check status
`git status`

If you have uncommitted changes, commit them
`git add .`
`git commit -m "your message"`

Push to GitHub
`git push origin staging`

#### Step 2: Switch to main and merge
Switch to main branch
`git checkout main`

Pull latest main (in case there are any changes)
`git pull origin main`

Merge staging into main
`git merge staging`

#### Step 3: Push main to GitHub
Push the merged main branch
`git push origin main`

## Development Timeline

8-week sprint (part-time, ~20 hrs/week):
- **Weeks 1-3:** Research, design system, wireframes, high-fidelity mockups
- **Weeks 4-5:** Frontend foundation, component library
- **Weeks 6-7:** Backend API, database, AI integration
- **Week 8:** Testing, documentation, deployment

## Project Status

🚧 **In Progress** - Currently in Week 1 (Research & Design)

## Deployment

- **Staging:** TBD
- **Production:** TBD

---

**Note:** This is a portfolio/demonstration project. Not intended for production use.
