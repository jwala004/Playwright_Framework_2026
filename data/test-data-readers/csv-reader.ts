import { parse } from 'csv-parse/sync';
import * as fs from 'node:fs';

export function readCsvData<T>(fileName_with_filePath: string): T[] {
    if (!fs.existsSync(fileName_with_filePath)) {
        throw new Error(`CSV file not found: ${fileName_with_filePath}`);
    }

    const csvContent = fs.readFileSync(fileName_with_filePath, 'utf-8');
    const data = parse(csvContent, {columns: true, skip_empty_lines: true, trim: true, bom: true}) as T[];

    if (data.length === 0) {
        throw new Error(`No test data found in ${fileName_with_filePath}`);
    }
    return data;
}
