# Readily

A modern book purchasing platform that enables users to browse, search, and purchase books from a vast collection powered by the Google Books API.

## Overview

Readily is a full-stack e-commerce application designed for book enthusiasts. The platform offers a seamless experience for users to discover books through various categories, trending titles, new releases, and personalized recommendations. Users can explore detailed book information, add items to their cart, and complete the checkout process.


## Tech Stack

- **React** for the frontend framework
- **Redux** for state management
- **Node.js & Express** for the backend
- **MongoDB** for database
- **Google Books API** for book data
- **Tailwind CSS** for styling
- **Vercel** for deployment

## Run Locally

Follow these steps to set up the project on your PC:

### Prerequisites
- Node.js (v16 or higher)
- pnpm (v8 or higher)
- MongoDB connection string
- Google Books API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sahiwl/readily.git
   cd bookapp
   ```

2. Backend setup:
   ```bash
   cd backend
   pnpm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_BOOKS_API_URL=https://www.googleapis.com/books/v1
   GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   ```

4. Frontend setup:
   ```bash
   cd ../frontend
   pnpm install
   ```

5. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

6. Start the backend server:
   ```bash
   cd ../backend
   pnpm run start.dev
   ```

7. Start the frontend development server:
   ```bash
   cd ../frontend
   pnpm run dev
   ```

8. Open your browser and navigate to `http://localhost:5173`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

<i>~let it rip.</i>

<i>Sahil</i>