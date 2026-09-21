# Complete Enterprise Formatting Setup
To make your Prettier setup fully production-ready, here is the complete project configuration:

1. Add .prettierignore
Just like .gitignore, you should prevent Prettier from wasting time formatting generated build artifacts or test reports.

Create a .prettierignore file in your root folder:

# Ignore build outputs & Playwright artifacts
node_modules/
playwright-report/
test-results/
dist/
build/
package-lock.json

2. Add Formatting Scripts to package.json
Allow developers and CI pipelines to check and fix formatting from the terminal without opening VS Code:

JSON
{
  "scripts": {
    "format:check": "prettier --check \"**/*.{ts,js,json,md,yml}\"",
    "format:fix": "prettier --write \"**/*.{ts,js,json,md,yml}\""
  }
}

=> Running npm run format:check can be added to your CI pipeline to block pull requests if someone bypassed formatting.
=> Running npm run format:fix cleans up the entire repository in one second.

3. Share Recommended VS Code Extensions
To ensure everyone on your team gets prompted to install the Prettier extension when opening the project, create .vscode/extensions.json:

JSON
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-playwright.playwright"
  ]
}

Verification
Open any .ts file (such as your global-setup.ts or a test file).

Add extra random spaces or unaligned indentation.

Save the file (Ctrl + S or Cmd + S).

VS Code will instantly format the entire document cleanly according to your .prettierrc rules!