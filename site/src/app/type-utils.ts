export type BooleansToStringRecord<T> = { [K in keyof T]: T[K] extends boolean ? string : T[K] }
