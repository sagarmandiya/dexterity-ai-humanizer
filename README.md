# 🤖 AI Humanizer

**AI Humanizer** is a web application that transforms AI-generated text into more natural, human-like content. Users can specify readability level, purpose, and strength of transformation to suit their needs.

🔗 **Live Demo**: [dexterity-ai-humanizer.lovable.app](https://dexterity-ai-humanizer.lovable.app/)

---

## 🛠️ Overview

This tool integrates with the [Undetectable.ai Humanizer API (v2)](https://help.undetectable.ai/en/article/humanization-api-v2-p28b2n/) to provide advanced options for rewriting and humanizing text. In cases where API usage is unavailable, a simulated transformation is used to demonstrate functionality.

---

## ✨ Features

- **Humanize AI-Generated Text** with customizable options:
  - **Readability**: High School, University, Doctorate, etc.
  - **Purpose**: Essay, Article, Report, Cover Letter, etc.
  - **Strength**: Balanced, Quality, More Human
- **Toggle Live API Mode**
- **Fallback Simulation** when API access is unavailable
- **Save Projects** including input/output and usage metrics
- **Credit-Based Usage** via Supabase integration

---

## 📦 Tech Stack

- **React** + **TypeScript**
- **TailwindCSS** 
- **Supabase** (database and auth)
- **Undetectable.ai API**
- UI Components: `@/components/ui/*`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sagarmandiya/dexterity-ai-humanizer.git
cd ai-humanizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables
- Create a .env.local file in project root

```bash
VITE_UNDETECTABLE_API_KEY=your_api_key
VITE_UNDETECTABLE_USER_ID=your_user_id
VITE_USE_API=true
```

### 4. Run the Applicaton
- Create a .env.local file in project root

```bash
npm run dev
```

---

## 🧪 Notes

If API credits are unavailable or the key is invalid, a simulated transformation runs locally to ensure smooth functionality and a consistent user experience.