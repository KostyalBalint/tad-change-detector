import { Subject } from './scrape-subject';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('./data/');

/**
 * Get a Subjects last saved state from file
 * @param code Code of the subject
 */
export function getSubjectState(code: string): Subject | undefined {
    const fileNames = getSubjectFileNames(code);
    if (fileNames.length > 0) {
        let fileName = fileNames.sort().reverse()[0];
        return getSubjectStateFromFile(code, fileName);
    }
    return undefined;
}

/**
 * Get all saved state files for a subject
 * @param code Code of the subject
 */
export function getSubjectFileNames(code: string): string[] {
    const subjectDir = path.join(BASE_DIR, `${code}`);
    if (fs.existsSync(subjectDir)) {
        return fs.readdirSync(subjectDir);
    } else {
        return [];
    }
}

/**
 * Get a Subjects state by fileName
 * @param code Code of the subject
 * @param fileName Name of the file
 */
export function getSubjectStateFromFile(code: string, fileName: string): Subject | undefined {
    const filePath = path.join(BASE_DIR, code.toUpperCase(), fileName.toLowerCase());
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data) as Subject;
        } catch (e) {
            console.error('Error reading file', filePath, e);
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * Save a Subjects current state to a file
 * Save folder will be the subject code
 * File name will be the current date
 * The content will be the JSON string of the Subject
 * @param subject Subject to save
 */
export async function saveSubjectState(subject: Subject): Promise<void> {
    const subjectDir = path.join(BASE_DIR, `${subject.code}`);
    if (!fs.existsSync(subjectDir)) {
        fs.mkdirSync(subjectDir, { recursive: true });
    }
    const date = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');
    const filePath = path.join(subjectDir, `${date}.json`);
    fs.writeFileSync(filePath, JSON.stringify(subject));
}
