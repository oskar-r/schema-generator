# schema-generator
This is a script that can parse markdown tables and create output that can be used to visualise the data model visualisation

## install & run
```bash
npm install
node md_parse.js http://github.com/raw/link_to.md
```

The script will generate a ```schema.db``` file that can be used on https://dbdiagram.io/

Tested with node v10.15.3
