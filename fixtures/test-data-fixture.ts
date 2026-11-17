import { test as base } from '@playwright/test';

// 1. Define the TypeScript type for your data
type UserData = {
  username: string;
  password: string;
};

// 2. Extend the base test with your custom fixture
export const test = base.extend<{ userData: UserData }>({
  userData: async ({}, use) => {
    const data: UserData = {
      username: 'standard_user',
      password: 'secret_password',
    };

    // 3. Pass the single dataset to the test
    await use(data);
  },
});

export { expect } from '@playwright/test';
