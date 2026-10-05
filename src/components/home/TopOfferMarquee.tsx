"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CouponResponse, CouponService, FALLBACK_ACTIVE_COUPONS } from "@/services/coupon.service";
import { useFloraStore } from "@/store/useFloraStore";

export function TopOfferMarquee() {
  const [offers, setOffers] = useState<CouponResponse[]>(FALLBACK_ACTIVE_COUPONS);
  const router = useRouter();
  const { applyCoupon, addToast } = useFloraStore();

  useEffect(() => {
    let isMounted = true;
    async function fetchOffers() {
      try {
        const activeOffers = await CouponService.getActiveCoupons();
        if (isMounted) {
          // Only show active and valid offers
          setOffers(activeOffers.filter((o) => o.isActive));
        }
      } catch (err) {
        console.error("Failed to load marquee offers:", err);
      }
    }
    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  if (offers.length === 0) {
    return null;
  }

  const handleOfferClick = (e: React.MouseEvent, offer: CouponResponse) => {
    e.preventDefault();
    if (offer.autoApply) {
      applyCoupon(offer.code, {
        code: offer.code,
        discountPercentage: offer.discountType === "PERCENTAGE" ? offer.discountValue : 0,
        discountAmount: offer.discountType === "FIXED_AMOUNT" ? offer.discountValue : undefined,
        discountType: offer.discountType,
        minOrderValue: offer.minCartValue,
        maxDiscount: offer.maxDiscount,
        title: offer.title,
        bannerText: offer.bannerText,
        bundleQty: offer.bundleQty,
        bundlePrice: offer.bundlePrice,
        autoApply: true,
      });
      addToast(`🎉 Offer Activated: ${offer.title} (Auto-applied in cart)`, "success");
    } else {
      addToast(`Use coupon code ${offer.code} at checkout for ${offer.title}`, "info");
    }

    const destination = offer.targetLink || "/plants";
    router.push(destination);
  };

  // We duplicate the offer array to ensure seamless infinite looping with 0 jump/reset
  const displayItems = [...offers, ...offers, ...offers, ...offers];

  return (
    <div
      className="top-offer-marquee-container"
      id="top-offer-marquee"
      role="region"
      aria-label="Active Promotional Offers"
    >
      <div className="top-offer-marquee-track">
        {displayItems.map((offer, idx) => (
          <Link
            key={`${offer.id}-${idx}`}
            href={offer.targetLink || "/plants"}
            onClick={(e) => handleOfferClick(e, offer)}
            className="top-offer-marquee-item"
            title={`Click to explore qualifying items for ${offer.title}`}
          >
            <span className="marquee-offer-text">{offer.bannerText || offer.title}</span>
            <span className="marquee-action-pill">
              {offer.autoApply ? "Auto-Apply" : "Apply"} →
            </span>
            <span className="marquee-separator" aria-hidden="true">
              •
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
