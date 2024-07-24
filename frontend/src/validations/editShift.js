import { z } from "zod";

const editShiftSchema = z.object({
  date: z.string().isOptional(),
  hour: z.string().isOptional(),
  reason: z.string().isOptional(),
  odontologist: z.string().isOptional(),
  reminder: z.boolean(),
});

export default editShiftSchema;
