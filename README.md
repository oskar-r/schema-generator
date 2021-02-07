# schema-generator
The program can be used to parse a specific markdown structure and output either a schema.db file that can be visualized with dbdiagram.io or a schema.gql file that can used as a stub for graphql queries. 

## Install & generate schema
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

## Inspect graphql schema
If a graphql schema was created you can interact with it using a simple Apollo-express server.
### Node
Start the Apllo-express server from the command line with
```bash
npm run server
```
### Docker
There is a provided docker images that can be built
```bash
docker build . -t gql-test/apollo-server
docker run -p 4000:4000 --name apollo gql-test/apollo-server
```
Once the server is up you can access <a href="http://localhost:4000/graphql">http://localhost:4000/graphql</a> to inspect the generated schema and look at the docs

To interact with the schema test out the query below (change xxx) to an base property in your schema. 
```js
query {
  xxx{
    xxx
  }
}
```
Tested with node v10.15.3
