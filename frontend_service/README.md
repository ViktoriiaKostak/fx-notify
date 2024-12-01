# Frontend Service

This project is a frontend service built using TypeScript, React, and other modern web technologies. It includes components, configurations, and scripts to run and build the application.

## Project Structure

- `src/`: Contains the source code for the frontend application.
    - `components/`: React components used in the application.
        - `EmailForm.tsx`: A form component for submitting an email.
        - `RuleList.tsx`: A list component for displaying rules.
        - `RuleForm.tsx`: A form component for adding a rule.
- `frontend_service/`: Configuration files for the project.
    - `tsconfig.json`: TypeScript configuration file.
    - `tsconfig.node.json`: TypeScript configuration for Node.js specific settings.
    - `tsconfig.app.json`: TypeScript configuration for the application.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd frontend_service
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Running the Application

To start the development server, run:
```sh
npm start
```

This will start the application on `http://localhost:3000`.

## Building the Application

To build the application for production, run:
```sh
npm run build
```

The output will be in the `dist/` directory.

## TypeScript Configuration

The project uses multiple TypeScript configuration files:

- `tsconfig.json`: Main configuration file that references other configurations.
- `tsconfig.node.json`: Configuration for Node.js specific settings.
- `tsconfig.app.json`: Configuration for the application.

## Component: EmailForm

The `EmailForm` component is a simple form for submitting an email address. It uses React hooks for state management and includes basic validation.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.