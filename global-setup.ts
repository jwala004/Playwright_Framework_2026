import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig): Promise<void> {
  // Read package.json dynamically to fetch installed dependency versions
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  let playwrightVersion = 'Unknown';
  let typescriptVersion = 'Unknown';

  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    playwrightVersion = allDeps['@playwright/test'] || 'Not found';
    typescriptVersion = allDeps['typescript'] || 'Not found';
  }

  // Print diagnostic summary
  console.log('\n==================================================');
  console.log('📊 TEST SUITE RUNTIME DIAGNOSTICS');
  console.log('==================================================');
  console.log(`🟢 Node.js Version : ${process.version}`);
  console.log(`🟢 OS Platform     : ${process.platform} (${process.arch})`);
  console.log(`🟢 Playwright      : ${playwrightVersion}`);
  console.log(`🟢 TypeScript      : ${typescriptVersion}`);
  console.log(`🟢 Workers Count   : ${config.workers}`);
  console.log(`🟢 CI Environment  : ${process.env.CI ? 'Yes (GitHub Actions)' : 'No (Local Machine)'}`);
  console.log('==================================================\n');
}

export default globalSetup;