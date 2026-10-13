import path from 'node:path';

export const PROJECT_ROOT = process.cwd();

export const DATA_DIRECTORY = path.resolve(
    PROJECT_ROOT,
    'data',
    'test-data'
);