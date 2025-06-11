'use client';

import { Trash } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
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
import { Textarea } from '@/components/ui/textarea';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

interface ParameterFieldProps {
  index: number;
  isMobile: boolean;
  onRemove: () => void;
  onFileChange: (
    index: number,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ParameterField: React.FC<ParameterFieldProps> = ({
  index,
  isMobile,
  onRemove,
  onFileChange,
}) => {
  const { control, register, setValue } = useFormContext();
  const type = useWatch({ control, name: `parameters[${index}][type]` });
  const t = useTypedTranslations();
  return (
    <div className="flex flex-col items-start gap-2 md:flex-row">
      <FormField
        control={control}
        name={`parameters[${index}][name]`}
        render={({ field }) => (
          <FormItem className="w-full md:w-auto">
            <FormControl>
              <Input {...field} placeholder="Name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`parameters[${index}][description]`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              {type === 'AREA' ? (
                <Textarea
                  {...field}
                  className="min-h-[100px]"
                  placeholder="Enter text..."
                />
              ) : type === 'FILE' ? (
                <div className="flex items-center gap-2">
                  <Input type="file" onChange={onFileChange(index)} />
                </div>
              ) : (
                <Input {...field} placeholder="Enter text..." />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Input
        type="hidden"
        {...register(`parameters[${index}][order]`)}
        value={index}
      />

      {!isMobile && (
        <div className="flex items-center gap-1">
          <FormField
            control={control}
            name={`parameters[${index}][type]`}
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue(`parameters[${index}][description]`, '');
                  }}
                  value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full md:w-[110px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TEXT">{t('TEXT')}</SelectItem>
                    <SelectItem value="AREA">{t('AREA')}</SelectItem>
                    <SelectItem value="FILE">{t('FILE')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="size-8"
            type="button"
            variant="destructive"
            onClick={onRemove}>
            <Trash />
          </Button>
        </div>
      )}
    </div>
  );
};
