import { FieldDefinition, GeneratedSchema } from '@/types/schema';

export const generateDefaultValue = (type: string): string | number => {
  switch (type) {
    case 'string':
      return 'sample text';
    case 'number':
      return 42;
    default:
      return '';
  }
};

export const generateJsonSchema = (fields: FieldDefinition[]): GeneratedSchema => {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  fields.forEach((field) => {
    if (!field.name.trim()) return;

    required.push(field.name);

    switch (field.type) {
      case 'string':
        properties[field.name] = {
          type: 'string',
          default: field.defaultValue || generateDefaultValue('string'),
        };
        break;
      case 'number':
        properties[field.name] = {
          type: 'number',
          default: field.defaultValue || generateDefaultValue('number'),
        };
        break;
      case 'nested':
        if (field.nested && field.nested.length > 0) {
          const nestedSchema = generateJsonSchema(field.nested);
          properties[field.name] = nestedSchema;
        } else {
          properties[field.name] = {
            type: 'object',
            properties: {},
            required: [],
          };
        }
        break;
    }
  });

  return {
    type: 'object',
    properties,
    required,
  };
};

export const generateJsonExample = (fields: FieldDefinition[]): Record<string, any> => {
  const example: Record<string, any> = {};

  fields.forEach((field) => {
    if (!field.name.trim()) return;

    switch (field.type) {
      case 'string':
        example[field.name] = field.defaultValue || generateDefaultValue('string');
        break;
      case 'number':
        example[field.name] = field.defaultValue || generateDefaultValue('number');
        break;
      case 'nested':
        if (field.nested && field.nested.length > 0) {
          example[field.name] = generateJsonExample(field.nested);
        } else {
          example[field.name] = {};
        }
        break;
    }
  });

  return example;
};