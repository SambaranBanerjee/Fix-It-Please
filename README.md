# 🛠️ Fix It Please

<div align="center">

### A community-powered platform for discovering, sharing, and improving technical solutions.

Search for existing fixes, document new solutions, react to helpful answers, and share your own experience with the community.

<br />

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-Authentication-purple?style=for-the-badge)

<br />

[Live Demo](#) · [Report a Bug](#) · [Request a Feature](#)

</div>

---

## 📖 About the Project

**Fix It Please** is a full-stack problem-solving platform where users can search for documented issues and discover solutions shared by others.

The platform is designed to reduce repeated troubleshooting by creating a searchable knowledge base of real problems and practical fixes.

Users can:

* Search for existing solutions using autocomplete
* Browse all documented problems
* Add new problem-and-solution entries
* View detailed solution pages
* Like or dislike solutions
* Share their own experience through replies
* Register, log in, and maintain authenticated interactions

---

## ✨ Features

### 🔍 Smart Search and Autocomplete

The search input uses debouncing to prevent unnecessary API requests while the user is typing.

```text
User types
    ↓
Wait for 300 ms of inactivity
    ↓
Send autocomplete request
    ↓
Display matching entries
```

This improves performance, reduces server load, and provides a smooth search experience.

### 📝 Community Solution Database

Users can create entries containing:

* Problem title
* Relevant tags
* Detailed solution or implementation
* Creation date and time

### 👍 Like and Dislike System

Authenticated users can react to each solution.

The reaction system supports:

* One reaction per user per solution
* Switching from like to dislike
* Switching from dislike to like
* Removing a reaction by clicking it again
* Persistent reaction counts stored in MongoDB

### 💬 Community Experience Section

Users can share whether a solution worked for them and describe:

* Additional troubleshooting steps
* Alternative fixes
* Problems encountered
* Improvements to the original solution

Replies are displayed with the author and timestamp.

### 🔐 Authentication

The project uses Auth.js with credential-based authentication.

Authentication includes:

* User registration
* Password hashing with bcrypt
* Email and password login
* JWT-based sessions
* Protected reaction and reply APIs
* Session-aware frontend components
* Secure server-side user identification

### 📋 Copy Solution

Users can copy the complete solution to their clipboard directly from the solution detail page.

### 📱 Responsive Interface

The application is designed for:

* Desktop
* Tablet
* Mobile devices

---

## 🖼️ Screenshots

Add your screenshots inside a `screenshots` directory and update the paths below.

### Landing Page

```md
![Landing Page](./screenshots/landing-page.png)
```

### Problems Database

```md
![Problems Database](./screenshots/problems-database.png)
```

### Solution Details

```md
![Solution Details](./screenshots/solution-details.png)
```

### Community Discussion

```md
![Community Discussion](./screenshots/community-discussion.png)
```

---

## 🧰 Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Next.js App Router
* Next.js Navigation

### Backend

* Next.js Route Handlers
* MongoDB
* Mongoose
* Auth.js
* bcryptjs

### Main Concepts

* REST-style API design
* Client and Server Components
* JWT authentication
* Debouncing
* Autocomplete
* Protected API routes
* MongoDB relationships
* Compound database indexes
* Responsive UI design

---

## 🏗️ Project Architecture

```text
fix-it-please/
│
├── public/
│   └── opoy7.jpg
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── entry/
│   │   │   │   ├── route.ts
│   │   │   │   │
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── reaction/
│   │   │   │       │   └── route.ts
│   │   │   │       └── replies/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   └── search/
│   │   │       └── autocomplete/
│   │   │           └── route.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── landing/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── add-entry/
│   │   │   │   └── page.tsx
│   │   │   └── view-queries/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── AuthButtons.tsx
│   │   ├── AuthSessionProvider.tsx
│   │   └── SolutionDiscussion.tsx
│   │
│   ├── lib/
│   │   └── dbConnect.ts
│   │
│   ├── model/
│   │   ├── entryModel.ts
│   │   ├── userModel.ts
│   │   ├── Reaction.ts
│   │   └── Reply.ts
│   │
│   ├── types/
│   │   └── next-auth.d.ts
│   │
│   └── auth.ts
│
├── .env.local
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

Adjust model filenames in this structure to match the exact names used in your project.

---

## 🔄 Application Workflow

### Searching for a Solution

```text
User enters a search query
          ↓
Input value updates
          ↓
Debounce timer starts
          ↓
User stops typing for 300 ms
          ↓
GET /api/search/autocomplete
          ↓
Matching solutions are displayed
          ↓
User selects a solution
          ↓
Navigate to the solution details page
```

### Reacting to a Solution

```text
Authenticated user clicks Like or Dislike
                   ↓
POST /api/entry/:id/reaction
                   ↓
Server validates the Auth.js session
                   ↓
Existing reaction is checked
                   ↓
Create, update, or remove reaction
                   ↓
Return updated reaction counts
                   ↓
Frontend updates the interface
```

### Posting an Experience

```text
Authenticated user writes a reply
                   ↓
POST /api/entry/:id/replies
                   ↓
Server validates the session
                   ↓
Reply content is validated
                   ↓
Reply is stored in MongoDB
                   ↓
New reply is displayed immediately
```

---

## 🗃️ Database Design

### User

```ts
{
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

Passwords are hashed using bcrypt before being stored.

### Entry

```ts
{
  title: string;
  type: string[];
  solution: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reaction

```ts
{
  entryId: ObjectId;
  userId: ObjectId;
  type: "like" | "dislike";
  createdAt: Date;
  updatedAt: Date;
}
```

A compound unique index prevents users from creating multiple reactions for the same solution:

```ts
ReactionSchema.index(
  {
    entryId: 1,
    userId: 1
  },
  {
    unique: true
  }
);
```

### Reply

```ts
{
  entryId: ObjectId;
  userId: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Authentication

| Method     | Endpoint                  | Description                   |
| ---------- | ------------------------- | ----------------------------- |
| `POST`     | `/api/register`           | Create a new user account     |
| `GET/POST` | `/api/auth/[...nextauth]` | Auth.js authentication routes |
| `GET`      | `/api/auth/session`       | Return the current session    |

### Entries

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| `GET`  | `/api/entry`     | Get all entries    |
| `POST` | `/api/entry`     | Create a new entry |
| `GET`  | `/api/entry/:id` | Get one entry      |

### Search

| Method | Endpoint                           | Description                     |
| ------ | ---------------------------------- | ------------------------------- |
| `GET`  | `/api/search/autocomplete?q=query` | Return autocomplete suggestions |

### Reactions

| Method | Endpoint                  | Description                                   |
| ------ | ------------------------- | --------------------------------------------- |
| `GET`  | `/api/entry/:id/reaction` | Get reaction counts and current user reaction |
| `POST` | `/api/entry/:id/reaction` | Create, change, or remove a reaction          |

### Replies

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| `GET`  | `/api/entry/:id/replies` | Get replies for a solution |
| `POST` | `/api/entry/:id/replies` | Add a reply to a solution  |

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

* Node.js 18 or later
* npm
* MongoDB or MongoDB Atlas
* Git

Check your installations:

```bash
node --version
npm --version
git --version
```

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fix-it-please.git
cd fix-it-please
```

### Install Dependencies

```bash
npm install
```

Install the main authentication and database packages when they are not already present:

```bash
npm install next-auth@beta mongoose bcryptjs
```

### Configure Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/fix-it-please

AUTH_SECRET=your-long-random-secret
AUTH_TRUST_HOST=true
```

For MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/fix-it-please
```

Generate an authentication secret:

```bash
npx auth secret
```

Never upload `.env.local` to GitHub.

### Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Testing the Application

Use the following workflow to test the complete application:

1. Open the registration page.
2. Create an account.
3. Log in with the registered credentials.
4. Open the landing page.
5. Search for an existing problem.
6. Open a solution.
7. Like or dislike the solution.
8. Refresh the page and confirm that the reaction remains.
9. Click the same reaction again and confirm that it is removed.
10. Post a community reply.
11. Refresh the page and confirm that the reply remains.
12. Log out.
13. Confirm that replies and reaction counts remain publicly visible.
14. Confirm that posting a reaction or reply requires authentication.

To verify the active session, open:

```text
http://localhost:3000/api/auth/session
```

---

## 🔐 Security Considerations

The application follows several important security practices:

* Passwords are hashed before database storage
* Plain-text passwords are never saved
* User identity is obtained from the server session
* The frontend does not submit a trusted `userId`
* Reaction and reply APIs validate authentication
* MongoDB IDs are validated before database operations
* Reply content has minimum and maximum length validation
* A compound index prevents duplicate reactions
* Environment variables are excluded from source control

A client request sends only the required action:

```json
{
  "type": "like"
}
```

The server obtains the actual user from the authenticated session:

```ts
const session = await auth();
const userId = session?.user?.id;
```

This prevents users from impersonating another account by manually changing the request body.

---

## ⚡ Performance Improvements

### Debounced Search

Autocomplete requests are delayed until the user stops typing for 300 milliseconds.

This prevents API flooding and reduces unnecessary database queries.

### Parallel Requests

Reaction data and replies can be loaded concurrently:

```ts
const [reactionResponse, repliesResponse] =
  await Promise.all([
    fetch(`/api/entry/${entryId}/reaction`),
    fetch(`/api/entry/${entryId}/replies`)
  ]);
```

### MongoDB Connection Caching

The MongoDB connection is cached during development to prevent multiple connections from being created during hot reloads.

### Indexed Queries

Indexes are used for:

* Entry-based reaction lookup
* User-based reaction lookup
* Reply sorting
* Unique reactions per user and entry

---

## 🛣️ Future Improvements

Planned enhancements include:

* [ ] Edit and delete replies
* [ ] Nested replies
* [ ] Reply likes
* [ ] User profile pages
* [ ] Search filters and sorting
* [ ] Pagination or infinite scrolling
* [ ] Entry editing and deletion
* [ ] Admin moderation dashboard
* [ ] Report inappropriate content
* [ ] Markdown support for solutions
* [ ] Syntax highlighting for code blocks
* [ ] Image attachments
* [ ] Email verification
* [ ] Password reset
* [ ] OAuth login with Google and GitHub
* [ ] Optimistic UI updates
* [ ] Rate limiting
* [ ] Unit and integration testing
* [ ] Deployment with Vercel and MongoDB Atlas

---

## 🤝 Contributing

Contributions are welcome.

### Contribution Workflow

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes.

```bash
git commit -m "Add: your feature description"
```

4. Push the branch.

```bash
git push origin feature/your-feature-name
```

5. Open a pull request.

Please keep code readable, typed, and consistent with the existing project structure.

---

## 🐛 Reporting Issues

When reporting a bug, include:

* A clear description of the problem
* Steps to reproduce it
* Expected behavior
* Actual behavior
* Screenshots or terminal logs
* Browser and operating system
* Relevant API response or status code

---

## 📜 License

This project is available under the MIT License.

Create a `LICENSE` file in the repository when you want to distribute the project under the MIT License.

---

## 👨‍💻 Author

**Sambaran Banerjee**

* GitHub: [@sambaranb25](https://github.com/sambaranb25)
* Email: [sambaranb25@gmail.com](mailto:sambaranb25@gmail.com)

---

<div align="center">

### ⭐ Support the Project

If you found this project useful, consider giving it a star.

Built with Next.js, TypeScript, MongoDB, Tailwind CSS, and Auth.js.

</div>
