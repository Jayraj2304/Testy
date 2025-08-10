
# TESTY - AI-Powered Test Case Generation

## About the App

TESTY is a web application that leverages the power of generative AI to automatically create test cases from your GitHub repositories. It provides a simple and intuitive interface for selecting repositories, viewing files, and generating test cases with a single click.

## Features

- **GitHub Integration:** Securely log in with your GitHub account to access your repositories.
- **Repository and File Navigation:** Easily browse through your repositories and the files within them.
- **AI-Powered Test Case Generation:** Select files from your repository and let the AI generate test cases for you.
- **Interactive Chat:** Refine and improve the generated test cases through an interactive chat interface.
- **Download and Copy:** Conveniently copy the generated code to your clipboard or download it as a file.

## Getting Started

### Prerequisites

- Node.js and npm
- A GitHub account

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Jayraj2304/Testy
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Create a `.env` file in the `backend` directory with the following environment variables:**

    ```
    GITHUB_CLIENT_ID=<your-github-client-id>
    GITHUB_CLIENT_SECRET=<your-github-client-secret>
    GEMINI_API_KEY=<your-gemini-api-key>
    ```

5.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

6.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm start
    ```

7.  Open your browser and navigate to `http://localhost:3000`.

## Architecture

### Backend

The backend is a Node.js application using the Express framework. It handles authentication, communication with the GitHub API, and interaction with the generative AI service.

- **Authentication:** Uses GitHub OAuth for secure user authentication.
- **GitHub API:** Interacts with the GitHub API to fetch user repositories and file content.
- **AI Service:** Uses a generative AI service to generate test cases from the provided file content.

### Frontend

The frontend is a React application that provides the user interface for interacting with the application.

- **React:** The core of the frontend is built with React.
- **React Router:** Handles routing within the application.
- **Services:** A dedicated service layer handles communication with the backend API.
- **Components:** The UI is built with a set of reusable components.
