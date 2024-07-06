import File2AO from '../index';

const MOCK_FILE_DATA = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
];

describe('File2AO tests', () => {
    const initMock = () => {
        jest.mock('../fileReaders/csv', () => {
            return jest.fn().mockImplementation(() => ({
                read: () => MOCK_FILE_DATA,
            }));
        });
        jest.mock('../fileReaders/yaml', () => {
            return jest.fn().mockImplementation(() => ({
                read: () => MOCK_FILE_DATA,
            }));
        });
        jest.mock('mock.json', () => ({
            data: MOCK_FILE_DATA,
        }), { virtual: true });
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('read csv file', () => {
        initMock();
        const file2ao = new File2AO(File2AO.ParameterCSV('mock.csv', {}));

        expect(file2ao.values()).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
    });

    test('read yaml file', () => {
        initMock();
        const file2ao = new File2AO(File2AO.ParameterYAML('mock.yaml'));

        expect(file2ao.values()).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
    });

    test('read json file', () => {
        initMock();
        const file2ao = new File2AO(File2AO.ParameterJSON('mock.json'));

        expect(file2ao.values()).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
    });

    // test('smoke test function', () => {
    //     jest.mock('mock.json', () => ({}), { virtual: true });

    //     const createFile2AO = () => new File2AO(File2AO.ParameterJSON('mock.json'));

    //     expect(createFile2AO).toThrow('Failing smoke test. reading result is not an array');
    // });
});