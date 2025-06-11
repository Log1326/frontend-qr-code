'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldType, RecipeStatus } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ParameterField } from '@/components/form/parameter-field';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getOrigin } from '@/lib/getOrigin';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useState } from 'react';

const fieldTypes = Object.values(FieldType) as [FieldType, ...FieldType[]];
const recipeStatuses = Object.values(RecipeStatus) as [
  RecipeStatus,
  ...RecipeStatus[],
];

const parameterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(fieldTypes),
  description: z.string(),
  order: z.number(),
});

const formSchema = z.object({
  employee: z.string().min(1, 'Employee name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  price: z.number(),
  status: z.enum(recipeStatuses),
  parameters: z.array(parameterSchema),
});

type RecipeFormData = z.infer<typeof formSchema>;

const DEFAULT_VALUES: RecipeFormData = {
  employee: 'Антон Панов',
  clientName: 'Петушок',
  price: 1500,
  status: RecipeStatus.NEW,
  parameters: [],
};

interface RecipeFormProps {
  onQRCodeGenerated: (data: string) => void;
  setRecipeId: React.Dispatch<React.SetStateAction<string>>;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  onQRCodeGenerated,
  setRecipeId,
}) => {
  const t = useTypedTranslations();
  const isMobile = useIsMobile();
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parameters',
  });

  const onSubmit: SubmitHandler<RecipeFormData> = async (
    data: RecipeFormData,
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('employee', data.employee);
      formData.append('clientName', data.clientName);
      formData.append('status', data.status);
      if (data.price) {
        formData.append('price', data.price.toString());
      }

      data.parameters.forEach((param, index) => {
        formData.append(`parameters.${index}.name`, param.name);
        formData.append(`parameters.${index}.type`, param.type);

        if (param.type === FieldType.FILE) {
          const fileInput = document.querySelector(
            `input[name="parameters.${index}.file"]`,
          ) as HTMLInputElement;
          if (fileInput?.files?.[0]) {
            formData.append(`parameters.${index}.file`, fileInput.files[0]);
            formData.append(
              `parameters.${index}.description`,
              fileInput.files[0].name,
            );
          }
        } else
          formData.append(`parameters.${index}.description`, param.description);

        formData.append(`parameters.${index}.order`, param.order.toString());
      });

      const res = await fetch('/api/recipes', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || 'Failed to create recipe');
      }

      const result = await res.json();
      if (result.id) {
        setRecipeId(result.id);
        onQRCodeGenerated(`${getOrigin()}/recipes/${result.id}`);
      } else throw new Error('No ID in response');
    } catch (error) {
      console.log(
        'Error submitting form: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };

  const handleFileChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      form.setValue(`parameters.${index}.description`, file?.name || '');
    };

  const formatter = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-4xl flex-col gap-4 rounded-lg p-4 shadow-md ring-1 ring-gray-300 lg:w-1/2">
          <FormField
            control={form.control}
            name="employee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employee')}</FormLabel>
                <FormControl>
                  <Input placeholder="Employee name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('clientName')}</FormLabel>
                <FormControl>
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => {
              const [localValue, setLocalValue] = useState(
                field.value ? formatter.format(Number(field.value)) : '',
              );

              return (
                <FormItem>
                  <FormLabel>{t('price')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder={t('price')}
                      value={localValue}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, '');
                        setLocalValue(e.target.value);

                        if (raw === '') {
                          field.onChange('');
                        } else {
                          field.onChange(Number(raw));
                        }
                      }}
                      onBlur={() => {
                        if (field.value !== 0 && field.value != null) {
                          setLocalValue(formatter.format(Number(field.value)));
                        } else {
                          setLocalValue('');
                        }
                      }}
                      onFocus={() => {
                        if (field.value !== 0 && field.value != null) {
                          setLocalValue(String(field.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipeStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {fields.map((field, index) => (
              <ParameterField
                key={field.id}
                index={index}
                isMobile={isMobile}
                onRemove={() => remove(index)}
                onFileChange={handleFileChange}
              />
            ))}
          </div>

          {!isMobile && (
            <Button
              type="button"
              className="w-full"
              onClick={() =>
                append({
                  name: `Parameter ${fields.length + 1}`,
                  type: FieldType.TEXT,
                  description: '',
                  order: fields.length,
                })
              }>
              {t('addParameter')}
            </Button>
          )}

          <Button
            type="submit"
            variant="outline"
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <p>
                  Creating<span className="animate-ping">...</span>
                </p>
                <Loader2 className="ml-2 h-4 w-4 animate-spin text-blue-400" />
              </>
            ) : (
              t('createQRCode')
            )}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
};
