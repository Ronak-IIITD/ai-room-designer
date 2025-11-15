# Contributing to AI Room Designer

Thank you for your interest in contributing to the AI Room Designer! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 **Report bugs** - Help us identify and fix issues
- ✨ **Suggest features** - Share ideas for new functionality
- 📝 **Improve documentation** - Help make our docs better
- 💻 **Submit code** - Fix bugs or implement new features
- 🎨 **Design improvements** - Enhance UI/UX
- 🧪 **Write tests** - Improve code coverage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase account (for backend features)
- OpenRouter API key (for AI features)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-room-designer.git
   cd ai-room-designer
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install Functions dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Start development server**
   ```bash
   # Option 1: With Firebase Emulators (recommended)
   firebase emulators:start  # In one terminal
   npm run dev               # In another terminal
   
   # Option 2: Connect to live Firebase
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test              # Run in watch mode
   npm run test:run      # Run once
   npm run test:coverage # Generate coverage report
   ```

## 📋 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

Examples:
- `feature/add-room-templates`
- `fix/image-upload-validation`
- `docs/update-api-guide`

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add email verification
fix(upload): handle large image files correctly
docs(readme): update installation instructions
test(utils): add tests for file validation
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the project's code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint          # Check code style
   npm run type-check    # Check TypeScript types
   npm run test:run      # Run all tests
   npm run build         # Ensure it builds
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Link any related issues

### Pull Request Guidelines

- ✅ **DO:**
  - Keep PRs focused on a single concern
  - Write clear, descriptive PR titles
  - Include tests for new features
  - Update documentation
  - Follow the existing code style
  - Respond to review feedback

- ❌ **DON'T:**
  - Submit large PRs with multiple unrelated changes
  - Include commented-out code
  - Leave console.log statements (use the logger utility)
  - Commit `.env` files or secrets
  - Break existing tests

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types (use `unknown` if necessary)
- Define interfaces for complex objects
- Use proper type annotations

**Example:**
```typescript
// Good ✅
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad ❌
function getUser(id: any): any {
  // ...
}
```

### React

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components small and focused
- Use proper prop types with TypeScript
- Handle loading and error states

**Example:**
```typescript
// Good ✅
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Bad ❌
export const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### Naming Conventions

- **Files:** `camelCase.tsx` for components, `camelCase.ts` for utilities
- **Components:** `PascalCase`
- **Functions:** `camelCase`
- **Constants:** `SCREAMING_SNAKE_CASE`
- **Interfaces:** `PascalCase` with descriptive names

### Logging

**Never use `console.log` directly.** Use the logger utility:

```typescript
import { logger } from '@/utils/logger';

// Development only
logger.debug('Debug information', { data });
logger.info('Informational message');
logger.warn('Warning message');

// Always logged (even in production)
logger.error('Error occurred', error);
```

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Maintain at least 70% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { validateFile } from '@/utils/fileUtils';

describe('validateFile', () => {
  it('should accept valid image files', () => {
    // Arrange
    const file = createMockFile('test.jpg', 1024, 'image/jpeg');
    
    // Act
    const result = validateFile(file);
    
    // Assert
    expect(result.isValid).toBe(true);
  });

  it('should reject files that are too large', () => {
    const file = createMockFile('large.jpg', 15 * 1024 * 1024, 'image/jpeg');
    const result = validateFile(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceeds the maximum allowed size');
  });
});
```

### Running Tests

```bash
npm test              # Watch mode (interactive)
npm run test:run      # Run once
npm run test:ui       # Visual UI for tests
npm run test:coverage # Coverage report
```

## 📚 Documentation

### Code Documentation

Add JSDoc comments for exported functions:

```typescript
/**
 * Validates an uploaded file against size and type constraints
 * 
 * @param file - The file to validate
 * @param options - Optional validation configuration
 * @returns Validation result with error details if invalid
 * 
 * @example
 * ```typescript
 * const result = validateFile(uploadedFile);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateFile(
  file: File,
  options?: Partial<FileValidationOptions>
): ValidationResult {
  // ...
}
```

### README Updates

When adding new features:
- Update feature list in README.md
- Add usage examples if applicable
- Update screenshots if UI changed

## 🔒 Security

- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Both client and server side
- **Use parameterized queries** - Prevent injection attacks
- **Keep dependencies updated** - Run `npm audit` regularly
- **Report security issues privately** - Email security concerns instead of creating public issues

## 🐛 Bug Reports

When filing a bug report, please include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - How to reproduce the bug
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - Browser, OS, Node version
6. **Screenshots** - If applicable
7. **Error Messages** - Console errors or stack traces

## ✨ Feature Requests

When suggesting a feature:

1. **Use Case** - Why is this feature needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other solutions you've considered
4. **Additional Context** - Mockups, examples, etc.

## 📞 Getting Help

- 💬 **GitHub Discussions** - Ask questions and discuss ideas
- 🐛 **GitHub Issues** - Report bugs and request features
- 📧 **Email** - For security issues or sensitive topics

## 🙏 Code of Conduct

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

### Unacceptable Behavior

- ❌ Harassment or discriminatory language
- ❌ Trolling or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information

## 📜 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

## 🎉 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes for significant contributions
- Given credit in commit messages

Thank you for contributing to AI Room Designer! 🚀
