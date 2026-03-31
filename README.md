# Smart Expense Splitter

## Overview
A lightweight web application to manage and split shared expenses among groups.

Built under a strict 24-hour constraint with focus on:
- correct balance computation
- clean system design
- real-time usability
- reliability under edge cases

## Status
Completed (NeevAI Internship Assessment Submission)

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js (Express)
- Database: SQLite
- AI: Groq (llama-3.3-70b-versatile)

## Why this stack?
- SQLite for zero setup and fast iteration
- Express for minimal and predictable API layer
- React for simple state-driven UI
- Groq for fast and free AI inference

## Trade-offs
- No production-grade DB (PostgreSQL)
- No authentication
- UI kept minimal to prioritize correctness

## Features
- Create groups and add members
- Add expenses with automatic equal splitting
- Real-time balance calculation
- View who owes whom
- AI-powered expense categorization
- Fallback handling for AI failures

## AI Feature
Expense categorization is powered using Groq API.

Examples:
- "dinner" → Food
- "uber ride" → Travel
- "buying sneakers" → Shopping

## Reliability
- If AI works → category from model
- If API fails → fallback logic

## Balance Calculation Strategy
Each user maintains a net balance:
- Positive → should receive money
- Negative → owes money

For each expense:
- Payer balance increases
- Participants balances decrease

## Rounding Handling
- Values rounded to 2 decimals
- Last user absorbs difference

## System Flow
1. Create group
2. Add members
3. Add expense
4. Auto split
5. Balances update
6. AI categorizes

## Edge Cases
- Floating precision
- Empty groups
- Invalid inputs
- AI failure fallback

## Out of Scope
- Authentication
- Advanced UI
- Docker

## Setup Instructions

Backend:
cd backend  
npm install  
create .env file  
GROQ_API_KEY=your_api_key  
npx nodemon server.js  

Frontend:
cd frontend  
npm install  
npm run dev  

## Deployment
Frontend → Vercel  
Backend → Render  

## Demo
Shows:
- group creation
- expense flow
- balance updates
- AI categorization

## Final Notes
Focus was on correctness, reliability, and complete system flow rather than UI polish.