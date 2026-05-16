import {useCallback, useEffect, useState} from 'react';
import {isReservedSlug} from '@/lib/templates';
import type {InvitationConfig} from '@/types/invitation';

export type InvitationRow = {
  id: string;
  slug: string;
  is_published: boolean;
  content: InvitationConfig;
  created_at: string;
  updated_at: string;
};

type Profile = {
  plan: 'free' | 'basic' | 'pro';
};

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  basic: 3,
  pro: Infinity,
};

export function useInvitations() {
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [invRes, profRes] = await Promise.all([
        window.axios.get('/api/invitations'),
        window.axios.get('/api/profile'),
      ]);

      setInvitations(invRes.data ?? []);
      setProfile(profRes.data ?? null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const atLimit = profile
    ? invitations.length >= (PLAN_LIMITS[profile.plan] ?? 1)
    : false;

  const planLimit = profile ? PLAN_LIMITS[profile.plan] : 1;

  const isSlugTaken = async (slug: string, excludeId?: string): Promise<boolean> => {
    try {
      const res = await window.axios.get(`/api/invitations/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&exclude=${excludeId}` : ''}`);
      return res.data.taken === true;
    } catch {
      return false;
    }
  };

  const createInvitation = async (
    slug: string,
    content: InvitationConfig,
  ): Promise<{id: string} | {error: string}> => {
    if (isReservedSlug(slug)) {
      return {error: 'This slug is reserved for system routes. Please choose a different slug.'};
    }

    try {
      const res = await window.axios.post('/api/invitations', {
        slug,
        content,
        is_published: false,
      });
      await load();
      return {id: res.data.id};
    } catch (e: any) {
      return {error: e?.response?.data?.error ?? 'Failed to create invitation'};
    }
  };

  const updateInvitation = async (
    id: string,
    updates: Partial<Pick<InvitationRow, 'slug' | 'is_published' | 'content'>>,
  ): Promise<{error: string} | null> => {
    if (updates.slug) {
      if (isReservedSlug(updates.slug)) {
        return {error: 'This slug is reserved for system routes. Please choose a different slug.'};
      }
    }

    try {
      await window.axios.patch(`/api/invitations/${id}`, updates);
      await load();
      return null;
    } catch (e: any) {
      return {error: e?.response?.data?.error ?? 'Failed to update invitation'};
    }
  };

  const deleteInvitation = async (id: string): Promise<void> => {
    try {
      await window.axios.delete(`/api/invitations/${id}`);
      await load();
    } catch {
      // ignore
    }
  };

  return {
    invitations,
    profile,
    loading,
    error,
    atLimit,
    planLimit,
    isSlugTaken,
    createInvitation,
    updateInvitation,
    deleteInvitation,
    reload: load,
  };
}
