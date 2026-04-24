# Evercart

Evercart is a functional e-commerce storefront application built with React, Redux Toolkit, and Tailwind CSS. It provides a complete shopping experience, from product discovery and category filtering to a multi-step checkout process.

## Tech Stack

- **Framework:** React
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS (including Dark Mode support)
- **Routing:** React Router
- **Networking:** Axios with custom interceptors
- **Form Handling:** React Hook Form & Yup Validation
- **Icons:** Lucide React

## Key Features

- **Dynamic Product Browsing:** Fetching real product data via the DummyJSON API.
- **Advanced Filtering:** Search by keyword and filter by specific categories.
- **User Authentication:** Secure login flow with persistent user sessions.
- **Cart Management:** Persistent shopping cart that saves to local storage.
- **Native Tab Syncing:** Real-time synchronization of cart, theme, and auth across all open browser tabs using the BroadcastChannel API.
- **Multi-step Checkout:** Validated shipping and payment forms with mock order completion.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewports.

## Technical Architecture

### Data Fetching
All external communication is handled via a centralized Axios instance located in `src/api/axiosInstance.js`. This instance uses request interceptors to automatically inject authorization headers and response interceptors to standardize error handling across the application.

### State Management
The application uses Redux Toolkit for global state. Slices are divided by responsibility:
- `authSlice`: Manages user identity, tokens, and session status.
- `cartSlice`: Handles the shopping basket logic and price calculations.
- `productsSlice`: Manages catalog data, pagination, and search queries.
- `themeSlice`: Controls the application's appearance (Light/Dark mode).

### Cross-Tab Synchronization
To ensure a consistent user experience, the app implements a custom Redux middleware in `src/app/store.js`. This middleware uses the native browser **BroadcastChannel API** to mirror actions across all open tabs. If a user adds an item to their cart or switches to dark mode in one tab, the change is instantly reflected in all other open tabs of the same origin.

## Project Structure

```text
src/
├── api/          # Network logic and domain-specific API calls
├── app/          # Global store configuration and sync middleware
├── components/   # UI components (Common, Layout, and Product specific)
├── features/     # Redux slices and feature-specific logic
├── hooks/        # Custom shared React hooks
├── pages/        # Main route view components
├── routes/       # Route definitions and protected route logic
└── utils/        # Constants, formatters, and helper functions
```

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation
1. Clone the repository and navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Optionally, create a `.env` file in the root directory to define a custom API endpoint:
```env
VITE_API_BASE_URL=https://dummyjson.com
```

### Running the Project
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Test Credentials
To test authenticated features, use these DummyJSON credentials:
- **Username:** `emilys`
- **Password:** `emilyspass`
