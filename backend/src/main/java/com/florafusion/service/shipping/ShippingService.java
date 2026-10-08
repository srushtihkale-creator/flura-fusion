package com.florafusion.service.shipping;

import com.florafusion.dto.shipping.ShippingShipmentDto;
import com.florafusion.entity.Order;

/**
 * High-level Shipping Service interface.
 * Decouples shipping providers (Shiprocket, etc.) from domain logic.
 */
public interface ShippingService {

    ShippingShipmentDto pushOrderToShipping(Order order);

    boolean isConfigured();

    boolean isTestMode();

    String getProviderName();
}
