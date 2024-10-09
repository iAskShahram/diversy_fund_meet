import { env } from "@/env";
import { getAvatarPresignedUrlSchema } from "@/lib/validators/s3.validator";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const awsConfig = {
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  bucketName: env.AWS_BUCKET_NAME,
};

const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});

export const awsRouter = createTRPCRouter({
  getAvatarPresignedUrl: protectedProcedure
    .input(getAvatarPresignedUrlSchema)
    .mutation(async ({ ctx, input }) => {
      // generate a presigned url to send back to frontend to upload image avatar
      const { fileName, fileType, fileSize } = input;
      const extention = fileName.substring(fileName.lastIndexOf(".") + 1);
      const key = `avatars/${ctx.session.user.id}.${extention}`;
      const command = new PutObjectCommand({
        Bucket: awsConfig.bucketName,
        Key: key,
        ContentType: fileType,
        ContentLength: fileSize * 1024 * 1024,
      });

      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      return { presignedUrl: url, key };
    }),
});
