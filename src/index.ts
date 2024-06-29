import CSVreader from './fileReaders/csv';
import YAMLreader from './fileReaders/yaml';
import _ from 'lodash';

type File2AOParameter<T> = 
    ReturnType<typeof File2AO.ParameterCSV<T>> |
    ReturnType<typeof File2AO.ParameterYAML<T>> |
    ReturnType<typeof File2AO.ParameterJSON>;

class File2AO<T extends Record<string, unknown>> {

    static ParameterCSV<T>(
        filePath: ConstructorParameters<typeof CSVreader<T>>[0],
        options: ConstructorParameters<typeof CSVreader<T>>[1]
    ) {
        return {
            extension: 'csv' as 'csv',
            filePath,
            options,
        }
    }

    static ParameterYAML<T>(
        filePath: ConstructorParameters<typeof YAMLreader<T>>[0],
        targetElement?: ConstructorParameters<typeof YAMLreader<T>>[1]
    ): {
        extension: 'yaml';
        filePath: string;
        targetElement?: string;
    } {
        return {
            extension: 'yaml' as 'yaml',
            filePath,
            targetElement
        };
    }

    static ParameterJSON(filePath: string) {
        return {
            extension: 'json' as 'json',
            filePath,
        }
    }

    private param: File2AOParameter<T>;

    private csvReader?: CSVreader<T>;
    private yamlReader?: YAMLreader<T>;
    private jsonReader?: T[];

    constructor(
        param: File2AOParameter<T>,
        options: { runSmokeTest: boolean } = { runSmokeTest: true }
    ) {
        this.param = param;

        const runSmokeTest = (arr: T[]) => {
            if (options?.runSmokeTest && !_.isArray(arr))
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
                this.jsonReader = require(this.param.filePath).data  as T[];
                runSmokeTest(this.jsonReader);
                break;
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

export default File2AO;