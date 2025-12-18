You are a senior full-stack engineer working on a Next.js 14 + MongoDB (Mongoose) inventory management system.

PROJECT CONTEXT:
- This is a Stationery Inventory & Sales Management System.
- Backend uses Next.js App Router API routes.
- Database is MongoDB using Mongoose.
- Project works perfectly in local development.
- After deployment (Vercel), there were issues previously, so be EXTRA careful.
- Do NOT remove any existing logic or important features.
- Do NOT break existing APIs, calculations, or dashboard logic.

CLIENT REQUIREMENT:
The client wants:
1) Every product must have a unique, human-readable product number (SKU / Item Code).
2) The product number must be stored in the database.
3) Users must be able to search products ONLY by this product number.
4) When the product number is searched, the matching product(s) must appear instantly.

STRICT RULES:
- No breaking changes.
- No unnecessary refactoring.
- No removal of existing fields.
- No change in current database connection logic.
- No removal of dashboard, sales, or profit logic.
- All changes must be backward-compatible.
- Code must be production-safe and deployment-safe.

TASKS TO IMPLEMENT STEP-BY-STEP:

1) Update the Product Mongoose schema:
   - Add a new field `productNumber`
   - Type: String
   - Required: true
   - Unique: true
   - Indexed for fast search

2) Update product creation logic:
   - Automatically generate `productNumber`
   - Format: PRD-<timestamp>
   - Example: PRD-1734442200000
   - Ensure no TypeScript errors
   - Ensure MongoDB uniqueness is respected

3) Create a new API route for searching products by productNumber:
   - Route: /api/products/search
   - Method: GET
   - Query param: ?q=<productNumber>
   - Must return matching product(s) only
   - Must NOT affect existing product APIs

4) Ensure:
   - Works identically in local and production (Vercel)
   - No timezone-related bugs
   - No caching issues
   - No TypeScript errors
   - No Mongoose overload errors

OUTPUT REQUIRED:
- Exact updated code for:
  - models/Product.ts
  - Product creation API route
  - New search API route
- Short explanation after each file explaining WHAT changed and WHY.
- Do NOT include unrelated code.
- Keep everything clean, minimal, and professional.

IMPORTANT:
Local development already works perfectly.
Your solution must NOT introduce new bugs and must be safe for production deployment.
