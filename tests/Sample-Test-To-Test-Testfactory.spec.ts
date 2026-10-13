import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../data/factories/TestDataFactory';
import { loginDataSchema } from '../data/contracts/login-data.schema';

test('read and validate login data from JSON', () => {
    const records = TestDataFactory.load(
        'loginJson',
        loginDataSchema
    );

    expect(records.length).toBeGreaterThan(0);
    console.log(records);
});