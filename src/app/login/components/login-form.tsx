'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useUserStore } from '@/store/userStore';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

const loginSchema = z.object({
  email: z.string().email('wrong'),
  password: z.string().min(6, 'is min 6 symbols'),
});

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUserStore();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login(values.email, values.password);
      setUser(data.user);
      router.replace('/dashboard');
    } catch {
      setError('Login wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Link
                href={SITE_URL + '/auth/github'}
                className="flex w-full items-center justify-center gap-2 rounded-md shadow-md transition duration-300 ease-in-out hover:scale-105 hover:opacity-70 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                <span className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="28"
                    height="28"
                    aria-hidden="true">
                    <path
                      fill="#181717"
                      fillRule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38
                      0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                      -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
                      -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.1 0 0 .67-.22 2.2.82a7.53
                      7.53 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56
                      .82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2
                      0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                  Login with GitHub
                </span>
              </Link>

              <Link
                href={SITE_URL + '/auth/google'}
                className="flex w-full items-center justify-center gap-2 rounded-md shadow-md transition duration-300 ease-in-out hover:scale-105 hover:opacity-70 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="28"
                    height="28">
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.9 0 6.4 1.7 7.9 3.1l5.8-5.8C33.7 3.6 29.3 2 24 2 14.6 2 6.5 8.9 4 17.7l6.9 5.4C12 15 17.5 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.5 24c0-1.6-.1-2.7-.3-3.9H24v7.4h12.7c-.5 3-2.7 6-6.7 7.3v6h10.8c6.3-5.8 9.7-14.3 9.7-16.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.9 28.7c-.4-1.3-.6-2.7-.6-4.2s.2-2.9.6-4.2v-6H.1c-.7 1.4-1.1 2.9-1.1 4.8 0 1.8.4 3.4 1.1 4.8l10.8 6z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 44c5.4 0 9.9-1.8 13.2-4.9l-6.3-5c-1.9 1.2-4.3 1.9-6.9 1.9-5.5 0-10.1-3.7-11.8-8.7H.3l-6.1 4.8C6.5 38.9 14.6 44 24 44z"
                    />
                  </svg>
                  Login with Google
                </span>
              </Link>
            </div>
            <div className="relative select-none text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -top-[0.31rem] left-[2.5rem]" />
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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage className="absolute -top-[0.31rem] left-[4.1rem]" />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="text-sm font-medium text-red-500">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </form>
            </Form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="*:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
