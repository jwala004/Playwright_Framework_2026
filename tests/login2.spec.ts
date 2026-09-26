import { test, expect } from '@playwright/test';
import { config } from '../config/env.config';

test.use({ storageState: { cookies: [], origins: [] } });
