import { scrapeUrls } from './scrape-urls';
import { scrapeSubjects, Subject } from './scrape-subject';
import express from 'express';
const app = express();

app.set('view engine', 'ejs');

const SITE_URL = 'https://portal.vik.bme.hu';
const ALL_COURSES_URL = `${SITE_URL}/kepzes/targyak/`;

main();

let subjects: Subject[] = [];

async function main(): Promise<void> {
    const urls = await scrapeUrls(ALL_COURSES_URL);
    subjects = await scrapeSubjects(SITE_URL, urls.slice(0, 10));
}

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
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
        htmlDataFields: subject.htmlDataFields.replace(/Auto/g, 'béla'),
    };
    res.json({ subject, newSubject });
});
