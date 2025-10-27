# Contributing to AI Room Designer

Thank you for your interest in contributing to AI Room Designer! This document provides guidelines and instructions for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Git
- Google Gemini API key (for testing AI features)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/ai-room-designer.git
   cd ai-room-designer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your Gemini API key to .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 Code Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries where needed

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design for all screen sizes
- Test both light and dark themes

### Code Quality
- Run linting before committing: `npm run lint`
- Format code with Prettier: `npm run format`
- Write type-safe code: `npm run type-check`
- Test your changes thoroughly

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Describe the feature and its benefits
- Provide use cases and examples
- Consider backward compatibility
- Discuss implementation approach

## 📋 Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing patterns and conventions
   - Add comments for complex logic

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a pull request on GitHub with:
   - Clear title and description
   - Screenshots for UI changes
   - Link to related issues

## 🧪 Testing

Currently, the project uses manual testing. Future improvements include:
- Unit tests with Jest
- Component tests with Testing Library
- E2E tests with Playwright
- Visual regression tests

## 📚 Documentation

- Update README.md for significant changes
- Add inline code comments
- Update TypeScript types
- Include examples for new features

## 🔧 Architecture Guidelines

### File Structure
```
src/
├── components/     # Reusable UI components
├── services/       # External API integrations
├── hooks/          # Custom React hooks (future)
├── utils/          # Utility functions (future)
├── types/          # TypeScript type definitions (future)
└── constants/      # App constants (future)
```

### Component Guidelines
- Keep components focused and single-purpose
- Use proper TypeScript interfaces for props
- Implement proper error handling
- Make components reusable when possible

### State Management
- Use local state with `useState` for component-specific data
- Use `useContext` for global state (if needed)
- Consider Zustand or Redux Toolkit for complex state

## 🎯 Roadmap Contributions

Priority areas for contributions:
- **Testing**: Add comprehensive test suite
- **Accessibility**: Improve ARIA labels and keyboard navigation
- **Performance**: Optimize image processing and loading
- **Features**: Batch processing, style presets, export options
- **Mobile**: Enhanced mobile experience

## ❓ Questions

- Create a [Discussion](https://github.com/your-repo/discussions) for questions
- Join our community chat (future)
- Check existing issues and documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for helping make AI Room Designer better! 🎨✨