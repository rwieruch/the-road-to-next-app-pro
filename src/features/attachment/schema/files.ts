import { z } from "zod";
import { ACCEPTED, MAX_SIZE } from "../constants";
import { sizeInMB } from "../utils/size";

export const filesSchema = z
  .custom<FileList>()
  .transform((files) => Array.from(files))
  .transform((files) => files.filter((file) => file.size > 0))
  .refine(
    (files) => files.every((file) => sizeInMB(file.size) <= MAX_SIZE),
    `The maximum file size is ${MAX_SIZE}MB`
  )
  .refine(
    (files) => files.every((file) => ACCEPTED.includes(file.type)),
    "File type is not supported"
  );
