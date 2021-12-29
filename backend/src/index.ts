import { scrapeUrls } from './scrape-urls';
import { scrapeSubject, scrapeSubjects, Subject } from './scrape-subject';
import express from 'express';
import { getSubjectState, saveSubjectState } from './subjectState';
import { handleChanged } from './handleChanged';
const app = express();

const SITE_URL = 'https://portal.vik.bme.hu';
const COURSES_URL = `${SITE_URL}/kepzes/targyak/`;

main();

let subjects: Subject[] = [];

async function run() {
    console.log('Scraping subjects...');

    //Scrape all the subjects
    const digests = await scrapeUrls(COURSES_URL);
    const subjects = await scrapeSubjects(COURSES_URL, digests.map((c) => c.code).slice(0, 15));

    //Check if any of them changed
    await Promise.all(
        subjects.map(async (subject) => {
            const currentState = await getSubjectState(subject.code);
            if (currentState) {
                if (currentState.rawHtml !== subject.rawHtml) {
                    console.log(`Subject: ${subject.code} changed`);
                    //For the changed ones, send an email, and save the new state
                    await handleChanged(currentState, subject);
                } else {
                    console.log(`(${subject.code}) not changed`);
                }
            } else {
                await saveSubjectState(subject);
                console.log(`(${subject.code}) newly added`);
            }
        }),
    );
    console.log('Scrape complete');
}

async function main(): Promise<void> {
    await run();
    //setInterval(run, 1000 * 60 * 60);
}

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.redirect('/subjects');
});

app.get('/subjects', (req, res) => {
    res.json({ subjects: subjects.map((s) => ({ url: s.url, name: s.name, code: s.code })) });
});

app.get('/subjects/:id', (req, res) => {
    let subject = subjects.find((s) => s.code === req.params.id);
    if (!subject) {
        res.status(404).send('Not found');
        return;
    }
    let newSubject: Subject = {
        ...subject,
        //text: subject.text.replace(/Auto/g, 'béla'),
    };
    res.json({ subject, newSubject });
});
