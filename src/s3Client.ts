import {
  S3Client as AWSS3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

export class S3Client {
  private client: AWSS3Client;

  constructor() {
    this.client = new AWSS3Client({
      endpoint: process.env.AKAVE_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.AKAVE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AKAVE_SECRET_ACCESS_KEY!,
      },
      region: "us-east-1", // Default region, can be overridden
    });
  }

  async listBuckets() {
    const command = new ListBucketsCommand({});
    const response = await this.client.send(command);
    return response.Buckets || [];
  }

  async listObjects(bucket: string, prefix?: string) {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    const response = await this.client.send(command);
    return response.Contents || [];
  }

  async getObject(bucket: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await this.client.send(command);
    return response.Body;
  }

  async putObject(bucket: string, key: string, body: Buffer | string) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    });
    return await this.client.send(command);
  }

  async getSignedUrl(bucket: string, key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return await getSignedUrl(this.client, command, { expiresIn });
  }
}
