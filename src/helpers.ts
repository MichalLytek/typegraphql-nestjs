import { printSchemaWithDirectives } from "@graphql-tools/utils";
import { FederationVersion } from "@nestjs/graphql";
import { GraphQLSchema } from "graphql";

const importUrl = "https://specs.apollo.dev/federation/v2.0";
const directives = [
  "@key",
  "@shareable",
  "@external",
  "@override",
  "@requires",
  "@tag",
  "@inaccessible",
  "@extends",
  "@provides",
];
const directivesString = directives.map(it => `"${it}"`).join(", ");

export function printSubgraphSchema(
  schema: GraphQLSchema,
  federationVersion: FederationVersion,
) {
  let typeDefs = printSchemaWithDirectives(schema);
  if (federationVersion === 2) {
    typeDefs = typeDefs.replace(
      "schema",
      `extend schema @link(url: "${importUrl}", import: [${directivesString}])`,
    );
  }
  return typeDefs;
}
