'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { getOrigin } from '@/lib/getOrigin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

const parameterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['TEXT', 'AREA', 'FILE'] as const),
  value: z.string(),
  order: z.number(),
});

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  parameters: z.array(parameterSchema),
});

type RecipeFormData = z.infer<typeof formSchema>;

interface RecipeFormProps {
  onQRCodeGenerated: (data: string) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  onQRCodeGenerated,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: 'tile',
      parameters: [
        { name: 'Title', type: 'TEXT', value: 'some data', order: 0 },
      ],
    },
  });

  const parameterTypes = form.watch('parameters');

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parameters',
  });

  const onSubmit = async (data: RecipeFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      data.parameters.forEach((param, index) => {
        formData.append(`parameters.${index}.name`, param.name);
        formData.append(`parameters.${index}.type`, param.type);
        if (param.type === 'FILE') {
          const fileInput = document.querySelector(
            `input[name="parameters.${index}.file"]`,
          ) as HTMLInputElement;
          if (fileInput?.files?.[0]) {
            formData.append(`parameters.${index}.file`, fileInput.files[0]);
            formData.append(
              `parameters.${index}.value`,
              fileInput.files[0].name,
            );
          }
        } else formData.append(`parameters.${index}.value`, param.value);
        formData.append(`parameters.${index}.order`, param.order.toString());
      });
      const response = await fetch('/api/recipes', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create recipe');
      }
      const result = await response.json();
      if (result.id) onQRCodeGenerated(`${getOrigin()}/recipes/${result.id}`);
      else throw new Error('No URL in response');
    } catch (error) {
      alert(
        'Error submitting form: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange =
    (index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      form.setValue(`parameters.${index}.value`, file ? file.name : '');
    };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-4xl flex-col gap-4 rounded-lg p-4 shadow-md lg:w-1/2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title</FormLabel>
              <FormControl>
                <Input placeholder="Recipe Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            type="button"
            variant="primary"
            className="w-full"
            onClick={() =>
              append({
                name: `Parameter ${fields.length + 1}`,
                type: 'TEXT',
                value: '',
                order: fields.length,
              })
            }>
            Add Parameter
          </Button>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col items-center gap-2 md:flex-row">
              <FormField
                control={form.control}
                name={`parameters.${index}.name`}
                render={({ field: nameField }) => (
                  <FormItem className="w-full md:w-auto">
                    <FormControl>
                      <Input {...nameField} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`parameters.${index}.value`}
                render={({ field: valueField }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      {parameterTypes[index]?.type === 'AREA' ? (
                        <Textarea
                          {...valueField}
                          className="min-h-[100px]"
                          placeholder="Enter text..."
                        />
                      ) : parameterTypes[index]?.type === 'FILE' ? (
                        <div className="flex items-center gap-2">
                          <Input
                            name={`parameters.${index}.file`}
                            type="file"
                            onChange={handleFileChange(index)}
                          />
                          <Input type="hidden" {...valueField} />
                        </div>
                      ) : (
                        <Input {...valueField} placeholder="Enter text..." />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Input
                type="hidden"
                {...form.register(`parameters.${index}.order`)}
                value={index}
              />
              <div className="flex items-center gap-1">
                <FormField
                  control={form.control}
                  name={`parameters.${index}.type`}
                  render={({ field: typeField }) => (
                    <FormItem className="w-full md:w-auto">
                      <Select
                        onValueChange={(value) => {
                          typeField.onChange(value);
                          form.setValue(`parameters.${index}.value`, '');
                        }}
                        value={typeField.value}>
                        <FormControl>
                          <SelectTrigger className="w-full md:w-[110px]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TEXT">Text</SelectItem>
                          <SelectItem value="AREA">Text Area</SelectItem>
                          <SelectItem value="FILE">File</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full"
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}>
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button type="submit" variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <p>
                Creating<span className="animate-ping">...</span>
              </p>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-400" />
            </>
          ) : (
            'Create QR-CODE'
          )}
        </Button>
      </form>
    </Form>
  );
};
