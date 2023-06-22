import path from 'path';
import { Worker } from 'worker_threads';
import { readdir } from 'fs/promises'

export default async function CsvToJson(directoryPath) {
  
const csvFilesArray = await readdir(directoryPath);

let numThreads = 0;
let x = 0;

if (csvFilesArray.length <= 10) {
  numThreads = csvFilesArray.length;
} else {
  numThreads = 10;
}

const filesPerThread = Math.ceil(csvFilesArray.length / numThreads);

for (let i = 0; i < numThreads; i++) {
  const worker = new Worker('./worker.js');
  ++x;

  worker.on('online', () => {
    const start = i * filesPerThread;
    const end = (i + 1) * filesPerThread;
    
    for (let j = start; j < end && j < csvFilesArray.length; j++) {
      const csvFilePath = path.join(directoryPath, csvFilesArray[j]);
      worker.postMessage(csvFilePath);
    }
  });

  worker.on('message', (message) => {
    const { count, duration } = message;
    console.log(`Parsing ${ csvFilesArray[i]} took ${duration} milliseconds to read ${count} lines`);
  });
}

}
