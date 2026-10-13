import { readFileSync } from 'node:fs';
import * as fs from 'node:fs';

export function readJson<T>(fileName_with_filePath: string): T[] {
    // Check if file exists
    if (!fs.existsSync(fileName_with_filePath)) {
        throw new Error(`Json file not found: ${fileName_with_filePath}`);
    }
   
    // Read the Json file
    try {
        const content = readFileSync(fileName_with_filePath, 'utf-8');
        return JSON.parse(content) as T[];
    } catch (error) {
        throw new Error(
            `Failed to read JSON file "${fileName_with_filePath}": ${
                error instanceof Error ? error.message : String(error)
            }`
        );
    }
}
