import yaml from 'js-yaml';
import fs from 'fs';

class YAMLreader<T> {
    filePath: string;

    targetElement?: string;

    constructor(filePath: string, targetElement?: string) {
        this.filePath = filePath;
        this.targetElement = targetElement;
    }

    read(): T[] {
        let read;

        if (this.targetElement) {
            // to target specific element in yaml file if its not in an array format.
            // example:
            //   anchors:
            //     anchor1: &anchor1
            //     ...
            //   data: (records are in here, therefore targetElement = 'data')
            //     - [actual data]
            //     ...
            read = yaml.load(fs.readFileSync(this.filePath, 'utf8')) as Record<string, unknown>;

            return read[this.targetElement] as T[];
        }

        read = yaml.load(fs.readFileSync(this.filePath, 'utf8')) as T[];
        return read;
    }
}

export default YAMLreader;