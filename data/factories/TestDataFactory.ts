import path from 'node:path';
import { z } from 'zod';

import { readJson } from '../test-data-readers/json-reader';
import { readCsvData } from '../test-data-readers/csv-reader';
import { readExcelData } from '../test-data-readers/excel-reader';

// const DATA_DIRECTORY = path.resolve(process.cwd(),'data','test-data');

export interface TestDataOptions {
    sheetName?: string;
}

export class TestDataFactory {
    
    static load<S extends z.ZodType>(fileName_with_filePath: string, schema: S, options?: TestDataOptions): z.infer<S>[] {
        // Resolve relative paths from the test-data directory.
        // const resolvedPath = path.resolve(DATA_DIRECTORY, filePath);

        // Restrict files to the configured test-data directory.
        // const relativePath = path.relative(DATA_DIRECTORY, resolvedPath);

        if (
            fileName_with_filePath === '..' ||
            fileName_with_filePath.startsWith(`..${path.sep}`) ||
            path.isAbsolute(fileName_with_filePath)
        ) {
            throw new Error(`Test-data path must remain inside "${fileName_with_filePath}"`);
        }

        let rawData: unknown[];

        switch (path.extname(fileName_with_filePath).toLowerCase()) {
            case '.json':
                rawData = readJson<unknown>(fileName_with_filePath);
                break;

            case '.csv':
                rawData = readCsvData<unknown>(fileName_with_filePath);
                break;

            case '.xlsx':
                rawData = readExcelData<unknown>(fileName_with_filePath, options?.sheetName);
                break;

            default:
                throw new Error(`Unsupported test-data format: "${fileName_with_filePath}". ` +'Supported formats: .json, .csv, .xlsx');
        }

        if (!Array.isArray(rawData) || rawData.length === 0) {
            throw new Error(`No test records found in "${fileName_with_filePath}".`);
        }

        const result = z.array(schema).safeParse(rawData);

        if (!result.success) {
            const details = result.error.issues.map(issue => ({
                record: typeof issue.path[0] === 'number' ? issue.path[0] + 1 : 'unknown',
                field: issue.path.slice(1).join('.') || '(record)',
                message: issue.message,
            }));

            throw new Error(`Validation failed for "${fileName_with_filePath}":\n` + JSON.stringify(details, null, 2));
        }
        return result.data;
    }
}