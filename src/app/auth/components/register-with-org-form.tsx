'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';

const registerOrgSchema = z.object({
  organizationName: z.string().min(3, 'Minimum 3 characters'),
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

export const RegisterOrganizationForm = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerOrgSchema>>({
    resolver: zodResolver(registerOrgSchema),
    mode: 'onChange',
    defaultValues: {
      organizationName: '',
      email: '',
      name: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerOrgSchema>) => {
    setIsError(false);
    setIsLoading(true);
    try {
      await authService.signUpWithOrganization(values);
      router.replace('/dashboard');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an Organization</CardTitle>
          <CardDescription>
            Register your organization and superuser account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        error={!!form.formState.errors.organizationName}
                        placeholder="Acme Inc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute -top-[0.31rem] right-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        error={!!form.formState.errors.name}
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute -top-[0.31rem] right-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        error={!!form.formState.errors.email}
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute -top-[0.31rem] right-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        error={!!form.formState.errors.password}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute -top-[0.31rem] right-1" />
                  </FormItem>
                )}
              />

              <Button
                variant={isError ? 'destructive' : 'default'}
                type="submit"
                className="mt-2 w-full"
                disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Register'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/auth?mode=login"
              className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
