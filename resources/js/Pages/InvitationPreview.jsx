import {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {LumiereInvitationPage} from '@/Components/invitation/LumiereInvitationPage';
import {BloomInvitationPage} from '@/Components/invitation/BloomInvitationPage';
import {SageInvitationPage} from '@/Components/invitation/SageInvitationPage';
import {OnyxInvitationPage} from '@/Components/invitation/OnyxInvitationPage';

function renderInvitation(invitation) {
  switch (invitation.template ?? 'lumiere') {
    case 'bloom': return <BloomInvitationPage invitation={invitation} isTemplatePreview />;
    case 'sage': return <SageInvitationPage invitation={invitation} isTemplatePreview />;
    case 'onyx': return <OnyxInvitationPage invitation={invitation} isTemplatePreview />;
    default: return <LumiereInvitationPage invitation={invitation} isTemplatePreview />;
  }
}

export function InvitationPreviewFramePage() {
  const [searchParams] = useSearchParams();
  const draftKey = searchParams.get('draftKey') ?? '';
  const [invitation, setInvitation] = useState(null);

  useEffect(() => {
    if (!draftKey) return;
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return;
    try {
      setInvitation(JSON.parse(raw));
    } catch {
      setInvitation(null);
    }
  }, [draftKey]);

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data;
      if (data?.type !== 'invitation-preview:update') return;
      if (data.draftKey !== draftKey) return;
      if (data.payload) setInvitation(data.payload);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [draftKey]);

  const preview = useMemo(() => {
    if (!invitation) return null;
    return renderInvitation({...invitation, slug: invitation.slug || 'preview'});
  }, [invitation]);

  if (!preview) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return <div className="min-h-screen bg-[#050505]">{preview}</div>;
}
