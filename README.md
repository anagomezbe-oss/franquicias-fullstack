# Franchise Manager

Fullstack technical assessment: franchise, branch and product inventory management.

## Stack
- Backend: ASP.NET Core Web API on .NET 8, Entity Framework Core 8, SQLite, Swagger.
- Frontend: React 18, TypeScript and Vite.
- Database: SQLite file (`franchises.db`) created automatically on first backend start.

## Requirements
- .NET SDK 8.0
- Node.js 20 or later and npm
- Git

## Run the backend
```bash
cd backend/Franchises.Api
dotnet restore
dotnet run --urls http://localhost:5000
```
Swagger: http://localhost:5000/swagger

The application creates the SQLite database on startup. For a production workflow, use EF Core migrations rather than `EnsureCreated`.

### EF Core migrations (optional workflow)
Install the tool if needed: `dotnet tool install --global dotnet-ef`
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
If you add migrations, replace `Database.EnsureCreated()` in `Program.cs` with `Database.Migrate()`.

## Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. If your backend uses another URL, create `frontend/.env` from `.env.example` and set `VITE_API_URL`.

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/franchises` | List franchises |
| POST | `/api/franchises` | Create franchise |
| GET | `/api/branches?franchiseId={id}` | List branches, optionally filtered |
| POST | `/api/branches` | Create branch |
| GET | `/api/products?branchId={id}` | List products, optionally filtered |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/{id}/stock` | Update product stock |

Example request bodies:
```json
{ "name": "North Region" }
```
```json
{ "franchiseId": 1, "name": "Downtown Branch" }
```
```json
{ "branchId": 1, "name": "Coffee", "stock": 25 }
```
```json
{ "stock": 40 }
```

## Architecture
The backend uses Controllers -> DTOs -> EF Core DbContext -> SQLite. Request DTOs validate input, controllers enforce parent-resource existence, and a middleware returns a generic error message for unexpected failures. The frontend keeps API calls in `src/api.ts` and UI state in `src/App.tsx`.

## Git workflow (required assessment evidence)
Do not commit directly to `main`. Example:
```bash
git init
git add .
git commit -m "chore: initialize franchise manager"
git branch -M main
git checkout -b feature/franchise-module
git add .
git commit -m "feat: add franchise branch and product api"
git commit -m "feat: build inventory management interface"
git remote add origin https://github.com/YOUR-USERNAME/franchise-manager.git
git push -u origin main
git push -u origin feature/franchise-module
# Open a Pull Request on GitHub: feature/franchise-module -> main
# Merge it on GitHub after review
```
For the assessment, create a Pull Request on GitHub from `feature/franchise-module` into `main` and describe the API, UI and validation changes. Prefer opening the PR before merging.

## Notes
- `node_modules`, build outputs, SQLite database files and local environment files are excluded from Git.
- This is a junior assessment starter implementation; run the verification steps below before submission.
