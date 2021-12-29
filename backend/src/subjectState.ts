import { Subject } from './scrape-subject';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('./data/');

/**
 * Get a Subjects last saved state from file
 * @param code Code of the subject
 */
export async function getSubjectState(code: string): Promise<Subject | undefined> {
    const subjectDir = path.join(BASE_DIR, `${code}`);
    if (fs.existsSync(subjectDir)) {
        let fileName = fs.readdirSync(subjectDir).sort().reverse()[0];
        if (fileName) {
            const filePath = path.join(subjectDir, fileName);
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } else {
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
        fs.mkdirSync(subjectDir);
    }
    const date = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');
    const filePath = path.join(subjectDir, `${date}.json`);
    fs.writeFileSync(filePath, JSON.stringify(subject));
}
