import csv from 'csv-parser';
import fs from 'fs';

// https://www.npmjs.com/package/csv-parser#options

export default class CSVreader<T> {
    rows: T[];

    constructor(filePath: fs.PathLike, csvOptions: csv.Options) {
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
};