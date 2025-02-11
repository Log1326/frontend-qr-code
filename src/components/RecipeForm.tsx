'use client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

const parameterSchema = z.object({
  type: z.enum(["TEXT", "AREA", "FILE"] as const),
  value: z.string(),
  order: z.number()
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Maximum length is 100 characters"),
  parameters: z.array(parameterSchema)
});

type RecipeFormData = z.infer<typeof formSchema>;

interface RecipeFormProps {
  onGenerate: (data: string) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onGenerate }) => {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      parameters: [
        { type: "TEXT", value: "", order: 0 },
        { type: "AREA", value: "", order: 1 },
      ]
    }
  });

  const parameterTypes = form.watch("parameters");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parameters"
  });

  const onSubmit = async (data: RecipeFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);

      data.parameters.forEach((param, index) => {
        formData.append(`parameters.${index}.type`, param.type);

        if (param.type === 'FILE') {
          const fileInput = document.querySelector(`input[name="parameters.${index}.file"]`) as HTMLInputElement;
          if (fileInput?.files?.[0]) {
            formData.append(`parameters.${index}.file`, fileInput.files[0]);
            formData.append(`parameters.${index}.value`, fileInput.files[0].name);
          }
        } else formData.append(`parameters.${index}.value`, param.value);


        formData.append(`parameters.${index}.order`, param.order.toString());
      });
      const response = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create recipe');

      const result = await response.json();
      if (result.id)
        onGenerate(`${window.location.origin}/recipes/${result.id}`);
       else
        throw new Error('No URL in response');

    } catch  {
      alert("Error submitting form");
    }
  };

  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    form.setValue(`parameters.${index}.value`, file ? file.name : '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-4xl w-full lg:w-1/2 p-4 shadow-md rounded-lg">
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
            onClick={() => append({ type: "TEXT", value: "", order: fields.length })}
          >
            Add Parameter
          </Button>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-2 items-center">
              <FormField
                control={form.control}
                name={`parameters.${index}.type`}
                render={({ field: typeField }) => (
                  <FormItem className="w-full md:w-auto">
                    <Select
                      onValueChange={(value) => {
                        typeField.onChange(value);
                        form.setValue(`parameters.${index}.value`, "");
                      }}
                      value={typeField.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full md:w-[180px]">
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

              <FormField
                control={form.control}
                name={`parameters.${index}.value`}
                render={({ field: valueField }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      {parameterTypes[index]?.type === "AREA" ? (
                        <Textarea
                          {...valueField}
                          className="min-h-[100px]"
                          placeholder="Enter text..."
                        />
                      ) : parameterTypes[index]?.type === "FILE" ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            name={`parameters.${index}.file`}
                            type="file"
                            onChange={handleFileChange(index)}
                          />
                          <Input
                            type="hidden"
                            {...valueField}
                          />
                        </div>
                      ) : (
                        <Input
                          {...valueField}
                          placeholder="Enter text..."
                        />
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

              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash/>
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" variant="outline">
          Create QR-CODE
        </Button>
      </form>
    </Form>
  );
};
