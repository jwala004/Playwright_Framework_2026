
import XLSX from 'xlsx';
import * as fs from 'node:fs';

export function readExcelData<T>(fileName_with_filePath: string, sheetName?: string): T[] {
    // Check if file exists
        if (!fs.existsSync(fileName_with_filePath)) {
            throw new Error(`CSV file not found: ${fileName_with_filePath}`);
        }
    // Read the Excel workbook
    const workbook = XLSX.readFile(fileName_with_filePath);

    // Get the required worksheet
    const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

    if (!worksheet) {
        throw new Error(
            `Worksheet "${sheetName}" not found in ${fileName_with_filePath}`
        );
    }

    // Convert worksheet rows into objects
    const data = XLSX.utils.sheet_to_json<T>(worksheet);
    
    if (data.length === 0) {
        throw new Error(`No test data found in "${sheetName}"`);
    }
    return data;
}
// const data = XLSX.utils.sheet_to_json<T>(worksheet, {defval: '', raw: false});
