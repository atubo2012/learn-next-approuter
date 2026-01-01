// app/debug/session/page.tsx
import SessionTimer from '@/app/ui/session-timer';
import { auth } from '@/auth';

export default async function SessionDebugPage() {
  const session = await auth();

  if (!session) {
    return <div>未登录</div>;
  }

  const expiresAt = new Date(session.expires);
  const now = new Date();
  const remainingMs = expiresAt.getTime() - now.getTime();
  const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">会话信息</h1>
      <dl className="space-y-2">
        <div>
          <dt className="font-semibold">用户邮箱:</dt>
          <dd>{session.user?.email}</dd>
        </div>
        <div>
          <dt className="font-semibold">过期时间:</dt>
          <dd>zh-CN:{expiresAt.toLocaleString('zh-CN')}</dd>
          <dd>zh-TW:{expiresAt.toLocaleString('zh-TW')}</dd>
          <dd>en-US:{expiresAt.toLocaleString('en-US')}</dd>
          <dd>en-CA:{expiresAt.toLocaleString('en-CA')}</dd>
          <dd>fr-CA:{expiresAt.toLocaleString('fr-CA')}</dd>
          
        </div>
        <div>
          <dt className="font-semibold">剩余时间:</dt>
          <dd>{remainingDays} 天 {remainingHours} 小时</dd>
        </div>
        <div>
          <dt className="font-semibold">原始数据:</dt>
          <dd><pre>{JSON.stringify(session, null, 2)}</pre></dd>
        </div>
      </dl>
      <SessionTimer expires={session.expires} />
    </div>
  );
}