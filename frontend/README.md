# LoanX Frontend Application

The modern web application for the LoanX platform, developed in React, Vite, and Tailwind CSS.

## Architecture

- **Build Tool**: Vite
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS (custom banking theme with `#FF6B00` brand orange, dark charcoal typography, and clean white surfaces)
- **Icons**: Lucide React
- **API Client**: Axios (configured with token interceptor and proxying to backend on port 5001)

## Application Pages & Routes

### Public & User Routes
- `/`: Landing page with hero overview, real ML value propositions, and trust metrics.
- `/how-it-works`: Full breakdown of the 18 input features and XGBoost pipeline.
- `/about`: Company mission and responsible AI underwriting principles.
- `/login`: User/Admin authentication.
- `/register`: Account registration.
- `/dashboard`: User activity overview, approval rate, and quick actions.
- `/new-prediction`: 18-feature structured loan application form with validation and official CIBIL credit score link.
- `/prediction-result/:id`: Decision display (Approved / Rejected), approval probability meter, disclaimer, and 18-feature snapshot.
- `/history`: Paginated history of all evaluations performed by the user with status filters.
- `/profile`: User account details and name update.

### Admin Routes (Protected, Admin role required)
- `/admin`: Professional banking dashboard with KPI stat cards, portfolio averages, decision ratio, and recent predictions table.
- `/admin/predictions`: Paginated ledger of all platform-wide applications with user details and feature snapshot modal.
- `/admin/users`: User management table with activity counts and role promotion/demotion.
- `/admin/analytics`: Risk tier breakdowns (credit score segments, loan purpose distribution, property area split).

## Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
