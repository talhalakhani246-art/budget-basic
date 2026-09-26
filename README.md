# BudgetBasic 💸 - Student-Friendly Finance Lab

BudgetBasic is an interactive, educational platform designed to help students learn the basics of budgeting, manage expenses, set saving goals, and understand the core differences between needs and wants. Built with React and Vite, the platform provides a completely client-side interactive experience—ensuring privacy while delivering smart financial learning.

## 🚀 Getting Started (Installation & Running)

Follow these steps to set up and run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- `npm` (Node Package Manager)

### Installation
1. **Navigate to the React project directory:**
   Open your terminal and go to the react folder:
   ```bash
   cd react
   ```
2. **Install Dependencies:**
   Run the following command to install all required React packages (like `react-router-dom`):
   ```bash
   npm install
   ```

### Running the Project
1. **Start the Development Server:**
   ```bash
   npm run dev
   ```
2. **View in Browser:**
   Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173/`).

---

## 🌟 Features & Sections Explained

The application consists of multiple interactive learning modules across different pages (`Home`, `Dashboard`, `Login`, `Signup`):

### 1. Foundations: Budgeting Basics
- **Overview:** Interactive cards explaining core concepts: Income, Fixed Expenses, Variable Expenses, and Savings.
- **Knowledge Check:** A quick quiz section testing the user's understanding of essential vs. optional expenses with dynamic feedback.

### 2. Choices: Needs vs. Wants
- **Overview:** A side-by-side comparison of essential needs (like food, basic transport) and optional wants (like gaming extras, eating out).
- **Interactive Classifier:** A built-in game where users classify real-world scenarios as "Need" or "Want", providing immediate educational feedback.

### 3. The Rule: 50 / 30 / 20 Budget Calculator
- **Overview:** A visual and interactive calculator to teach the popular 50/30/20 budgeting rule.
- **How it works:** Users enter a monthly income, and the tool automatically splits it into 50% Needs, 30% Wants, and 20% Savings, complete with dynamic progress bars.

### 4. Future You: Savings Goals
- **Overview:** A tool to help plan for future purchases (e.g., a new laptop or phone).
- **How it works:** Users input their target amount, current savings, and planned monthly contribution. The tool estimates how many months it will take to reach the goal.

### 5. Track: Expense Planner
- **Overview:** A real-time, session-based expense tracker.
- **How it works:** Users can add sample expenses by date, category, and description. It automatically calculates total spending, counts entries, and displays the remaining balance against the user's defined income. Data is kept locally on the client for privacy.

### 6. Avoidable: Common Money Mistakes
- **Overview:** An accordion-style interactive list of typical financial pitfalls students face (impulse buying, unused subscriptions, late payments) paired with practical corrective actions.

### 7. Visual Learning: Infographics Gallery
- **Overview:** A filterable gallery of visual cards presenting budgeting concepts (Needs vs Wants, Budget Cycle, Saving Challenges). Users can filter them by topic.

### 8. Find It Fast: Search Learning Content
- **Overview:** A quick search engine to find specific tips, examples, or topics within the platform. Type keywords like "saving" or "expenses" to see relevant matches instantly filtered from the platform's content.

### 9. AI Learning Assistant (Chatbot)
- **Overview:** A simulated rule-based educational assistant. 
- **How it works:** Users can ask questions about budgeting in the chat interface. The bot responds using a set of predefined keywords to guide the learning process without needing an external API key.

### 10. Dashboard & Authentication
- **Overview:** The app includes `Login` and `Signup` pages that map to a personalized `Dashboard`.
- **Features:** 
  - **Theme Toggle:** Users can switch between Light and Dark modes.
  - **Live Status:** Displays a live clock and simulated visitor count.
  - **Session Management:** Uses `localStorage` to simulate user authentication securely on the client side.
  - **Quick Links:** Direct shortcuts to the learning tools and calculators.

---

## 🛠️ Technologies Used
- **React 19:** The core frontend UI library used to build the components.
- **Vite:** High-performance build tool and development server.
- **React Router (v7):** Handles the client-side routing across different pages (`/`, `/login`, `/signup`, `/dashboard`).
- **Vanilla CSS:** Custom styling (`App.css`, `Dashboard.css`) utilizing CSS variables for responsive layouts, animations, and dark/light themes. No heavy UI frameworks were used, ensuring a highly customized design.
