import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, RotateCcw, Settings } from 'lucide-react';
import { FieldBuilder } from './FieldBuilder';
import { JsonPreview } from './JsonPreview';
import { SchemaFormData, FieldDefinition } from '@/types/schema';
import { generateDefaultValue } from '@/lib/schema-utils';
import { useToast } from '@/hooks/use-toast';

export const SchemaBuilder: React.FC = () => {
  const { toast } = useToast();
  
  const methods = useForm<SchemaFormData>({
    defaultValues: {
      fields: [
        {
          id: 'initial_field',
          name: 'example_field',
          type: 'string',
          defaultValue: generateDefaultValue('string'),
        },
      ],
    },
  });

  const { control, watch, reset, setValue } = methods;
  const fields = watch('fields');

  const resetForm = () => {
    reset({
      fields: [
        {
          id: `field_${Date.now()}`,
          name: 'example_field',
          type: 'string',
          defaultValue: generateDefaultValue('string'),
        },
      ],
    });
    toast({
      title: "Form Reset",
      description: "Schema builder has been reset to default state",
    });
  };

  const exportSchema = () => {
    const data = {
      timestamp: new Date().toISOString(),
      fields: fields,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema-builder-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Schema Exported",
      description: "Your schema configuration has been downloaded",
    });
  };

  const importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.fields && Array.isArray(data.fields)) {
          setValue('fields', data.fields);
          toast({
            title: "Schema Imported",
            description: "Your schema configuration has been loaded successfully",
          });
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Please select a valid schema file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            JSON Schema Builder
          </h1>
          <p className="text-muted-foreground text-lg">
            Create dynamic JSON schemas with support for nested structures and real-time preview
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Schema Configuration
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetForm}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportSchema}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSchema}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Import
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <FormProvider {...methods}>
                  <FieldBuilder control={control} fieldPath="fields" />
                </FormProvider>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <JsonPreview fields={fields} />
          </div>
        </div>
      </div>
    </div>
  );
};