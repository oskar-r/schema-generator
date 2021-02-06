# schema-generator
The program can be used to parse a specific markdown structure and output either a schema.db file that can be visualized with dbdiagram.io or a schema.gql file that can used as a stub for graphql queries. 

## install & run
```bash
npm install
```
### dbdiagrams
```bash
npm run parse:dbd http://github.com/raw/link_to.md
```

### graphql
```bash
npm run parse:graphql http://github.com/raw/link_to.md
```

Output can be found in the root directory.

Tested with node v10.15.3
