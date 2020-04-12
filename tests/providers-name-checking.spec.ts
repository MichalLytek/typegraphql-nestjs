import { Test, TestingModule } from "@nestjs/testing";
import { TypeGraphQLModule } from "../src/typegraphql.module";
import { TYPEGRAPHQL_FEATURE_MODULE_OPTIONS } from "../src/constants";
import { Resolver, Query } from "type-graphql";
import fs from "fs";
import path from "path";

describe("Providers name checking", () => {
  @Resolver()
  class TestResolver {
    @Query(() => String)
    async hello(): Promise<String> {
      return "Hello";
    }
  }

  @Resolver()
  class TestResolver2 {
    @Query(() => String)
    async world(): Promise<String> {
      return "World!";
    }
  }

  it("should consider providers with Symbol names", async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeGraphQLModule.forRoot({
          emitSchemaFile: true,
        }),
      ],
      providers: [
        {
          provide: `${TYPEGRAPHQL_FEATURE_MODULE_OPTIONS}_1`,
          useClass: TestResolver,
        },
        {
          provide: Symbol(`${TYPEGRAPHQL_FEATURE_MODULE_OPTIONS}_2`),
          useClass: TestResolver2,
        },
      ],
    }).compile();
    expect(module).toBeDefined();
    const schemaExpected = fs.readFileSync(
      path.join(__dirname, "./fixtures/schema.gql"),
      "utf-8",
    );
    const schemaReturned = fs.readFileSync(
      path.join(__dirname, "../schema.gql"),
      "utf-8",
    );
    expect(schemaReturned).toEqual(schemaExpected);
  });

  afterAll(async () => {
    fs.unlinkSync(path.join(__dirname, "../schema.gql"));
  });
});
