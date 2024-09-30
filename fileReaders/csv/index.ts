import csv from 'csv-parser';
import fs from 'fs';

class CSVreader<T> {
  rows: T[];

  constructor(filePath: string, csvOptions: csv.Options) {
    this.rows = [];
    fs.createReadStream(filePath)
      .pipe(csv(csvOptions))
      .on('data', (data: T) => {
        this.rows.push(data);
      });
  }

  read(): T[] {
    return this.rows as T[];
  }
}

export default CSVreader;
