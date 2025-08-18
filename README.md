# Real-Time Poll Voting System

A modern, real-time poll voting system built with NestJS (backend) and Next.js (frontend) using Server-Sent Events (SSE) for live updates.

## Features

- **Real-time Updates**: Live vote counts and poll updates using SSE
- **User-friendly Interface**: Modern UI with real-time status indicators
- **Poll Management**: Create, vote, and view polls with detailed analytics
- **IP-based Voting**: Prevents duplicate votes from the same IP
- **Automatic Expiration**: Polls automatically expire after TTL
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend

- **NestJS**: Node.js framework for building scalable server-side applications
- **Prisma**: Database ORM with PostgreSQL
- **Server-Sent Events (SSE)**: Real-time communication
- **TypeScript**: Type-safe development

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern component library
- **Server-Sent Events**: Real-time updates

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd poll-vote
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/poll_vote"
NODE_ENV=development
```

```bash
# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

The backend will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Polls

- `GET /poll` - Get all polls with pagination
- `GET /poll/:pollId` - Get specific poll details
- `GET /poll/stats` - Get poll statistics
- `POST /poll` - Create a new poll
- `POST /poll/:pollId/vote/:optionId` - Vote on a poll

### Real-time Events

- `GET /poll/stream` - SSE stream for all poll events
- `GET /poll/:pollId/stream` - SSE stream for specific poll events

## Real-time Features

### Server-Sent Events (SSE)

The system uses SSE to provide real-time updates:

1. **Vote Events**: When someone votes, all connected clients receive the updated vote count
2. **Poll Updates**: Complete poll data is sent when votes change
3. **Connection Status**: Frontend shows real-time connection status

### Event Types

- `vote`: Individual vote updates
- `poll_update`: Complete poll data updates

## Usage

### Creating a Poll

1. Navigate to the home page
2. Click "Create Poll"
3. Fill in the poll details (title, description, options)
4. Set the TTL (time to live) for the poll
5. Submit to create the poll

### Voting

1. Browse active polls on the home page
2. Click "Vote" on your preferred option
3. See real-time updates as votes are cast

### Viewing Results

1. Navigate to the "Results" page
2. View detailed vote distributions and percentages
3. Real-time updates show live vote counts

## Development

### Backend Development

```bash
cd backend
npm run start:dev  # Development with hot reload
npm run build      # Build for production
npm run start      # Start production server
```

### Frontend Development

```bash
cd frontend
npm run dev        # Development server
npm run build      # Build for production
npm run start      # Start production server
```

### Database Management

```bash
cd backend
npx prisma studio  # Open Prisma Studio
npx prisma migrate dev  # Run migrations
npx prisma generate     # Generate Prisma client
```

## Architecture

### Backend Architecture

- **Clean Architecture**: Separation of concerns with use cases, repositories, and controllers
- **Event-Driven**: SSE for real-time communication
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: NestJS IoC container

### Frontend Architecture

- **Context API**: Global state management
- **Custom Hooks**: Reusable logic (SSE, API calls)
- **Component Composition**: Modular UI components
- **Type Safety**: Full TypeScript integration

## Real-time Implementation Details

### SSE Connection

```typescript
// Frontend SSE hook
const { events, isConnected } = useSSE("/poll/stream");

// Backend event emission
this.pollEventsUseCase.emitVote({
  type: "vote",
  pollId: "123",
  optionId: "456",
  votes: 42,
});
```

### Event Flow

1. User votes on frontend
2. Frontend sends POST request to backend
3. Backend processes vote and updates database
4. Backend emits SSE events to all connected clients
5. Frontend receives events and updates UI in real-time

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/poll_vote
NODE_ENV=development
PORT=3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
