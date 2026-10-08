package com.florafusion.dto.shipping;

public record ShippingShipmentDto(
        boolean success,
        boolean testMode,
        String floraOrderNumber,
        Long shiprocketOrderId,
        Long shiprocketShipmentId,
        String status,
        String message,
        String awbCode,
        String courierName
) {
    public static ShippingShipmentDto testModeSuccess(String floraOrderNumber, Long shiprocketOrderId, Long shiprocketShipmentId, String status) {
        return new ShippingShipmentDto(
                true,
                true,
                floraOrderNumber,
                shiprocketOrderId,
                shiprocketShipmentId,
                status != null ? status : "NEW",
                "Order created in Shiprocket (Test Mode active: courier assignment and live pickup dispatch are safely guarded).",
                null,
                null
        );
    }

    public static ShippingShipmentDto liveSuccess(String floraOrderNumber, Long shiprocketOrderId, Long shiprocketShipmentId, String status, String awbCode, String courierName) {
        return new ShippingShipmentDto(
                true,
                false,
                floraOrderNumber,
                shiprocketOrderId,
                shiprocketShipmentId,
                status,
                "Order dispatched to Shiprocket successfully.",
                awbCode,
                courierName
        );
    }

    public static ShippingShipmentDto error(String floraOrderNumber, boolean testMode, String message) {
        return new ShippingShipmentDto(
                false,
                testMode,
                floraOrderNumber,
                null,
                null,
                "FAILED",
                message,
                null,
                null
        );
    }
}
