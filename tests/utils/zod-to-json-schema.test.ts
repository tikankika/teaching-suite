/**
 * Tests for zod-to-json-schema utility — Zod to JSON Schema converter.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { zodToJsonSchema } from '../../src/utils/zod-to-json-schema.js';

describe('zodToJsonSchema', () => {
  describe('primitive types', () => {
    it('should convert ZodString to { type: "string" }', () => {
      const schema = z.string();
      expect(zodToJsonSchema(schema)).toEqual({ type: 'string' });
    });

    it('should convert ZodNumber to { type: "number" }', () => {
      const schema = z.number();
      expect(zodToJsonSchema(schema)).toEqual({ type: 'number' });
    });

    it('should convert ZodBoolean to { type: "boolean" }', () => {
      const schema = z.boolean();
      expect(zodToJsonSchema(schema)).toEqual({ type: 'boolean' });
    });
  });

  describe('ZodObject', () => {
    it('should convert a simple object schema', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const result = zodToJsonSchema(schema);
      expect(result).toEqual({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name', 'age'],
      });
    });

    it('should omit required array when all fields are optional', () => {
      const schema = z.object({
        name: z.string().optional(),
        age: z.number().optional(),
      });

      const result = zodToJsonSchema(schema);
      expect(result).toEqual({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      });
      expect(result).not.toHaveProperty('required');
    });

    it('should handle mixed required and optional fields', () => {
      const schema = z.object({
        title: z.string(),
        description: z.string().optional(),
      });

      const result = zodToJsonSchema(schema);
      expect(result).toEqual({
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['title'],
      });
    });
  });

  describe('ZodArray', () => {
    it('should convert an array of strings', () => {
      const schema = z.array(z.string());
      expect(zodToJsonSchema(schema)).toEqual({
        type: 'array',
        items: { type: 'string' },
      });
    });

    it('should convert an array of objects', () => {
      const schema = z.array(
        z.object({ id: z.number() }),
      );

      const result = zodToJsonSchema(schema);
      expect(result).toEqual({
        type: 'array',
        items: {
          type: 'object',
          properties: { id: { type: 'number' } },
          required: ['id'],
        },
      });
    });
  });

  describe('ZodEnum', () => {
    it('should convert an enum to string with enum values', () => {
      const schema = z.enum(['nu', 'snart', 'någon_gång']);
      expect(zodToJsonSchema(schema)).toEqual({
        type: 'string',
        enum: ['nu', 'snart', 'någon_gång'],
      });
    });
  });

  describe('ZodOptional', () => {
    it('should unwrap optional and exclude from required', () => {
      const schema = z.object({
        required_field: z.string(),
        optional_field: z.string().optional(),
      });

      const result = zodToJsonSchema(schema);
      expect(result.required).toEqual(['required_field']);
      expect((result.properties as Record<string, unknown>).optional_field).toEqual({
        type: 'string',
      });
    });
  });

  describe('ZodDefault', () => {
    it('should include default value in output', () => {
      const schema = z.string().default('hello');
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'string', default: 'hello' });
    });

    it('should mark field with default as not required', () => {
      const schema = z.object({
        name: z.string(),
        priority: z.string().default('low'),
      });

      const result = zodToJsonSchema(schema);
      expect(result.required).toEqual(['name']);
    });

    it('should handle number default', () => {
      const schema = z.number().default(42);
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'number', default: 42 });
    });

    it('should handle boolean default', () => {
      const schema = z.boolean().default(false);
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'boolean', default: false });
    });
  });

  describe('description', () => {
    it('should preserve description on string', () => {
      const schema = z.string().describe('A name field');
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'string', description: 'A name field' });
    });

    it('should preserve description on number', () => {
      const schema = z.number().describe('Age in years');
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'number', description: 'Age in years' });
    });

    it('should preserve description on boolean', () => {
      const schema = z.boolean().describe('Whether to confirm');
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'boolean', description: 'Whether to confirm' });
    });
  });

  describe('nested objects', () => {
    it('should handle nested object schemas', () => {
      const schema = z.object({
        metadata: z.object({
          version: z.number(),
          tags: z.array(z.string()),
        }),
      });

      const result = zodToJsonSchema(schema);
      expect(result).toEqual({
        type: 'object',
        properties: {
          metadata: {
            type: 'object',
            properties: {
              version: { type: 'number' },
              tags: { type: 'array', items: { type: 'string' } },
            },
            required: ['version', 'tags'],
          },
        },
        required: ['metadata'],
      });
    });
  });

  describe('unknown type fallback', () => {
    it('should return { type: "object" } for unsupported Zod types', () => {
      // z.any() produces ZodAny which is not in the converter map
      const schema = z.any();
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'object' });
    });

    it('should return { type: "object" } for z.unknown()', () => {
      const schema = z.unknown();
      const result = zodToJsonSchema(schema);
      expect(result).toEqual({ type: 'object' });
    });
  });
});
