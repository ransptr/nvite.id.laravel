import {LumiereInvitationPage} from '@/Components/invitation/LumiereInvitationPage';
import {BloomInvitationPage} from '@/Components/invitation/BloomInvitationPage';
import {SageInvitationPage} from '@/Components/invitation/SageInvitationPage';
import {OnyxInvitationPage} from '@/Components/invitation/OnyxInvitationPage';
import {getTemplateBySlug} from '@/lib/templates';

export default function TemplatePreview({templateSlug}) {
  const template = getTemplateBySlug(templateSlug);

  if (!template) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div className="max-w-xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Template not found</p>
          <h1 className="font-display text-5xl italic">This template does not exist.</h1>
          <p className="text-base leading-relaxed text-white/65">
            Please check the template URL or go back to the templates section.
          </p>
        </div>
      </main>
    );
  }

  if (!template.available || !template.content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div className="max-w-xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Coming soon</p>
          <h1 className="font-display text-5xl italic">{template.name} is not available yet.</h1>
          <p className="text-base leading-relaxed text-white/65">
            We are finishing this template now. Please check back soon.
          </p>
        </div>
      </main>
    );
  }

  const content = template.content;
  switch (content.template ?? 'lumiere') {
    case 'bloom': return <BloomInvitationPage invitation={content} isTemplatePreview />;
    case 'sage': return <SageInvitationPage invitation={content} isTemplatePreview />;
    case 'onyx': return <OnyxInvitationPage invitation={content} isTemplatePreview />;
    default: return <LumiereInvitationPage invitation={content} isTemplatePreview />;
  }
}
