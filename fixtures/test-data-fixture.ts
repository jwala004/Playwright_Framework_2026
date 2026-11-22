import { test as base } from '@playwright/test';

// 1. Define the TypeScript type for your data
type UserData = {
  username: string;
  password: string;
};

// 2. Extend the base testdata with your custom fixture
export const testdata = base.extend<{ userData: UserData }>({
  userData: async ({}, use) => {
    const data: UserData = {
      username: 'standard_user',
      password: 'secret_password',
    };

    // 3. Pass the single dataset to the test
    await use(data);
  },
});