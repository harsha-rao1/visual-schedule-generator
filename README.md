# 📅 Visual Schedule Generator

An AI-powered visual daily schedule generator designed to help children with autism navigate their day through visual cards and audio prompts.

## 🎯 Problem Statement

Children with autism struggle with unexpected transitions. This app provides:
- **Visual cards** with icons for each activity
- **Audio narration** using text-to-speech
- **Drag-and-drop** functionality to rearrange schedules
- **Simple text input** that converts to visual schedules

## ✨ Features

### Current Prototype Features
- ✅ Text input → Visual cards conversion
- ✅ Icon mapping for common activities (🌅 Wake up, 🏫 School, 🍽️ Lunch, etc.)
- ✅ Audio playback using Web Speech API
- ✅ Drag-and-drop schedule rearrangement
- ✅ Modern, accessible UI design
- ✅ Responsive layout for tablets and phones

### Future Enhancements (AI Integration)
- 🤖 LLM for task simplification and natural language processing
- 🎨 AI-generated icons using DALL·E or Stable Diffusion
- 🔊 Enhanced text-to-speech with Azure TTS or similar services

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## 📖 How to Use

1. **Enter Daily Plan**: Type your schedule in the text area, one activity per line or separated by commas:
   ```
   Wake up
   Breakfast
   School
   Lunch
   Play time
   Dinner
   Bedtime
   ```

2. **Generate Schedule**: Click the "Generate Schedule" button to create visual cards

3. **Rearrange**: Drag cards by the handle (⋮⋮) to reorder activities

4. **Play Audio**: Click the 🔊 button on any card to hear the activity name

5. **Clear**: Use the "Clear" button to reset and start over

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Drag & Drop**: @dnd-kit
- **Speech**: Web Speech API (browser-native)
- **Styling**: CSS3 with modern gradients and animations

## 📱 Browser Compatibility

- Chrome/Edge: Full support (including Web Speech API)
- Firefox: Full support
- Safari: Full support (Web Speech API may vary)
- Mobile browsers: Responsive design works on tablets and phones

## 🎨 Design Features

- **Accessible**: High contrast, clear typography, keyboard navigation
- **Child-friendly**: Large icons, simple interface, visual feedback
- **Modern UI**: Gradient backgrounds, smooth animations, card-based layout
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🔮 Future Development

### Phase 2: AI Integration
- [ ] Integrate GPT API for intelligent task parsing
- [ ] Add DALL·E/Stable Diffusion for custom icon generation
- [ ] Implement Azure TTS for better voice quality
- [ ] Add schedule templates and suggestions

### Phase 3: Advanced Features
- [ ] Save/load schedules
- [ ] Multiple schedule templates
- [ ] Progress tracking
- [ ] Parent dashboard
- [ ] Custom icon uploads

## 📝 License

This project is a prototype for demonstration purposes.

## 🤝 Contributing

This is a prototype project. For production use, consider:
- Adding error handling
- Implementing proper state management
- Adding unit tests
- Setting up CI/CD
- Adding accessibility audits
