# Contributing to Hackathon Management Platform

First off, thank you for considering contributing to this project! It's people like you that make this platform great.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution** if you have one
- **Alternative solutions** you've considered

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** - ensure nothing breaks
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add awesome feature"
   git commit -m "fix: resolve issue with XYZ"
   git commit -m "docs: update installation guide"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** with a detailed description

## Development Setup

1. Clone your fork:

   ```bash
   git clone https://github.com/Gurugokul05/Hackathon-Management-Portal.git
   ```

2. Install dependencies:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Set up environment variables (see README.md)

4. Run tests before submitting:
   ```bash
   npm test
   ```

## Coding Standards

### JavaScript/Node.js

- Use **ESLint** configuration provided
- Follow **camelCase** for variables and functions
- Use **PascalCase** for React components
- Add **JSDoc comments** for complex functions
- Keep functions **small and focused**
- Use **async/await** over callbacks

### React

- Use **functional components** with hooks
- Keep components **single-responsibility**
- Extract reusable logic into **custom hooks**
- Use **prop-types** or TypeScript for type checking
- Follow the existing **folder structure**

### Git Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add email verification for team registration`

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good code coverage
- Test edge cases

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update API documentation for new endpoints
- Include examples where helpful

## Pull Request Review Process

1. Automated checks will run (linting, tests)
2. Maintainers will review your code
3. Address any requested changes
4. Once approved, your PR will be merged

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## Recognition

Contributors will be acknowledged in the README and release notes.

---

Thank you for contributing! 🎉
