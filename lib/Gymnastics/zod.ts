import type { zod } from '@chzky/fp'

/** Faster zod.infer<> */
export type ZodInfer<T extends zod.ZodSchema> = zod.infer<T>
/** Faster keyof zod.infer<> */
export type KOZodInfer<T extends zod.ZodSchema> = keyof zod.infer<T>
