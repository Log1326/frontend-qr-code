import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION!;
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read' as ObjectCannedACL,
  };

  await s3Client.send(new PutObjectCommand(params));

  return `https://${bucketName}.s3.${REGION}.amazonaws.com/${fileName}`;
}
