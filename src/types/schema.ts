export interface FieldDefinition {
  id: string;
  name: string;
  type: 'string' | 'number' | 'nested';
  defaultValue?: string | number;
  nested?: FieldDefinition[];
}

export interface SchemaFormData {
  fields: FieldDefinition[];
}

export interface GeneratedSchema {
  type: 'object';
  properties: Record<string, any>;
  required: string[];
}