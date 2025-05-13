import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { S3Client } from "./s3Client";

interface ListObjectsParams {
  bucket: string;
  prefix?: string;
}

interface GetObjectParams {
  bucket: string;
  key: string;
}

interface PutObjectParams {
  bucket: string;
  key: string;
  body: string;
}

interface GetSignedUrlParams {
  bucket: string;
  key: string;
  expiresIn?: number;
}

export class AkaveMCPServer {
  private server: McpServer;
  private s3Client: S3Client;
  private transport: StdioServerTransport;

  constructor() {
    this.s3Client = new S3Client();
    this.server = new McpServer({
      name: "Akave Storage",
      version: "1.0.0",
      description:
        "MCP server for interacting with Akave S3-compatible storage",
    });

    // Register tools
    this.server.tool(
      "list_buckets",
      "List all buckets in Akave storage",
      async () => {
        const buckets = await this.s3Client.listBuckets();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                buckets.map((bucket) => ({
                  name: bucket.Name,
                  creationDate: bucket.CreationDate,
                }))
              ),
            },
          ],
        };
      }
    );

    this.server.tool(
      "list_objects",
      "List objects in a bucket",
      {
        bucket: z.string().describe("Bucket name"),
        prefix: z
          .string()
          .optional()
          .describe("Optional prefix to filter objects"),
      },
      async ({ bucket, prefix }: ListObjectsParams) => {
        const objects = await this.s3Client.listObjects(bucket, prefix);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                objects.map((obj) => ({
                  key: obj.Key,
                  size: obj.Size,
                  lastModified: obj.LastModified,
                }))
              ),
            },
          ],
        };
      }
    );

    this.server.tool(
      "get_object",
      "Get object content from a bucket",
      {
        bucket: z.string().describe("Bucket name"),
        key: z.string().describe("Object key"),
      },
      async ({ bucket, key }: GetObjectParams) => {
        const object = await this.s3Client.getObject(bucket, key);
        if (!object) {
          return {
            content: [
              {
                type: "text",
                text: "Object not found",
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: object.toString(),
            },
          ],
        };
      }
    );

    this.server.tool(
      "put_object",
      "Put object into a bucket",
      {
        bucket: z.string().describe("Bucket name"),
        key: z.string().describe("Object key"),
        body: z.string().describe("Object content"),
      },
      async ({ bucket, key, body }: PutObjectParams) => {
        await this.s3Client.putObject(bucket, key, body);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }),
            },
          ],
        };
      }
    );

    this.server.tool(
      "get_signed_url",
      "Get a signed URL for an object",
      {
        bucket: z.string().describe("Bucket name"),
        key: z.string().describe("Object key"),
        expiresIn: z
          .number()
          .optional()
          .describe("URL expiration time in seconds"),
      },
      async ({ bucket, key, expiresIn }: GetSignedUrlParams) => {
        const url = await this.s3Client.getSignedUrl(bucket, key, expiresIn);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ url }),
            },
          ],
        };
      }
    );

    this.transport = new StdioServerTransport();
  }

  async start() {
    await this.server.connect(this.transport);
    console.log("Akave MCP server started");
  }

  async stop() {
    console.log("Akave MCP server stopped");
  }
}
