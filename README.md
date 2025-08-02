# Map Management Platform for Sharing Travel Experiences

A full-stack web application for creating, managing, and sharing personalized maps with favorite places. Users can explore locations, follow other users, and get personalized recommendations.

## Documentation
To read the full thesis document, open [Map_Management_Platform_for_Sharing_Travel_Experiences.pdf](docs/Map_Management_Platform_for_Sharing_Travel_Experiences.pdf)

## Features
- Create and share interactive maps with your favorite places
- Find places using Google Maps integration and save them to your profile
- Follow users and explore their profiles 
- Recommendation engine for maps, places, and users

## Tech Stack
- **Frontend:** React.js, TypeScript, Chakra UI, Zustand, Vite
- **Backend:** Go (Fiber), RESTful API
- **Database:** MongoDB
- **APIs:** Google Maps API

##  Architecture
![Architecture diagram](docs/architecture_diagram.png)


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
