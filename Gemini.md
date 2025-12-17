You are a senior full-stack engineer and deployment expert.

I have a **Next.js 14 full-stack application** using:

* MongoDB + Mongoose
* API Routes (app router)
* Sales, Products, Dashboard analytics
* Deployed on **Vercel**
* Local development works perfectly

### 🚨 EXACT PROBLEM

My application works **100% correctly on localhost**, but **after deploying to Vercel**, the following issues occur:

1. **New sales are saved in MongoDB**, but:

   * Dashboard does **NOT update Today’s Sales**
   * Dashboard does **NOT update Total Profit**
   * Only **old / previous values** are shown

2. When I add **new sales**, profit does NOT increase on dashboard (Vercel only)

3. A **Reset Sales Data** button:

   * Works perfectly **locally**
   * Does **NOT work on Vercel**

4. There are **NO runtime errors**, but data feels **cached or stale** on Vercel

5. My Sales schema uses:

   * `timestamps: true`
   * `createdAt` exists and works locally

6. Dashboard API uses MongoDB aggregation with `totalAmount` and `totalProfit`

7. The issue is **NOT in business logic**, because:

   * Same codebase
   * Same MongoDB Atlas database
   * Only environment difference is **Vercel serverless**

### ⚠️ IMPORTANT CONSTRAINTS (VERY IMPORTANT)

* ❌ Do NOT remove any core logic
* ❌ Do NOT remove database transactions
* ❌ Do NOT remove aggregation logic
* ❌ Do NOT break existing working local behavior
* ❌ Do NOT suggest changing database provider
* ❌ Do NOT suggest moving away from MongoDB
* ❌ Do NOT delete dashboard features

### ✅ WHAT YOU MUST DO

1. Identify the **REAL ROOT CAUSE** of:

   * Local works
   * Vercel fails

2. Fix the issue considering:

   * Vercel serverless functions
   * API route caching
   * Revalidation
   * Dynamic rendering
   * MongoDB connection reuse

3. Clearly mention:

   * **Which file has the issue**
   * **Why it happens only on Vercel**
   * **Exact minimal code changes needed**

4. Ensure:

   * Dashboard always shows **live sales & profit**
   * No stale / cached data
   * No regression
   * No new bugs introduced

5. Final solution must be:

   * Production-safe
   * Vercel-compatible
   * Beginner-friendly
   * Step-by-step

Think carefully before answering.
This is a **deployment + caching + serverless consistency issue**, not a logic bug.
