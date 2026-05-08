import joi from "joi";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import { generalFields } from "../../Middleware/validation.middleware.js";

export const profileImageValidation = {
  file: joi
    .object({
      fieldname: generalFields.file.fieldname.valid("attachments").required(),
      originalname: generalFields.file.originalname.required(),
      mimetype: generalFields.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalFields.file.size.max(5 * 1024 * 1024).required(), // max 5MB
      path: generalFields.file.path.required(),
      destination: generalFields.file.destination.required(),
      filename: generalFields.file.filename.required(),
      encoding: generalFields.file.encoding.required(),
      finalPath: generalFields.file.finalPath.required(),
    })
    .required(),
};

export const coverImagesValidation = {
  files: joi
    .array()
    .items(
      joi.object({
        fieldname: generalFields.file.fieldname.valid("attachments").required(),
        originalname: generalFields.file.originalname.required(),
        mimetype: generalFields.file.mimetype
          .valid(...fileValidation.images)
          .required(),
        size: generalFields.file.size.max(5 * 1024 * 1024).required(), // max 5MB
        path: generalFields.file.path.required(),
        destination: generalFields.file.destination.required(),
        filename: generalFields.file.filename.required(),
        encoding: generalFields.file.encoding.required(),
        finalPath: generalFields.file.finalPath.required(),
      })
    )
    .required(),
};
