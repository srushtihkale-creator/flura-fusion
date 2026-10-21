import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";
import { EmailCampaign, CampaignCreatePayload, CampaignPreview } from "@/types/campaign";

export const CampaignService = {
  /**
   * Fetch all email campaigns for administrative oversight
   */
  async getAllCampaigns(): Promise<EmailCampaign[]> {
    if (!IS_BACKEND_CONFIGURED) {
      return getDemoCampaigns();
    }
    return apiFetch<EmailCampaign[]>("admin/campaigns");
  },

  /**
   * Fetch a single campaign by ID
   */
  async getCampaignById(id: string): Promise<EmailCampaign> {
    if (!IS_BACKEND_CONFIGURED) {
      const demo = getDemoCampaigns().find((c) => c.id === id);
      if (demo) return demo;
      throw new Error("Campaign not found");
    }
    return apiFetch<EmailCampaign>(`admin/campaigns/${id}`);
  },

  /**
   * Fetch rendered HTML preview and recipient count
   */
  async getCampaignPreview(id: string): Promise<CampaignPreview> {
    if (!IS_BACKEND_CONFIGURED) {
      return {
        campaignId: id,
        title: "Monsoon Plant Sale",
        subject: "Special Monsoon Offers for You 🌿",
        renderedHtml: "<p>Demo preview</p>",
        eligibleRecipientCount: 2,
        sampleRecipientEmail: "srushti@florafusion.com",
        couponCode: "FLORA10",
        discountSummary: "10% OFF",
        targetCategory: "plants",
        status: "DRAFT",
      };
    }
    return apiFetch<CampaignPreview>(`admin/campaigns/${id}/preview`);
  },

  /**
   * Count of opted-in customer subscribers
   */
  async getEligibleSubscribersCount(): Promise<number> {
    if (!IS_BACKEND_CONFIGURED) {
      return 2;
    }
    const res = await apiFetch<{ eligibleSubscribers: number }>("admin/campaigns/subscribers/count");
    return res.eligibleSubscribers;
  },

  /**
   * Create a new campaign (DRAFT)
   */
  async createCampaign(payload: CampaignCreatePayload): Promise<EmailCampaign> {
    if (!IS_BACKEND_CONFIGURED) {
      const newCamp: EmailCampaign = {
        id: "camp-" + Date.now(),
        ...payload,
        status: "DRAFT",
        totalRecipients: 0,
        sentCount: 0,
        failedCount: 0,
        testMode: payload.testMode || false,
        testRecipient: payload.testRecipient || null,
        targetCategory: payload.targetCategory || "all",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: payload.startDate || new Date().toISOString(),
      };
      return newCamp;
    }
    return apiFetch<EmailCampaign>("admin/campaigns", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing draft campaign
   */
  async updateCampaign(id: string, payload: CampaignCreatePayload): Promise<EmailCampaign> {
    if (!IS_BACKEND_CONFIGURED) {
      return {
        id,
        ...payload,
        status: "DRAFT",
        totalRecipients: 0,
        sentCount: 0,
        failedCount: 0,
        testMode: payload.testMode || false,
        targetCategory: payload.targetCategory || "all",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: payload.startDate || new Date().toISOString(),
      };
    }
    return apiFetch<EmailCampaign>(`admin/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Approve a campaign for sending
   */
  async approveCampaign(id: string): Promise<EmailCampaign> {
    if (!IS_BACKEND_CONFIGURED) {
      return {
        id,
        title: "Demo Approved Campaign",
        subject: "Demo Subject",
        promotionalMessage: "Demo",
        targetCategory: "all",
        status: "APPROVED",
        startDate: new Date().toISOString(),
        totalRecipients: 2,
        sentCount: 0,
        failedCount: 0,
        testMode: false,
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return apiFetch<EmailCampaign>(`admin/campaigns/${id}/approve`, {
      method: "PATCH",
    });
  },

  /**
   * Explicitly trigger campaign dispatch via n8n Cloud and Gmail SMTP
   */
  async triggerCampaign(id: string, testMode: boolean = false, testRecipient?: string): Promise<EmailCampaign> {
    const params = new URLSearchParams();
    if (testMode) params.append("testMode", "true");
    if (testRecipient) params.append("testRecipient", testRecipient.trim());

    const endpoint = `admin/campaigns/${id}/trigger?${params.toString()}`;
    return apiFetch<EmailCampaign>(endpoint, {
      method: "POST",
    });
  },

  /**
   * Cancel an active or draft campaign
   */
  async cancelCampaign(id: string): Promise<EmailCampaign> {
    return apiFetch<EmailCampaign>(`admin/campaigns/${id}/cancel`, {
      method: "POST",
    });
  },

  /**
   * Public unsubscribe endpoint
   */
  async unsubscribe(token: string): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(`unsubscribe?token=${encodeURIComponent(token)}`);
  },
};

function getDemoCampaigns(): EmailCampaign[] {
  return [
    {
      id: "camp-01",
      title: "Monsoon Indoor Plant Special",
      subject: "Bring Lush Greenery Indoors with 10% OFF 🌿",
      promotionalMessage:
        "Transform your living space with our best-selling indoor plants. For a limited time, enjoy 10% off using code FLORA10 at checkout!",
      couponCode: "FLORA10",
      couponTitle: "10% OFF",
      discountValue: 10,
      discountType: "PERCENTAGE",
      targetCategory: "plants",
      status: "APPROVED",
      startDate: new Date().toISOString(),
      totalRecipients: 15,
      sentCount: 0,
      failedCount: 0,
      testMode: true,
      testRecipient: "srushti.h.kale2004@gmail.com",
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
