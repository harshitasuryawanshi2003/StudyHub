#  StudyHub 

**StudyHub** is a full-stack Ed-Tech platform that empowers students to explore and enroll in online courses, while allowing instructors to upload and manage their course content. It features secure authentication, role-based dashboards, progress tracking, and integrated payment for premium courses.

---


## Table of Contents

- [Introduction](#introduction)  
- [System Architecture](#system-architecture)  
- [Front-end](#front-end)  
- [Back-end](#back-end)  
- [Database](#database)  
- [API Design](#api-design)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)

---

## Introduction

StudyHub is a MERN-stack based e-learning platform that supports:
- Role-based access (Student & Instructor)  
- Secure user authentication  
- Course creation and management  
- Razorpay-based course purchases  
- Media uploads via Cloudinary  
- Password reset with email verification  

---

## System Architecture

StudyHub follows a **client-server architecture** composed of three main layers:

- **Front-end:** React.js with Tailwind CSS and Redux/Context for state management  
- **Back-end:** Node.js with Express.js  
- **Database:** MongoDB with Mongoose  

---

## Front-end

The front-end is built using **ReactJS**, styled with **Tailwind CSS**, and communicates with the backend using REST APIs.

### Student Pages
- Home page with featured courses  
- Browse courses by category  
- Enroll in paid/free courses  
- Course content page with video playback  
- Wishlist and cart management  
- Profile settings and password update  

### Instructor Pages
- Instructor dashboard  
- Add/edit/delete courses  
- Upload video lectures to Cloudinary  
- View enrolled students and course feedback  
- Profile management  

---

## Back-end

The backend is developed using **Node.js and Express.js**, structured into routes, controllers, and middleware layers.

### Key Features
- JWT-based user authentication & session management  
- Bcrypt password hashing and reset flow  
- Role-based access control (Student/Instructor/Admin)  
- Razorpay integration for payments (test mode)  
- Nodemailer for OTP and password reset emails  
- Cloudinary for media (image/video) uploads  

### Libraries & Tools
- Node.js, Express.js  
- MongoDB with Mongoose  
- JWT, Bcrypt  
- Cloudinary SDK  
- Nodemailer  

### Schemas
- **User**: name, email, password, role, enrolledCourses, profileImage  
- **Course**: title, description, price, category, instructor, lectures, rating  
- **Lecture**: title, videoURL, duration  
- **Payment**: amount, userId, courseId, timestamp  

---

## Database

**MongoDB** is used to store all persistent data such as:
- User details  
- Course content  
- Enrollment records  
- Payment transactions  

Models are defined using **Mongoose** for schema validation and relationship mapping.

---

## API Design

The backend exposes **RESTful APIs** that follow standard HTTP methods (GET, POST, PUT, DELETE).  
All endpoints return JSON data.

For example:
- `POST /api/v1/signup`  
- `POST /api/v1/course/create`  
- `GET /api/v1/courses/category/:name`  
- `POST /api/v1/payment/verify`

Refer to your Postman collection or documentation for complete API details.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/harshitasuryawanshi2003/StudyHub.git
cd StudyHub
```
---

## Configuration

Create a `.env` file inside the `/server` directory with the following environment variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

---

## Install Dependencies

Install all required dependencies from the root directory:

```bash
# Install root dependencies (including concurrently)
npm install

# Install client-side dependencies
cd client
npm install

# Install server-side dependencies
cd ../server
npm install
```
 Return to root directory
 ```bash
 cd ..
 ```
---

## Usage

To run both client and server simultaneously, use the following command from the root:

```bash
npm run dev
```

Then, open your browser and navigate to:

```bash
http://localhost:3000

```



