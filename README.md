# Askar Family Prayer Tracker V2.0

A premium, professional, and interactive family prayer tracking web application. Redesigned and rebuilt to provide a high-quality habit-tracking experience for the Askar family.

## 🕌 Project Overview
The Askar Family Prayer Tracker is a Single-Page Application (SPA) designed to help family members stay consistent with their daily prayers. It features a modern Islamic aesthetic, real-time prayer timing for Istanbul, and advanced data visualization.

### **Core Pages**
*   **Dashboard**: A family-wide overview showing today's progress, next prayer countdown, and a live prayer timeline. *No individual names are shown here for a focused family-wide view.*
*   **Family**: Individual tracking for all six members: **Abdulla, Dana, Mohammed, Iman, Rahma, and Ghofra**. Includes streaks and progress rings.
*   **History**: A powerful review tool with advanced filters (Date, Member, Prayer, Status), search functionality, and toggleable **Timeline** and **Table** views.
*   **Statistics**: Interactive charts powered by `Chart.js`, providing insights into on-time rates and member comparisons.
*   **Settings**: Full control over location (City/Country), calculation methods, visual themes (Dark/Light), and data backups.

## ✨ Key Features
*   **Premium Visual Identity**: Emerald, Navy, and Gold color palette with Islamic geometric patterns and smooth animations.
*   **Intelligent Timing Logic**: Automatically calculates prayer windows (e.g., Dhuhr to Asr) and determines if a prayer was completed **On Time**, **Late**, or **Missed**.
*   **Identity Verification**: Secure password-protected marking for each family member.
*   **Responsive Design**: Optimized for everything from small smartphones to large desktop monitors.
*   **Offline Persistence**: All data is saved in your browser's `localStorage`. No internet is needed after the initial load.
*   **Data Portability**: Export your history to **CSV** (for Excel) or **JSON** (for backups).

## 🚀 How to Open
The app is built using Vanilla HTML, CSS, and JS. No installation is required.

1.  Navigate to the `askar.family` folder on your Desktop.
2.  Double-click `index.html`.
3.  **Local Server (Recommended)**: For the best experience, run a local server:
    ```bash
    cd ~/askar.family && python3 -m http.server 8000
    ```
    Then visit [http://localhost:8000](http://localhost:8000).

## 🛡️ Passwords
Each family member has a simple password (e.g., `abdulla123`). These can be found in the `app.js` file under `CONFIG.passwords`.

## ⚙️ Technical Details
*   **Language**: HTML5, CSS3, JavaScript (ES6+).
*   **API**: [AlAdhan Prayer Times API](https://aladhan.com/prayer-times-api).
*   **Libraries**: 
    *   `Chart.js` for data visualization.
    *   `Canvas Confetti` for perfect-day celebrations.
    *   `FontAwesome` for iconography.
    *   `Google Fonts` (Outfit & Playfair Display).

## 🌍 GitHub Pages Deployment
To host this website for free:
1.  Upload the `askar.family` folder contents to a new GitHub repository.
2.  Go to **Settings > Pages**.
3.  Select the `main` branch as the source.
4.  Your app will be live at `https://yourusername.github.io/your-repo-name/`.

---
*Developed for the Askar Family with ❤️.*
