# SportsBook 
> **The platform for the modern student-athlete.** SportsBook is a web application designed to transform how college sports facilities are managed. Built with **Next.js 15**, **React 19**, and **Socket.io**, it delivers a seamless, real-time experience for booking, scoring, and community building.
---
## Features 
### Intelligent Facility Booking
*   **Real-Time Availability**: Instantly see which courts are free or occupied.
*   **Intuitive Scheduling**: Clean booking system that prevents overlaps and maximizes facility utility.

### 📊 Dynamic Occupancy (RTO)
*   **Live Heatmaps**: Visualize facility density in real-time using WebSocket-powered updates.
*   **Instant Updates**: No refreshing required. When a player scans in, the occupancy map updates globally in milliseconds.

### 🎾 Real-Time Match Scoring
*   **Campus Live-Scores**: A centralized hub for all active matches managed by the admin. 
*   **Live Broadcasting**: Scores are pushed to all connected clients instantly via WebSockets.

### 🔐 QR-Powered Access Control
*   **Seamless Check-ins**: Automated entry/exit logging for gym and sports facilities using dynamic QR code generation and scanning.
*   **Activity Logs**: Detailed session tracking for both users and administrators.

### 🤝 Social Player Search
*   **Find Your Team**: Search for players by skill level, sport preference, or availability.
*   **Community Building**: Connect with other athletes and organize matches effortlessly.

### 📈 Data Visualization & Auth
*   **Usage Analytics**: Beautiful, interactive charts powered by **Recharts** to visualize peak facility usage and sport popularity.
*   **Secure Authentication**: Robust session management using **JWT (JSON Web Tokens)** and **Bcrypt** for secure password hashing.
---
## 🛠️ The Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) for fluid, premium interactions |
| **Backend** | Node.js with [Socket.io](https://socket.io/) for real-time bidirectional communication |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (managed by [Neon](https://neon.tech/)) |
| **ORM** | [Prisma](https://www.prisma.io/) with Driver Adapters for high-performance edge queries |
| **File Storage** | [Cloudinary](https://cloudinary.com/) for optimized asset management |
| **Auth** | Custom JWT implementation with `jose` and `bcryptjs` |
---
### Installation
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Alphx2243/Sportsbook_Full_Stack.git
    cd Sportsbook_Full_Stack
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="your_postgresql_url"
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    JWT_SECRET="your_secure_random_string"
    ```
4.  **Database Migration**
    ```bash
    npx prisma db push
    ```
5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Your portal is now live at `http://localhost:3000`!
---
## 👨‍💻 Developed By
**[Kunal Budhiraja]**
---