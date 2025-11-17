# Biodiversity Data Management App

A full-stack web application for managing biodiversity observations, species data, conservation actions, and related ecosystem information.

## Table of Contents
- Project Overview
- Features
- Architecture
- Installation
- Configuration
- Database Setup
- Usage Guide
- Team
- License

---

## Project Overview

This application serves as a centralized system for recording biodiversity observations, tracking species and their diets, managing conservation actions, logging threats, and associating these with relevant observers and sites. Built using Node.js, Express, MySQL, and HTML5.

## Features
- Manage species and multi-valued diets
- Log detailed wildlife observations (who, where, when, what, evidence)
- Track observers and their experience/affiliation
- Register environmental threats and associate them to species
- Create, update, and track conservation actions with effectiveness
- Audit log changes and maintain data integrity
- Support for stored procedures, triggers, and transactional operations
- Responsive front-end interfaces for all data entities

## Architecture
- **Backend:** Node.js (Express.js), using modular models (speciesModel.js, observerModel.js, observationModel.js, actionModel.js, locationModel.js)
- **Database:** MySQL 8.x with schema in 3NF, using foreign keys, procedures, triggers, and functions
- **Frontend:** HTML5 + Vanilla JavaScript (index.html, species.html, observation.html, observers.html, location.html, action.html)

## Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/PES2UG23CS144/Biodiversity-Data-Management-App.git
   cd Biodiversity-Data-Management-App
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment**
   - Create a `.env` file with your database credentials (see `.env.example` if present)

## Configuration
Edit `.env` file:
```
DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=BiodiversityDB
PORT=5000
```

## Database Setup
1. **Start MySQL and run the provided schema script** (typically named `schema.sql` or see the repository root).
    - Creates all tables, constraints, triggers, stored procedures, and sample data.
2. **Run migrations** if using a migration tool.

## Usage Guide
- **Start the Server**
  ```bash
  npm start
  ```
- **Development (with hot reload)**
  ```bash
  npm run dev
  ```
- **Access Frontend**
  - Open `index.html` in your browser for dashboard and navigation.
  - Use entity-specific HTML files for CRUD (species, observers, etc.)
- **API Endpoints**
  - The backend exposes RESTful API endpoints for all major entities.
- **Demo Users/Data**
  - Sample users, species, locations, etc., are inserted by default via example SQL.

## Team
- Chandrashekhar Awwanna Teli (PES2UG23CS144)
- Charan K (PES2UG23CS145)

Project for PES University, Department of Computer Science and Engineering, under the guidance of Prof. Shilpa S.

## License
This project is licensed for educational and demonstration purposes.

---


