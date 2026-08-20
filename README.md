# DinnerTalk — Recipe Sharing + Group Chat + Timed Polls (MERN)

## Stack
MongoDB, Express, React, Node.js + Socket.io (real-time) + Web Push (notifications)

## Features
- Register/Login (JWT + bcrypt)
- CRUD recipes — category, ingredients, steps, cook time, servings, image, likes
- Browse all users' recipes, filter by category, search
- **Groups**: see all registered members, create multiple groups (cousins, parents, friends...), each with its own chat
- **Group chat**: real-time messaging, share any recipe directly into a chat
- **Dinner polls**: pick 2+ recipes, set a custom duration, live vote counts, auto-closes on expiry
- **Reminders**: in-app banner + browser push when a poll is about to end — skipped for anyone who already voted
- Polls appear inline in the chat feed like a message

## Local Setup

### Backend
```
cd backend
cp .env.example .env
npm install
npx web-push generate-vapid-keys     # paste output into VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY in .env
npm run dev
```

### Frontend
```
cd frontend
cp .env.example .env
npm install
npm start
```

## Deploying (so family can use it on phones)

### Backend → Render (or Railway)
1. Push this repo to GitHub.
2. New Web Service on Render → connect repo → root dir `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add env vars: `MONGO_URI` (use MongoDB Atlas, free tier), `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL), `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
   A `render.yaml` is included for one-click config.

### Frontend → Vercel (or Netlify)
1. Import the repo → root dir `frontend`.
2. Env vars: `REACT_APP_API_URL=https://your-backend.onrender.com/api`, `REACT_APP_SOCKET_URL=https://your-backend.onrender.com`.
3. Deploy. `vercel.json` is included for SPA routing.

### Database → MongoDB Atlas (free tier)
1. Create a free cluster at mongodb.com/atlas.
2. Get the connection string, put it in backend's `MONGO_URI`.
3. Whitelist `0.0.0.0/0` (or Render's IPs) in Atlas Network Access.

Once both are live, open the Vercel URL on any phone browser — works like an app (add to home screen for app-like icon).

## Folder Structure
```
backend/
  config/ (db.js, push.js)
  jobs/pollScheduler.js          <- cron: reminders + auto-close
  middleware/ (authMiddleware, groupMiddleware)
  models/ (User, Recipe, Message, Poll, Group, PushSubscription)
  routes/ (authRoutes, recipeRoutes, messageRoutes, pollRoutes, groupRoutes, pushRoutes)
  server.js
frontend/
  public/service-worker.js        <- handles push notifications
  src/
    components/ (Navbar, RecipeCard, PrivateRoute, PollWidget, CreatePollForm)
    pages/ (Login, Register, Recipes, MyRecipes, RecipeDetail, RecipeForm, Groups, Chat)
    context/AuthContext.js
    utils/ (api.js, socket.js, push.js)
```

## API Summary
- Auth: POST /api/auth/register, /login · GET /api/auth/me
- Recipes: GET/POST /api/recipes · GET/PUT/DELETE /api/recipes/:id · GET /api/recipes/mine · PUT /api/recipes/:id/like
- Groups: GET /api/groups/members · GET/POST /api/groups · GET /api/groups/:id · PUT /api/groups/:id/members · DELETE /api/groups/:id
- Messages: GET /api/messages/:groupId · POST /api/messages
- Polls: GET /api/polls/:groupId · POST /api/polls · PUT /api/polls/:id/vote · PUT /api/polls/:id/close
- Push: GET /api/push/vapid-public-key · POST /api/push/subscribe · POST /api/push/unsubscribe

## Next Suggestions
- Add image upload (multer + Cloudinary) instead of image URL field
- "Recipe of the week" auto-poll via cron
- Typing indicators in chat
- Redis adapter for Socket.io if scaling past one server instance
