import React from 'react';
import { Control, useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { SchemaFormData, FieldDefinition } from '@/types/schema';
import { generateDefaultValue } from '@/lib/schema-utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface FieldBuilderProps {
  control: Control<SchemaFormData>;
  fieldPath: string;
  level?: number;
}

export const FieldBuilder: React.FC<FieldBuilderProps> = ({ 
  control, 
  fieldPath, 
  level = 0 
}) => {
  const { register, watch, setValue } = useFormContext<SchemaFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldPath as any,
  });
  
  const [openFields, setOpenFields] = useState<Record<string, boolean>>({});

  const toggleField = (fieldId: string) => {
    setOpenFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const addField = () => {
    const newField: FieldDefinition = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      type: 'string',
      defaultValue: generateDefaultValue('string'),
    };
    append(newField);
  };

  const addNestedField = (parentIndex: number) => {
    const parentPath = `${fieldPath}.${parentIndex}`;
    const currentField = watch(`${parentPath}` as any);
    
    if (!currentField.nested) {
      setValue(`${parentPath}.nested` as any, []);
    }
    
    const newNestedField: FieldDefinition = {
      id: `nested_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      type: 'string',
      defaultValue: generateDefaultValue('string'),
    };
    
    const currentNested = currentField.nested || [];
    setValue(`${parentPath}.nested` as any, [...currentNested, newNestedField]);
  };

  const handleTypeChange = (index: number, newType: string) => {
    const fieldPath_typed = `${fieldPath}.${index}` as any;
    setValue(`${fieldPath_typed}.type`, newType as any);
    setValue(`${fieldPath_typed}.defaultValue`, generateDefaultValue(newType) as any);
    
    if (newType === 'nested') {
      setValue(`${fieldPath_typed}.nested`, [] as any);
    } else {
      setValue(`${fieldPath_typed}.nested`, undefined as any);
    }
  };

  return (
    <div className={`space-y-4 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-muted' : ''}`}>
      {fields.map((field, index) => {
        const currentField = watch(`${fieldPath}.${index}` as any);
        const isNested = currentField?.type === 'nested';
        const hasNestedFields = isNested && currentField?.nested?.length > 0;
        
        return (
          <Card key={field.id} className={`transition-all duration-200 backdrop-blur-sm ${level > 0 ? 'bg-white/60 dark:bg-gray-800/60' : 'bg-white/80 dark:bg-gray-800/80'} border-white/20 shadow-lg`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Field {index + 1} {level > 0 && `(Level ${level + 1})`}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Field Name</label>
                  <Input
                    {...register(`${fieldPath}.${index}.name` as any)}
                    placeholder="Enter field name"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={currentField?.type || 'string'}
                    onValueChange={(value) => handleTypeChange(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="nested">Nested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {!isNested && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default Value</label>
                    <Input
                      {...register(`${fieldPath}.${index}.defaultValue` as any)}
                      placeholder={currentField?.type === 'number' ? 'Enter number' : 'Enter text'}
                      type={currentField?.type === 'number' ? 'number' : 'text'}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              
              {isNested && (
                <div className="mt-4">
                  <Collapsible
                    open={openFields[field.id] || false}
                    onOpenChange={() => toggleField(field.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          {openFields[field.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          Nested Fields ({currentField?.nested?.length || 0})
                        </Button>
                      </CollapsibleTrigger>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addNestedField(index)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Nested Field
                      </Button>
                    </div>
                    
                    <CollapsibleContent className="space-y-0">
                      {hasNestedFields && (
                        <FieldBuilder
                          control={control}
                          fieldPath={`${fieldPath}.${index}.nested`}
                          level={level + 1}
                        />
                      )}
                      
                      {!hasNestedFields && openFields[field.id] && (
                        <div className="text-sm text-muted-foreground italic p-4 border-2 border-dashed border-muted rounded-lg text-center">
                          No nested fields yet. Click "Add Nested Field" to get started.
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      <Button
        type="button"
        variant="outline"
        onClick={addField}
        className="w-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Field
      </Button>
    </div>
  );
};