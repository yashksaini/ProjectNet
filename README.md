# ProjectNet

## Table of Contents
- [Introduction](#introduction)
- [Demo](#demo)
- [About the Project](#about-the-project)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Used For](#used-for)
- [Improvements](#improvements)
- [Problems Faced](#problems-faced)
- [Links](#links)
- [Getting Started](#getting-started)

## Introduction
ProjectNet is a collaborative project-sharing application built with Angular, CSS, Firebase, and TypeScript. It empowers developers to create accounts, connect with others, and showcase their projects.

## Demo



https://github.com/yashksaini/ProjectNet/assets/101442489/d11f6557-a17c-4f58-a034-ba7b4aded154


## About the Project
ProjectNet is a comprehensive platform designed to foster collaboration among developers. With a user-friendly interface, it offers a range of features, including user profiles, project sharing, connection management, and project discovery. Developers can create accounts using their email and password, and upon email verification, they gain access to the platform. Users can build their profiles, add project details, and connect with other developers. The platform simplifies project sharing by allowing users to specify project levels, required skills, live project URLs, and project descriptions. Project images can also be uploaded to provide visual context. ProjectNet streamlines developer networking through its connection and search pages. Users can send connection requests, view incoming requests, and search for projects and users by name or skills. It's the go-to platform for developers to showcase their work, collaborate, and grow their professional networks.

## Technologies Used
- Angular
- CSS
- Firebase
- TypeScript

## Features
- User registration and email verification
- User profiles with profile picture and skill details
- Ability to update user profiles with LinkedIn and Twitter links
- Project submission form with project level, title, and skill requirements
- Project details section with live project URL and project description
- Image uploading for project screenshots
- Connection management page with a list of connected users
- Incoming and outgoing connection request tracking
- Project and user search functionality by name
- Project and user search functionality by programming language
- User dashboard for quick access to projects and connections
- User-friendly and responsive design for various screen sizes
- Secure authentication and data storage using Firebase
- Password recovery option via email
- Like and Comment on projects
- Add Projects with features
- Connect with developers
- Get project links
- Share your projects
- Read detailed project descriptions

## Used For
- Connecting developers
- Showcasing projects
- Networking
- Discovering new projects
- Skill development

## Improvements
- Enhance user profile customization options
- Implement a chat/messaging feature for users
- Integrate a code collaboration feature
- Implement machine learning for project recommendations

## Problems Faced
### Problem 1: Search the project by name and skill of the project
- Solution: Collect all project data in the form of an array of objects then implement a function that helps filter the results based on the search text.

### Problem 2: Manage the images of the project on Firestore storage
- Solution: Used the project ID to add images of the project into storage.

## Links
- [Live Application](https://projectnet-b4b88.firebaseapp.com/)
- [GitHub Repository](https://github.com/yashksaini/ProjectNet)

## Getting Started
To clone and run the ProjectNet application locally, follow these steps:
1. Clone the repository from [GitHub](https://github.com/yashksaini/ProjectNet).
2. Install the necessary dependencies by running `npm install` in the project directory.
3. Configure Firebase with your project credentials.
4. Start the development server using `ng serve`.
5. Access the application at `http://localhost:4200/` in your web browser.
