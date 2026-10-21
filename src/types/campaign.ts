export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  promotionalMessage: string;
  couponCode?: string | null;
  couponTitle?: string | null;
  discountValue?: number | null;
  discountType?: string | null;
  targetCategory: string;
  targetProductIds?: string | null;
  status: "DRAFT" | "APPROVED" | "PROCESSING" | "SENT" | "PARTIALLY_FAILED" | "FAILED" | "CANCELLED";
  startDate: string;
  endDate?: string | null;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  testMode: boolean;
  testRecipient?: string | null;
  approvedAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCreatePayload {
  title: string;
  subject: string;
  promotionalMessage: string;
  couponCode?: string;
  targetCategory?: string;
  targetProductIds?: string;
  startDate?: string;
  endDate?: string;
  testMode?: boolean;
  testRecipient?: string;
}

export interface CampaignPreview {
  campaignId: string;
  title: string;
  subject: string;
  renderedHtml: string;
  eligibleRecipientCount: number;
  sampleRecipientEmail: string;
  couponCode?: string | null;
  discountSummary?: string | null;
  targetCategory: string;
  status: string;
}

export interface CampaignRecipient {
  recipientId: string;
  email: string;
  name: string;
  status?: string;
  messageId?: string;
  sentAt?: string;
}
