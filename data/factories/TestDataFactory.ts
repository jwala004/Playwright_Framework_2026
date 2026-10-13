// import path from 'node:path';
// import { z } from 'zod';

// import { readJson } from '../test-data-readers/json-reader';
// import { readCsvData } from '../test-data-readers/csv-reader';
// import { readExcelData } from '../test-data-readers/excel-reader';

// import {datasetRegistry,type DatasetName,} from './dataset-registry';

// const DATA_DIRECTORY = path.resolve(process.cwd(),'data','test-data');

// export class TestDataFactory {
//     static load<S extends z.ZodType>(datasetName: DatasetName, schema: S): z.infer<S>[] {
//         const dataset = datasetRegistry[datasetName];

//         const filePath = path.resolve(DATA_DIRECTORY,dataset.file);

//         // Ensure the resolved path remains inside the data directory.
//         const relativePath = path.relative(DATA_DIRECTORY, filePath);

//         if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
//             throw new Error(`Dataset path escapes the data directory: ${datasetName}`);
//         }

//         let rawData: unknown[];

//         switch (path.extname(filePath).toLowerCase()) {
//             case '.json':
//                 rawData = readJson<unknown>(filePath);
//                 break;

//             case '.csv':
//                 rawData = readCsvData<unknown>(filePath);
//                 break;

//             case '.xlsx':
//                 rawData = readExcelData<unknown>(filePath, 'sheetName' in dataset? dataset.sheetName: undefined);
//                 break;

//             default:
//                 throw new Error(`Unsupported data format for "${datasetName}"`);
//         }

//         if (rawData.length === 0) {
//             throw new Error(
//                 `Dataset "${datasetName}" contains no records.`
//             );
//         }

//         const result = z.array(schema).safeParse(rawData);

//         if (!result.success) {
//             const details = result.error.issues.map(issue => ({
//                 record:
//                     typeof issue.path[0] === 'number'
//                         ? issue.path[0] + 1: 'unknown',
//                 field: issue.path.slice(1).join('.') || '(record)', message: issue.message,
//             }));

//             throw new Error(`Validation failed for dataset "${datasetName}":\n` + JSON.stringify(details, null, 2));
//         }

//         return result.data;
//     }
// }
import path from 'node:path';
import { z } from 'zod';

import { readJson } from '../test-data-readers/json-reader';
import { readCsvData } from '../test-data-readers/csv-reader';
import { readExcelData } from '../test-data-readers/excel-reader';

const DATA_DIRECTORY = path.resolve(
    process.cwd(),
    'data',
    'test-data'
);

export interface TestDataOptions {
    sheetName?: string;
}

export class TestDataFactory {
    static load<S extends z.ZodType>(
        filePath: string,
        schema: S,
        options?: TestDataOptions
    ): z.infer<S>[] {
        // Resolve relative paths from the test-data directory.
        const resolvedPath = path.resolve(DATA_DIRECTORY, filePath);

        // Restrict files to the configured test-data directory.
        const relativePath = path.relative(
            DATA_DIRECTORY,
            resolvedPath
        );

        if (
            relativePath === '..' ||
            relativePath.startsWith(`..${path.sep}`) ||
            path.isAbsolute(relativePath)
        ) {
            throw new Error(
                `Test-data path must remain inside "${DATA_DIRECTORY}"`
            );
        }

        let rawData: unknown[];

        switch (path.extname(resolvedPath).toLowerCase()) {
            case '.json':
                rawData = readJson<unknown>(resolvedPath);
                break;

            case '.csv':
                rawData = readCsvData<unknown>(resolvedPath);
                break;

            case '.xlsx':
                rawData = readExcelData<unknown>(
                    resolvedPath,
                    options?.sheetName
                );
                break;

            default:
                throw new Error(
                    `Unsupported test-data format: "${resolvedPath}". ` +
                    'Supported formats: .json, .csv, .xlsx'
                );
        }

        if (!Array.isArray(rawData) || rawData.length === 0) {
            throw new Error(
                `No test records found in "${resolvedPath}".`
            );
        }

        const result = z.array(schema).safeParse(rawData);

        if (!result.success) {
            const details = result.error.issues.map(issue => ({
                record:
                    typeof issue.path[0] === 'number'
                        ? issue.path[0] + 1
                        : 'unknown',
                field: issue.path.slice(1).join('.') || '(record)',
                message: issue.message,
            }));

            throw new Error(
                `Validation failed for "${resolvedPath}":\n` +
                JSON.stringify(details, null, 2)
            );
        }

        return result.data;
    }
}