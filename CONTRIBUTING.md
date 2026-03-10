# Contributing to Google-Form-Question-Uploader

Thank you for your interest in contributing to this project!

## How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search the issue tracker to see if the bug has already been reported
2. **Create a new issue** - Use the bug report template and provide:
   - Clear title and description
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. **Check existing feature requests** - Search to see if similar features exist
2. **Create a feature request** - Use the feature request template and describe:
   - The problem you're trying to solve
   - Proposed solution
   - Alternative solutions considered
   - Any relevant examples or mockups

### Pull Requests

#### Before You Start

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

#### Development Setup

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

#### Code Style Guidelines

- Use consistent formatting (ESLint is configured)
- Write meaningful commit messages
- Comment complex code sections
- Keep functions small and focused
- Use descriptive variable and function names

#### Commit Message Format

Use conventional commits:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons)
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

Example:
```
feat(auth): add Google OAuth refresh token handling

- Implement token refresh mechanism
- Add error handling for expired tokens
- Update auth middleware to handle refresh

Closes #123
```

#### Testing

- Add tests for new features
- Ensure all tests pass before submitting PR
- Test both success and error scenarios

#### Submitting Your PR

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request using the template
3. Fill in all required sections
4. Wait for review - we typically respond within 48 hours

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help others learn
- Accept constructive criticism professionally
- Focus on what's best for the community

### Recognition

Contributors will be recognized in the README.md file.

---

If you have any questions, feel free to open a discussion or ask in the community!

