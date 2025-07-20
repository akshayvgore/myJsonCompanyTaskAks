import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, FileCode, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FieldDefinition } from '@/types/schema';
import { generateJsonSchema, generateJsonExample } from '@/lib/schema-utils';

interface JsonPreviewProps {
  fields: FieldDefinition[];
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ fields }) => {
  const { toast } = useToast();

  const schema = generateJsonSchema(fields);
  const example = generateJsonExample(fields);

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    });
  };

  const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

  return (
    <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            JSON Preview
          </CardTitle>
          <Badge variant="secondary">
            {fields.length} field{fields.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="schema" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schema" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                JSON Schema
              </TabsTrigger>
              <TabsTrigger value="example" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Example Data
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="schema" className="mt-0">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(formatJson(schema), 'JSON Schema')}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 text-sm overflow-auto max-h-96 font-mono border border-white/10 rounded-lg">
                <code>{formatJson(schema)}</code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="example" className="mt-0">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(formatJson(example), 'Example Data')}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 text-sm overflow-auto max-h-96 font-mono border border-white/10 rounded-lg">
                <code>{formatJson(example)}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};