'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { GalleryVerticalEnd } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { LoginForm } from '@/app/auth/components/login-form';
import { RegisterOrganizationForm } from '@/app/auth/components/register-with-org-form';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const [direction, setDirection] = useState<1 | -1>(1);
  const prevMode = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevMode.current;
    if (prev === 'login' && mode === 'sign-up') setDirection(1);
    else if (prev === 'sign-up' && mode === 'login') setDirection(-1);
    prevMode.current = mode;
  }, [mode]);

  const isLogin = mode === 'login';
  const isRegister = mode === 'sign-up';
  const currentKey = isLogin ? 'login' : isRegister ? 'register' : 'unknown';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-muted p-6 md:p-10">
      <div className="z-10 flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Test P.M {'->'} Inc.
      </div>
      <div className="relative flex min-h-[34rem] w-full max-w-sm flex-col gap-6 overflow-hidden rounded-xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentKey}
            initial={{ x: direction * 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -200, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0">
            {isLogin && <LoginForm />}
            {isRegister && <RegisterOrganizationForm />}
            {!isLogin && !isRegister && (
              <div className="text-center text-muted-foreground">
                Please specify ?mode=login or ?mode=sign-up in URL
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
