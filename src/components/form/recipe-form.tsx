'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldType, RecipeStatus } from '@prisma/client';
import { Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { Path, SubmitHandler } from 'react-hook-form';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
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
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { fetchAddressAndCoordinates } from '@/lib/fetchAddressAndCoordinates';
import { getOrigin } from '@/lib/getOrigin';
import { numberFormat } from '@/lib/utils';

const recipeStatuses = Object.values(RecipeStatus) as [
  RecipeStatus,
  ...RecipeStatus[],
];

const parameterItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(FieldType),
  description: z.string(),
  order: z.number(),
});

const formSchema = z.object({
  employee: z.string().min(1, 'Employee name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  price: z
    .number()
    .int('Price must be an integer')
    .positive('Price must be greater than 0')
    .lte(99999999, 'Price must be at most 8 digits'),
  address: z.string().min(1, 'address is required'),
  status: z.enum(recipeStatuses),
  parameters: z.array(parameterItemSchema),
});

type RecipeFormData = z.infer<typeof formSchema>;

const DEFAULT_VALUES: RecipeFormData = {
  employee: '',
  clientName: '',
  price: 0,
  address: 'Netanya, Ha rav kuk ,61',
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
  const [localPrice, setLocalPrice] = useState(
    DEFAULT_VALUES.price ? numberFormat(DEFAULT_VALUES.price) : '',
  );
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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

  const { data: employees, isLoading: isLoadingEmployeeName } =
    useSWR<{ id: string; name: string }[]>('/api/employees');

  const onSubmit: SubmitHandler<RecipeFormData> = async (
    data: RecipeFormData,
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('employee', data.employee);
      formData.append('clientName', data.clientName);
      formData.append('status', data.status);
      formData.append('address', data.address);
      if (coordinates) {
        formData.append('latitude', coordinates.lat.toString());
        formData.append('longitude', coordinates.lng.toString());
      }
      if (data.price) formData.append('price', data.price.toString());
      for (let index = 0; index < data.parameters.length; index++) {
        const param = data.parameters[index];
        formData.append(`parameters[${index}][name]`, param.name);
        formData.append(`parameters[${index}][type]`, param.type);
        formData.append(`parameters[${index}][order]`, param.order.toString());

        if (param.type === FieldType.FILE) {
          const fileInput = document.querySelector(
            `input[name="parameters.${index}.file"]`,
          ) as HTMLInputElement;

          if (fileInput?.files?.[0]) {
            formData.append(`parameters[${index}][file]`, fileInput.files[0]);
            formData.append(
              `parameters[${index}][description]`,
              fileInput.files[0].name,
            );
          } else
            formData.append(
              `parameters[${index}][description]`,
              param.description,
            );
        } else
          formData.append(
            `parameters[${index}][description]`,
            param.description,
          );
      }

      const res = await fetch('/api/recipes', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      if (result.id) {
        setRecipeId(result.id);
        onQRCodeGenerated(`${getOrigin()}/recipes/${result.id}`);
      } else {
        throw new Error('No ID in response');
      }
    } catch (error) {
      console.error(
        'Submit error:',
        error instanceof Error ? error.message : error,
      );
    }
  };

  const handleFileChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      form.setValue(
        `parameters[${index}][description]` as Path<RecipeFormData>,
        file?.name || '',
      );
    };
  const validateAddress = async (val: string) => {
    if (!val.trim()) {
      form.setError('address', {
        type: 'manual',
        message: 'Адрес обязателен',
      });
      setCoordinates(null);
      return false;
    }

    const res = await fetchAddressAndCoordinates(val);
    if (res) {
      form.setValue('address', res.displayName, {
        shouldValidate: true,
      });
      setCoordinates({ lat: res.lat, lng: res.lon });
      form.clearErrors('address');
      return true;
    } else {
      form.setError('address', {
        type: 'manual',
        message:
          'Адрес не найден или неверный формат. Пример: "Тель-Авив, Дизенгоф 100"',
      });
      setCoordinates(null);
      return false;
    }
  };

  const handleAddressBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    await validateAddress(val);
  };

  const handleIconClick = async () => {
    await validateAddress(form.getValues('address'));
  };
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-4xl flex-col gap-4 rounded-lg p-4 lg:w-1/2">
          <FormField
            control={form.control}
            name="employee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employee')}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingEmployeeName}>
                    <SelectTrigger isLoading={isLoadingEmployeeName}>
                      <SelectValue placeholder={t('employee')} />
                    </SelectTrigger>

                    <SelectContent>
                      {employees?.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Input placeholder={t('clientName')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t('address')}
                      {...field}
                      onBlur={handleAddressBlur}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={handleIconClick}>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('price')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder={t('price')}
                    value={localPrice}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '');
                      setLocalPrice(e.target.value);

                      if (raw === '') field.onChange('');
                      else field.onChange(Number(raw));
                    }}
                    onBlur={() => {
                      if (field.value !== 0 && field.value != null)
                        setLocalPrice(numberFormat(field.value));
                      else setLocalPrice('');
                    }}
                    onFocus={() => {
                      if (field.value !== 0 && field.value != null)
                        setLocalPrice(String(field.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

          <Button
            type="button"
            className="w-full"
            onClick={() =>
              append({
                name: ` ${fields.length + 1}`,
                type: FieldType.TEXT,
                description: '',
                order: fields.length,
              })
            }>
            {t('addParameter')}
          </Button>

          <Button
            type="submit"
            variant="outline"
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <p>
                  {t('creating')}
                  <span className="animate-ping">...</span>
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
