# 📌 Job Application Tracker – Full-Stack Next.js Project

Job Application Tracker is a personal full-stack productivity tool designed to record, track, and manage job applications in one place.

It helps users store company names, positions, application status, salary expectations, links, interview notes, and other details — keeping the job search process organized and stress-free.

This project demonstrates a realistic **end-to-end full-stack application** built with modern web technologies.

---

## 🚀 Tech Stack

- **Next.js** (App Router, File-Based Routing)
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (Supabase)
- **REST-style API** (Next.js Route Handlers)
- **React Hook Form**
- **Zod** (Schema Validation)
- **Tailwind CSS**

---

## 🎯 Features

- ➕ Create job applications
- 📄 View detailed application pages
- ✏️ Edit existing applications
- 🗑️ Delete applications
- 📦 Persistent storage using PostgreSQL
- 📡 Full CRUD API (`GET`, `POST`, `PUT`, `DELETE`)
- 🧠 Form validation with Zod
- 🎨 Clean and responsive UI with Tailwind CSS
- 🔄 Initially built with LocalStorage, later upgraded to a real database

---

## 🗂 Project Structure

```text
job-application-tracker/
│
├── app/
│ ├── applications/
│ │ ├── page.tsx # List applications
│ │ ├── new/page.tsx # Create application
│ │ ├── [id]/page.tsx # Application detail page
│ │ ├── [id]/edit/page.tsx # Edit application
│ │
│ └── api/applications/
│ ├── route.ts # GET / POST
│ └── [id]/route.ts # GET / PUT / DELETE
│
├── prisma/
│ └── schema.prisma
│
├── lib/
│ └── prisma.ts # Prisma client singleton
│
├── data/
│ └── applicationApiRepo.ts # API-based repository layer

```

🧱 Database

```text
model Application {
id String @id @default(cuid())
company String
role String?
status String
location String?
link String?
source String?
salary String?
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

```

⚙️ Setup & Run Locally

1️⃣ Install dependencies
npm install

2️⃣ Configure environment variables
Create a .env file:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

3️⃣ Generate Prisma client
npx prisma generate

4️⃣ Push schema to database
npx prisma db push

5️⃣ Run the project
npm run dev
