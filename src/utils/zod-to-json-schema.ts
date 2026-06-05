import type { z } from 'zod';

type JsonSchema = Record<string, unknown>;

/**
 * Converts a Zod schema to a JSON Schema compatible with MCP.
 *
 * Uses a dispatch map keyed by Zod type name instead of a long if-else chain.
 * For more complex schemas, consider a dedicated library like zod-to-json-schema.
 */

type Converter = (def: Record<string, unknown>) => JsonSchema;

/** Attach description if present on the Zod def. */
function withDescription(schema: JsonSchema, def: Record<string, unknown>): JsonSchema {
  if (def.description) {
    return { ...schema, description: def.description as string };
  }
  return schema;
}

const CONVERTERS: Record<string, Converter> = {
  ZodObject(def) {
    const shape = (def.shape as () => Record<string, z.ZodTypeAny>)();
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const zodValue = value as z.ZodTypeAny;
      properties[key] = zodToJsonSchema(zodValue);

      // Field is required unless optional or has a default
      if (!zodValue.isOptional() && !hasDefault(zodValue)) {
        required.push(key);
      }
    }

    return {
      type: 'object',
      properties,
      ...(required.length > 0 ? { required } : {}),
    };
  },

  ZodString(def) {
    return withDescription({ type: 'string' }, def);
  },

  ZodNumber(def) {
    return withDescription({ type: 'number' }, def);
  },

  ZodBoolean(def) {
    return withDescription({ type: 'boolean' }, def);
  },

  ZodArray(def) {
    return {
      type: 'array',
      items: zodToJsonSchema(def.type as z.ZodTypeAny),
    };
  },

  ZodOptional(def) {
    return zodToJsonSchema(def.innerType as z.ZodTypeAny);
  },

  ZodDefault(def) {
    const innerSchema = zodToJsonSchema(def.innerType as z.ZodTypeAny);
    const defaultValueFn = def.defaultValue as (() => unknown) | undefined;
    if (typeof defaultValueFn === 'function') {
      return { ...innerSchema, default: defaultValueFn() };
    }
    return innerSchema;
  },

  ZodEnum(def) {
    return {
      type: 'string',
      enum: def.values as string[],
    };
  },
};

export function zodToJsonSchema(schema: z.ZodTypeAny): JsonSchema {
  const def = schema._def;
  const converter = CONVERTERS[def.typeName as string];
  if (converter) {
    return converter(def);
  }
  // Fallback — return a permissive object so MCP does not reject the schema
  return { type: 'object' };
}

function hasDefault(schema: z.ZodTypeAny): boolean {
  return schema._def.typeName === 'ZodDefault';
}
