import { Subject } from './scrape-subject';
import { saveSubjectState } from './subjectState';

/**
 * Handle changed Subject
 */
export async function handleChanged(oldSubject: Subject, newSubject: Subject): Promise<void> {
    console.log(`${newSubject.name} (${newSubject.code}) changed`);

    //Send an email about the change

    //Save the new subject
    await saveSubjectState(newSubject);
}
