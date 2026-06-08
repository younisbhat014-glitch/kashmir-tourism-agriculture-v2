# 🏔 Kashmir Tourism & Agriculture Portal

A full-featured React.js website for Kashmir Tourism and Agriculture with animated backgrounds, admin/user dashboards, booking systems, chatbot, and more.

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

```bash
# 1. Go to the project folder
cd kashmir-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

## 🔑 Demo Login Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@kashmir.com      | admin123  |
| User  | user@kashmir.com       | user123   |

You can also register a new account from the Register page.

## 📁 Project Structure

```
kashmir-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                    ← Main app with routing
    ├── main.jsx                   ← Entry point
    ├── styles/
    │   └── global.css             ← All animations, variables, utilities
    ├── context/
    │   └── AuthContext.jsx        ← Login/Register/Auth state
    ├── data/
    │   └── appData.js             ← All mock data (hotels, crops, etc.)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx         ← Sticky animated navbar
    │   │   └── Footer.jsx         ← Full footer
    │   ├── ui/
    │   │   ├── Hero.jsx           ← Animated slideshow hero
    │   │   └── Toast.jsx          ← Toast notifications
    │   └── chatbot/
    │       └── Chatbot.jsx        ← AI-style chatbot
    └── pages/
        ├── Home.jsx               ← Landing page
        ├── Tourism.jsx            ← Hotels/Restaurants/Vehicles/Weather
        ├── Agriculture.jsx        ← Buy/Sell crops, Machines, Calendar
        ├── About.jsx              ← About page
        ├── Auth.jsx               ← Login & Register
        ├── UserDashboard.jsx      ← User dashboard
        └── AdminDashboard.jsx     ← Full admin panel with charts
```

## ✨ Features

### 🗺 Tourism
- Tourist spot listings with category filter
- Hotel booking with check-in/out dates
- Restaurant table reservation
- Vehicle rental (taxi, shikara, bikes)
- Live weather for 5 Kashmir locations
- Best time to visit guide

### 🌾 Agriculture
- Buy fresh crops directly from farmers
- Sell/list your own produce
- Rent or buy agricultural machinery
- Visual crop season calendar (month-wise)
- Farmer support & government schemes

### 👤 User Dashboard
- Overview with quick actions
- All bookings history
- Weather widget
- Profile settings

### 👑 Admin Dashboard
- Stats overview with 6 KPI cards
- Monthly charts (tourists, revenue, bookings)
- Pie chart for booking category split
- User management table
- Hotels, crops, vehicles management
- Full analytics page with bar/line charts

### 🤖 Chatbot
- Floating chat bubble (bottom-right)
- Context-aware responses about tourism, hotels, weather, agriculture
- Quick reply buttons
- Typing animation

### 🎨 Design
- Animated background slideshow (5 Kashmir images)
- Floating thumbnail over background
- Sticky animated navbar (transparent → solid on scroll)
- Toast notifications
- Modal-based booking forms
- Fully responsive design
- Custom CSS animations (floatUp, floatSide, fadeInUp, etc.)
- Google Fonts: Cormorant Garamond, Nunito, Dancing Script

## 🛠 Tech Stack

- **React 18** with Hooks
- **React Router v6** for navigation
- **Recharts** for analytics charts
- **Vite** for fast development
- **Vanilla CSS** with CSS variables (no Tailwind dependency)
- **localStorage** for session persistence
