import CSVreader from './fileReaders/csv';
import YAMLreader from './fileReaders/yaml';
import { isArray } from 'lodash';

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
            extension: 'csv' as const,
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
            extension: 'yaml' as const,
            filePath,
            targetElement
        };
    }

    static ParameterJSON(filePath: string) {
        return {
            extension: 'json' as const,
            filePath,
        }
    }

    private param: File2AOParameter<T>;

    private read: () => T[];

    constructor(
        param: File2AOParameter<T>,
        options: { runSmokeTest: boolean } = { runSmokeTest: true }
    ) {
        this.param = param;

        const runSmokeTest = (arr: T[]) => {
            if (options?.runSmokeTest && !isArray(arr))
                throw new Error('Failing smoke test. reading result is not an array');
        };

        switch (this.param.extension) {
            case 'csv':
                this.read = (new CSVreader<T>(this.param.filePath, this.param.options)).read;
                runSmokeTest(this.read());
                break;
            case 'yaml':
                this.read = (new YAMLreader<T>(this.param.filePath, this.param.targetElement)).read;
                runSmokeTest(this.read());
                break;
            case 'json':
                this.read = () => require(this.param.filePath).data  as T[];
                runSmokeTest(this.read());
                break;
            default:
                throw new Error('Invalid Parameter');
        }
    }

    values(): T[] {
        return this.read();
    }
}

export default File2AO;