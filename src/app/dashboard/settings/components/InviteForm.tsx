'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useClipboard } from '@/hooks/useClipboard';
import { organizationService } from '@/services/organizationService';
import { useUserStore } from '@/store/userStore';
import { Role } from '@/types/models/enums';

const schema = z.object({
  email: z.string().email(),
  role: z.enum([Role.EMPLOYEE, Role.CLIENT]),
});

type FormData = z.infer<typeof schema>;

export function InviteForm() {
  const { copy, copied } = useClipboard();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const {
    user: { organizationId },
  } = useUserStore();
  console.log(organizationId);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    if (!organizationId) return;
    try {
      const result = await organizationService.inviteUser(
        organizationId,
        data.email,
        data.role,
      );
      setInviteLink(result.inviteLink);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full min-w-96">
      <CardHeader>
        <CardTitle>Пригласить пользователя</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Роль</Label>
            <Select
              onValueChange={(value) =>
                setValue('role', value as FormData['role'])
              }>
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.EMPLOYEE}>
                  {Role.EMPLOYEE.toLowerCase()}
                </SelectItem>
                <SelectItem value={Role.CLIENT}>
                  {Role.CLIENT.toLowerCase()}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Отправить инвайт
          </Button>
        </form>

        {inviteLink && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Label>Ссылка для регистрации</Label>
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copy(inviteLink)}>
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-600 transition-all" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
