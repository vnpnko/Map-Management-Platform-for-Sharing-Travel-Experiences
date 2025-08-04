# Map Management Platform for Sharing Travel Experiences

A full-stack web application for creating, managing, and sharing personalized maps with favorite places. Users can explore locations, follow other users, and get personalized recommendations.

You can find the documentation here [Map_Management_Platform_for_Sharing_Travel_Experiences.pdf](docs/Map_Management_Platform_for_Sharing_Travel_Experiences.pdf)

## Motivation
The idea behind this project came from the need for a simple way to collect and share travel experiences. Existing solutions like Google Maps allow saving places, but they lack of social graph-based recommendations. This project bridges this gap with a custom recommendation engine that ranks places not only by popularity, but also by preferences in your social circle.

## Features
- Create and share interactive maps with your favorite places
- Find places using Google Maps integration and save them to your profile
- Follow users and explore their profiles 
- Recommendation engine for maps, places, and users

## Tech Stack
- **Frontend:**  
  **React.js** for modular and reusable UI, **TypeScript** for type safety, **Chakra UI** for responsive design, **Zustand** for lightweight state management, **Vite** for fast builds and hot reload during development.

- **Backend:**  
  **Go (Fiber)** for its performance, minimal footprint, and built-in concurrency support — ideal for scalable RESTful APIs.

- **Database:**  
  **MongoDB** was chosen over relational options for its flexible schema, making it easier to handle nested map and user data structures.

- **APIs:**  
  **Google Maps API** for map rendering and place search functionality.

## Installation
### Prerequisites
- Node.js 18+
- Go 1.21+
- MongoDB (local or remote)
- Google Maps API Key (get it from [Google Cloud Console](https://developers.google.com/maps))


### Steps
```bash
# Clone repo
git clone https://github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences.git

# Frontend
cd client
# Create .env file and add:
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# REACT_APP_BASE_URL=http://localhost:5000/api
npm install
npm run dev

# Backend
cd server
# Create .env file and add:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
go run main.go
