'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { organizationService } from '@/services/organizationService';

const schema = z.object({
  name: z.string().min(2),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

interface FormInviteProps {
  token: string;
}

export const FormInvite: React.FC<FormInviteProps> = ({ token }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: inviteInfo } = useQuery({
    queryKey: ['invite', token],
    queryFn: () => organizationService.getInviteInfo(token),
    enabled: !!token,
    retry: false,
  });
  const onSubmit = async (form: FormData) => {
    if (!token || typeof token !== 'string') return;
    try {
      await organizationService.registerByInvite({ ...form, token });
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

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
};
