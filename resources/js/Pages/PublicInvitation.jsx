import {useEffect, useState} from 'react';
import {Head} from '@inertiajs/react';
import {LumiereInvitationPage} from '@/Components/invitation/LumiereInvitationPage';
import {BloomInvitationPage} from '@/Components/invitation/BloomInvitationPage';
import {SageInvitationPage} from '@/Components/invitation/SageInvitationPage';
import {OnyxInvitationPage} from '@/Components/invitation/OnyxInvitationPage';

function renderInvitation(invitation) {
  switch (invitation.template ?? 'lumiere') {
    case 'bloom': return <BloomInvitationPage invitation={invitation} />;
    case 'sage': return <SageInvitationPage invitation={invitation} />;
    case 'onyx': return <OnyxInvitationPage invitation={invitation} />;
    default: return <LumiereInvitationPage invitation={invitation} />;
  }
}

export default function PublicInvitation({slug}) {
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/i/${slug}/data`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setInvitation(data.content ? {...data.content, slug: data.slug} : null);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8b181] border-t-transparent" />
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <Head title="Invitation not found" />
        <div className="max-w-xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Invitation not found</p>
          <h1 className="font-display text-5xl italic">This invitation link is not valid.</h1>
          <p className="text-base leading-relaxed text-white/65">
            Please check the invitation URL or return to the correct wedding page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head title={invitation?.seo?.title ?? invitation?.couple?.joinedName ?? 'Invitation'} />
      {renderInvitation(invitation)}
    </>
  );
}
