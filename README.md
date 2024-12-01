```markdown
# Currency Exchange Rate Notification System

## Project Overview

This system monitors currency exchange rates every 15 seconds and sends notifications when specific user-defined rules are triggered.

## Features

- Fetch exchange rates from an API.
- Manage notification rules (add, edit, delete).
- Manage user subscriptions for notifications.
- Evaluate rules and notify users based on triggers.

## Technologies

- **Backend**: Nest.js (CQRS, EventBus), TypeScript, Prisma, Redis
- **Infrastructure**: Docker, PostgreSQL, Prometheus, Grafana
- **Frontend**: React (coming soon)

## Setup Instructions

### Running the Project

1. Clone the Repository:
   ```sh
   git clone <repository_url>
   cd project-root
   ```

2. Create `.env` files:
   - In the root directory and `src` folder, copy the contents of `example.env` into `.env` files:
     ```sh
     cp example.env .env
     cd backend
     cp example.env .env
     ```

3. Start the Application:
   - Ensure you have Docker installed, then use Docker Compose to start the services:
     ```sh
     docker-compose up --build
     ```

4. Access Services:
   - The backend API will typically run at `http://localhost:3000`.
   - Access other tools like Prometheus or Grafana through their respective ports (defined in `docker-compose.yml`).

## Future Development

- Integration of a React-based frontend for improved user experience.
- Extended analytics and real-time charting with Grafana.

## License

This project is licensed under the MIT License.
```