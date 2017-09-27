# mean-crud-generator
A command-line tool for creating CRUD operations using the MEAN stack (MongoDB, ExpressJS, Angular and NodeJS).

## Installation
```bash
$ npm install -g mean-crud-generator
```

## Usage
Generates the following frontend and backend files based on templates that can be easily customized or extended:
- Mongoose model
- ExpressJS controller
- ExpressJS route
- List view HTML template based on Bootstrap and Angular Material
- Details view HTML template based on Bootstrap and Angular Material

```bash
$ mean-crud-generator entityConfigFile.json
```

### Config file
The config file is a JSON representation of the entity in which the source code will rely on and can be manually generated or via a web interface on http://link-here (https://github.com/fabioseno/mean-crud-metadata-generator)

#### File structure