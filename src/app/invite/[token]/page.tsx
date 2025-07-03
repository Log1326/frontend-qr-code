import { FormInvite } from '@/app/invite/[token]/components/FormInvite';

export default function RegisterByInvitePage({
  params: { token },
}: {
  params: { token: string };
}) {
  return (
    <div>
      <FormInvite token={token} />
    </div>
  );
}
