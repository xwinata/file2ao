import File2AO from '../index';

const MOCK_FILE_DATA = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
];

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
jest.mock('nodata.json', () => ({}), { virtual: true });

describe('File2AO tests', () => {
    test('read csv file', () => {
        const file2ao = new File2AO(File2AO.ParameterCSV('mock.csv', {}));

        expect(file2ao.values()).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
    });

    test('read yaml file', () => {
        const file2ao = new File2AO(File2AO.ParameterYAML('mock.yaml'));

        expect(file2ao.values()).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
    });

    test('read json file', () => {
        const file2ao = new File2AO(File2AO.ParameterJSON('mock.json'));

        expect(file2ao.values()).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
    });

    test('smoke test function', () => {
        const createFile2AO = () => (new File2AO(File2AO.ParameterJSON('nodata.json')));

        expect(createFile2AO).toThrow('Failing smoke test. reading result is not an array');
    });

    test('handle invalid parameter', () => {
        const createFile2AO = () => (new File2AO({ extension: 'invalid' as 'json', filePath: 'invalid' }).values());

        expect(createFile2AO).toThrow('Invalid Parameter');
    });
});