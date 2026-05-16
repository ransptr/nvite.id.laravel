export type GuestSendStatus = 'pending' | 'sending' | 'sent' | 'failed';

export type GuestRecord = {
  id: string;
  invitation_id: string;
  name: string;
  phone_raw: string;
  phone_normalized: string;
  guest_key: string;
  send_status: GuestSendStatus;
  last_sent_at: string | null;
  last_error: string | null;
  provider_message_id: string | null;
  created_at: string;
  updated_at: string;
};
