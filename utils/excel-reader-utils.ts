
import * as XLSX from 'xlsx';

export function readExcelData<T>(filePath_with_fileName: string, sheetName: string): T[] {
    // Read the Excel workbook
    const workbook = XLSX.readFile(filePath_with_fileName);

    // Get the required worksheet
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        throw new Error(`Worksheet "${sheetName}" not found`);
    }

    // Convert worksheet rows into objects
    const data = XLSX.utils.sheet_to_json<T>(worksheet);
    return data;
    // const data = XLSX.utils.sheet_to_json<T>(worksheet, {defval: '', raw: false});
}
