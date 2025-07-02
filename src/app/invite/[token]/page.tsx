'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { organizationService } from '@/services/organizationService';

const schema = z.object({
  name: z.string().min(2),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function RegisterByInvitePage() {
  const router = useRouter();
  const { token } = router.query;
  const [inviteInfo, setInviteInfo] = useState<null | {
    email: string;
    role: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (token && typeof token === 'string') {
      organizationService
        .getInviteInfo(token)
        .then(setInviteInfo)
        .catch(() => setError('Инвайт недействителен или просрочен'));
    }
  }, [token]);

  const onSubmit = async (form: FormData) => {
    if (!token || typeof token !== 'string') return;
    try {
      await organizationService.registerByInvite({ ...form, token });
      router.push('/dashboard');
    } catch {
      setError('Не удалось зарегистрироваться');
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!inviteInfo) return <p>Загрузка инвайта...</p>;

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border p-6 shadow-xl">
      <h1 className="mb-4 text-xl font-bold">Регистрация по приглашению</h1>
      <p>
        Email: <b>{inviteInfo.email}</b>
      </p>
      <p>
        Роль: <b>{inviteInfo.role}</b>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <input
          {...register('name')}
          placeholder="Ваше имя"
          className="w-full rounded border p-2"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          type="password"
          {...register('password')}
          placeholder="Пароль"
          className="w-full rounded border p-2"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
