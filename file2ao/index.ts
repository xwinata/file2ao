import CSVreader from 'fileReaders/csv';
import { YAMLreader } from 'fileReaders/yaml';
import { isArray, isEmpty } from 'lodash';

export class ParameterCSV<T> {
    extension: 'csv';

    filePath: ConstructorParameters<typeof CSVreader<T>>[0];

    options: ConstructorParameters<typeof CSVreader<T>>[1];

    constructor(
        filePath: ConstructorParameters<typeof CSVreader<T>>[0],
        options: ConstructorParameters<typeof CSVreader<T>>[1]
    ) {
        this.extension = 'csv';
        this.filePath = filePath;
        this.options = options;
    }
}

export class ParameterYAML<T> {
    extension: 'yaml';

    filePath: ConstructorParameters<typeof YAMLreader>[0];

    targetElement?: ConstructorParameters<typeof YAMLreader>[1];

    constructor(
        filePath: ConstructorParameters<typeof YAMLreader>[0],
        targetElement?: ConstructorParameters<typeof YAMLreader>[1]
    ) {
        this.extension = 'yaml';
        this.filePath = filePath;
        this.targetElement = targetElement;
    }
}

export class ParameterJSON<T> {
    extension: 'json';

    filePath: string;

    constructor(filePath: string) {
        this.extension = 'json';
        this.filePath = filePath;
    }
}

type File2AOparameter<T> = ParameterCSV<T> | ParameterYAML<T> | ParameterJSON<T>;

export default class File2AO<T extends Record<string, unknown>> {

    private param: File2AOparameter<T>;

    private csvReader?: CSVreader<T>;
    private yamlReader?: YAMLreader<T>;
    private jsonReader?: T[];

    constructor(
        param: File2AOparameter<T>,
        options: { runSmokeTest: boolean } = { runSmokeTest: true }
    ) {
        this.param = param;

        const runSmokeTest = (arr: T[]) => {
            if (options?.runSmokeTest && !isArray(arr))
                throw new Error('Failing smoke test. reading result is not an array');
        };

        switch (this.param.extension) {
            case 'csv':
                this.csvReader = new CSVreader<T>(this.param.filePath, this.param.options);
                runSmokeTest(this.csvReader.read());
                break;
            case 'yaml':
                this.yamlReader = new YAMLreader(this.param.filePath, this.param.targetElement);
                runSmokeTest(this.yamlReader.read());
                break;
            case 'json':
                this.jsonReader = require(this.param.filePath)  as T[];
                runSmokeTest(this.jsonReader);
            default:
                throw new Error('Invalid Parameter');
        }
    }

    values(): T[] {
        switch (this.param.extension) {
            case 'csv':
                return this.csvReader?.read() as T[];
            case 'yaml':
                return this.yamlReader?.read() as T[];
            case 'json':
                return this.jsonReader as T[];
            default:
                throw new Error('Unsupported extension');
        }
    }
}