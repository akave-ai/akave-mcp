import { S3Client as AWSS3Client } from "@aws-sdk/client-s3";
import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  GetBucketLocationCommand,
  ListObjectVersionsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

export class S3Client {
  private client: AWSS3Client;

  constructor() {
    this.client = new AWSS3Client({
      endpoint: process.env.AKAVE_ENDPOINT_URL,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AKAVE_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AKAVE_SECRET_ACCESS_KEY || "",
      },
      forcePathStyle: true,
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
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      return response.Body;
    } catch (error) {
      console.error("Error getting object:", error);
      return null;
    }
  }

  async putObject(bucket: string, key: string, body: string) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    });
    await this.client.send(command);
  }

  async updateObject(bucket: string, key: string, body: string) {
    // S3 putObject overwrites by default
    return this.putObject(bucket, key, body);
  }

  async fetchHeaders(bucket: string, key: string) {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return await this.client.send(command);
  }

  async deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return await this.client.send(command);
  }

  async copyObject(
    sourceBucket: string,
    sourceKey: string,
    destinationBucket: string,
    destinationKey: string
  ) {
    const command = new CopyObjectCommand({
      Bucket: destinationBucket,
      Key: destinationKey,
      CopySource: `/${sourceBucket}/${sourceKey}`,
    });
    return await this.client.send(command);
  }

  async createBucket(bucket: string) {
    const command = new CreateBucketCommand({
      Bucket: bucket,
    });
    return await this.client.send(command);
  }

  async deleteBucket(bucket: string) {
    const command = new DeleteBucketCommand({
      Bucket: bucket,
    });
    return await this.client.send(command);
  }

  async getBucketLocation(bucket: string) {
    const command = new GetBucketLocationCommand({
      Bucket: bucket,
    });
    return await this.client.send(command);
  }

  async listObjectVersions(bucket: string, prefix?: string) {
    const command = new ListObjectVersionsCommand({
      Bucket: bucket,
      Prefix: prefix,
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
