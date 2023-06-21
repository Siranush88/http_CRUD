import { parentPort } from 'worker_threads';
import fs from 'fs';
import csv from 'csv-parser';
import { writeFile } from 'fs/promises';

function parseCSV(filePath) {

    const startTime = new Date();
    let count = 0;

    const pathChunk = filePath.split('\\')
    const fileName = pathChunk[1].replace(".csv", ".json");

    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            count++;
            results.push(data);
        })
        .on('end', () => {
            const endTime = new Date();
            const duration = endTime - startTime;
            writeFile(`./converted/${fileName}`, JSON.stringify(results, undefined, 2), 'utf-8', (data) => { })
            parentPort.postMessage({ count, duration });
        })
}

parentPort.on('message', message => {
    let filePath = message;
    let result = parseCSV(filePath);
})


// node index.js csv_folder
