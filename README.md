# Franchise Manager

Fullstack application for managing franchises, branches, products, and product inventory.

## Technologies

### Backend
- C# and ASP.NET Core Web API (.NET 8).
- Entity Framework Core 8.
- SQLite.
- Swagger / OpenAPI.

### Frontend
- React 18.
- TypeScript.
- Vite.

## Requirements

- .NET 8 SDK.
- Node.js 20 or later.
- npm.
- Git.

## Project Structure

```text
franquicias-fullstack/
├── backend/
│   └── Franchises.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Middleware/
│       ├── Migrations/
│       ├── Models/
│       ├── Program.cs
│       └── appsettings.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Running the Backend

```bash
cd backend/Franchises.Api
dotnet restore
dotnet run --urls http://localhost:5000
```

API: http://localhost:5000

Swagger: http://localhost:5000/swagger

The application uses SQLite and stores its database in `franchises.db`.

Entity Framework Core automatically applies pending migrations when the backend starts.

## Database Migrations

The project uses Entity Framework Core migrations to manage database schema changes.

Install the EF Core CLI tool if necessary:

```bash
dotnet tool install --global dotnet-ef --version 8.0.11
```

Apply existing migrations:

```bash
cd backend/Franchises.Api
dotnet ef database update
```

Create a new migration after modifying the data models:

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

## Running the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application at:

http://localhost:5173

The frontend communicates with the backend API running at `http://localhost:5000`.

Configure `VITE_API_URL` through a local `.env` file if a different API URL is required. Use `.env.example` as a reference.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/franchises` | List all franchises |
| POST | `/api/franchises` | Create a franchise |
| GET | `/api/branches?franchiseId={id}` | List branches, optionally filtered by franchise |
| POST | `/api/branches` | Create a branch |
| GET | `/api/products?branchId={id}` | List products, optionally filtered by branch |
| POST | `/api/products` | Create a product |
| PATCH | `/api/products/{id}/stock` | Update product stock |

### Example Request Bodies

Create a franchise:

```json
{
  "name": "North Region"
}
```

Create a branch:

```json
{
  "franchiseId": 1,
  "name": "Downtown Branch"
}
```

Create a product:

```json
{
  "branchId": 1,
  "name": "Coffee",
  "stock": 25
}
```

Update product stock:

```json
{
  "stock": 40
}
```

## Architecture

### Backend

The backend is organized into the following layers:

- **Controllers:** Handle HTTP requests and API endpoints.
- **DTOs:** Define data transfer objects and validate input.
- **Models:** Represent Franchise, Branch, and Product entities.
- **Data:** Contains the Entity Framework Core database context.
- **Middleware:** Handles unexpected application errors.
- **Migrations:** Track and apply database schema changes.

Entity Framework Core manages persistence through SQLite and handles entity relationships.

### Frontend

- `App.tsx`: Main application interface and UI state.
- `api.ts`: Centralized API communication.
- `style.css`: Application styles.

The interface provides sections for managing franchises, branches, products, and inventory stock.

## Git Workflow

The project uses feature branches to keep development separate from the main branch.

Main branch:

```text
main
```

Feature branch:

```text
feature/franchise-module
```

To continue working on the feature branch:

```bash
git switch feature/franchise-module
```

After making changes:

```bash
git add .
git commit -m "feat: describe your changes"
git push
```

The feature branch is intended to be submitted to `main` through a Pull Request.

GitHub repository:

https://github.com/anagomezbe-oss/franquicias-fullstack

## Verification

Verify the backend:

```bash
cd backend/Franchises.Api
dotnet restore
dotnet build
```

Verify the frontend:

```bash
cd frontend
npm install
npm run build
```

## Notes

- SQLite database files are excluded from Git.
- Build outputs and dependency folders are excluded from Git.
- Local environment files are excluded from Git; `.env.example` is provided as a reference.
- Database schema changes should be managed through Entity Framework Core migrations.

