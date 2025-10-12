# Apex Ledger

Apex Ledger is a sophisticated, visually-driven expense management application designed for accountants and professionals. The platform allows users to effortlessly record expenses by capturing receipt images. The system is designed to streamline expense tracking through intelligent categorization and provides insightful analytics via a stunning, interactive dashboard. Key features include a detailed expense log with filtering and search capabilities, a visual dashboard with charts breaking down spending by category and time, and a streamlined workflow for adding new expenses. The entire application is built on a modern, serverless architecture using Cloudflare Workers, ensuring high performance and scalability.

[cloudflarebutton]

## ✨ Key Features

- **Interactive Dashboard**: Get a high-level overview of your finances with key metrics and beautiful, responsive charts.
- **Detailed Expense Tracking**: A comprehensive table view of all expenses with robust sorting, filtering, and search capabilities.
- **Streamlined Expense Creation**: Quickly add new expenses through an intuitive modal form.
- **Receipt Management**: Attach receipt images to your expense records for easy verification (simulated).
- **Modern & Responsive UI**: A stunning, dark-mode first interface that is a pleasure to use on any device.
- **Serverless Architecture**: Built on Cloudflare Workers and Durable Objects for global performance, scalability, and reliability.

## 🛠️ Technology Stack

- **Frontend**:
    - [React](https://reactjs.org/)
    - [Vite](https://vitejs.dev/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [shadcn/ui](https://ui.shadcn.com/)
    - [Recharts](https://recharts.org/) for data visualization
    - [Framer Motion](https://www.framer.com/motion/) for animations
    - [Zustand](https://zustand-demo.pmnd.rs/) for state management
    - [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for form handling and validation
- **Backend**:
    - [Cloudflare Workers](https://workers.cloudflare.com/)
    - [Hono](https://hono.dev/)
- **Database**:
    - [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- **Language**:
    - [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd apex_ledger
    ```

2.  **Install dependencies:**
    This project uses `bun` as the package manager.
    ```sh
    bun install
    ```

3.  **Run the development server:**
    This command will start the Vite development server for the frontend and the `wrangler` development server for the backend worker simultaneously.
    ```sh
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## 💻 Development

The project is structured as a monorepo with three main directories:

-   `src/`: Contains the frontend React application built with Vite.
-   `worker/`: Contains the Cloudflare Worker backend API built with Hono.
-   `shared/`: Contains TypeScript types and interfaces shared between the frontend and backend.

### Available Scripts

-   `bun dev`: Starts the local development server for both the frontend and the worker.
-   `bun build`: Builds the frontend application for production.
-   `bun deploy`: Deploys the application (frontend and worker) to Cloudflare.
-   `bun lint`: Lints the codebase using ESLint.

## ☁️ Deployment

This application is designed to be deployed to the Cloudflare network.

1.  **Log in to Cloudflare:**
    If you haven't already, authenticate `wrangler` with your Cloudflare account.
    ```sh
    npx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script. This will build the frontend, and then deploy both the static assets and the worker to your Cloudflare account.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[cloudflarebutton]