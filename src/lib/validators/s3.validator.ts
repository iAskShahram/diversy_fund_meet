import { z } from "zod";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const ALLOWED_IMAGE_EXTENSIONS = ["jpeg", "jpg", "png"];

export const getAvatarPresignedUrlSchema = z.object({
  fileType: z.string().refine((type) => ACCEPTED_IMAGE_TYPES.includes(type), {
    message: `Invalid file type. Only ${ACCEPTED_IMAGE_TYPES.join(
      ", ",
    )} images are allowed.`,
  }),
  fileSize: z.number().max(MAX_IMAGE_SIZE, {
    message: `File size must not exceed ${MAX_IMAGE_SIZE / (1024 * 1024)} MB`,
  }),
  fileName: z
    .string()
    .min(1, { message: "Invalid file name" })
    .refine(
      (name) => {
        const extension = name.substring(name.lastIndexOf(".") + 1);
        return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
      },
      {
        message: `File must have a valid image extension (${ALLOWED_IMAGE_EXTENSIONS.join(
          ", ",
        )}).`,
      },
    ),
});
