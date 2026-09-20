export const ACCESS_SCOPE_ACTIONS = [ "create", "update", "read", "delete" ] as const;
export const ARRAY_MODES = [ "merge", "remove", "replace" ] as const;
export const SCHEMA_OPTIONS = { timestamps:{ createdAt:'created_at', updatedAt:'updated_at' }};