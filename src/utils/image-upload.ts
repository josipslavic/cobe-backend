import { s3 } from '../constants/s3';

export async function uploadPublicFile(dataBuffer: Buffer, filename: string) {
  const uploadResult = await s3
    .upload({
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME!,
      Body: dataBuffer,
      ACL: 'public-read',
      Key: `${Date.now()}-${filename}`.replace(/\//g, ''),
    })
    .promise();

  return uploadResult.Location;
}

export async function deletePublicFile(imageUrl: string) {
  const filename = imageUrl.split('/').pop()!;
  const deleteResult = await s3
    .deleteObject({
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME!,
      Key: filename,
    })
    .promise();

  return deleteResult.$response;
}
