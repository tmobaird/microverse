import { S3 } from "@aws-sdk/client-s3";

const aggregatedS3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: "us-east-1",
});

const objectUrl = `https://${
  process.env.AWS_BUCKET_NAME || ""
}.s3.amazonaws.com`;

export const saveObject = async (contents: string, name: string) => {
  const binaryData = Buffer.from(contents, "base64");
  await aggregatedS3.putObject({
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: name,
    Body: binaryData,
    ContentType: "image/png",
  });

  return `${objectUrl}/${name}`;
};
