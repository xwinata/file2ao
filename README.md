# File to Array of Object
Syncronously read structured rows in files and convert them into array of objects

# Supported files
- CSV
- YAML
- JSON

# Usage Example
## JSON file
```
import File2AO from 'file2ao';

const jsonAO = new File2AO({
  extension: 'json',
  filePath: './file.json',
});

# -- OR --
# const jsonAO = new File2AO(
#   File2AO.ParameterJSON('./file.json')
# );

# file.json
# {
#   "data": [{...}, {...}, ...]
# }

console.log(jsonAO.values()); // [{...}, {...}, ...]
```
## CSV file
```
import File2AO from 'file2ao';

const csvAO = new File2AO({
  extension: 'csv',
  filePath: './file.csv',
  options: {
    headers: ['name', 'age'],
    separator: ',',
    skipLines: 1,
  }
});

# -- OR --
# const csvAO = new File2AO(
#    File2AO.ParameterCSV('./file.json', {
#       headers: ['name', 'age'],
#       separator: ',',
#       skipLines: 1,
#    }
# );

# file.csv
# name, age
# Abe,12
# Gabe,13
# }

console.log(csvAO.values()); // [{name: Abe, age: 12}, {name: Gabe, age: 13}]
```
## YAML file
```
import File2AO from 'file2ao';

const yamlAO = new File2AO({
  extension: 'yaml',
  filePath: './file.yaml',
});

# -- OR --
# const yamlAO = new File2AO(File2AO.ParameterYAML('./file.yaml');

# file.yaml
# - name: Abe
#   age: 12
# - name: Gabe
#   age: 13

console.log(yamlAO.values()); // [{name: Abe, age: 12}, {name: Gabe, age: 13}]
```
you can also target specific element in yaml
```
const yamlAO = new File2AO({
  ...,
  targetElement: 'students',
});

# -- OR --
# const yamlAO = new File2AO(File2AO.ParameterYAML('./file.yaml', 'students');

# file.yaml
# students:
#   - name: Abe
#     age: 12
#   - name: Gabe
#     age: 13

console.log(yamlAO.values()); // [{name: Abe, age: 12}, {name: Gabe, age: 13}]
```
# Installation
```
npm i file2ao
```
