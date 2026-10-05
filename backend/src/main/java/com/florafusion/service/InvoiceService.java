package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.order.ShippingAddressDto;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a");
    private final ObjectMapper objectMapper;

    // Flora Fusion Design Tokens
    private static final Color BRAND_FOREST = new Color(23, 63, 43);   // #173F2B
    private static final Color BRAND_DEEP = new Color(18, 50, 34);     // #123222
    private static final Color CREAM_BG = new Color(247, 244, 236);    // #F7F4EC
    private static final Color TEXT_MUTED = new Color(100, 110, 105);

    public byte[] generateInvoicePdf(Order order) {
        Document document = new Document(PageSize.A4, 36, 36, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Header / Brand Bar
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            PdfPCell brandCell = new PdfPCell();
            brandCell.setBorder(Rectangle.NO_BORDER);
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BRAND_FOREST);
            Paragraph brandTitle = new Paragraph("Flora Fusion", brandFont);
            Font mottoFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, TEXT_MUTED);
            Paragraph motto = new Paragraph("Nature Meets Your Space — Premium Nursery", mottoFont);
            brandCell.addElement(brandTitle);
            brandCell.addElement(motto);

            PdfPCell invoiceMetaCell = new PdfPCell();
            invoiceMetaCell.setBorder(Rectangle.NO_BORDER);
            invoiceMetaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Font invoiceTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BRAND_DEEP);
            Paragraph invoiceTitle = new Paragraph("TAX INVOICE", invoiceTitleFont);
            invoiceTitle.setAlignment(Element.ALIGN_RIGHT);
            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Paragraph orderNum = new Paragraph("Order: " + order.getOrderNumber(), metaFont);
            orderNum.setAlignment(Element.ALIGN_RIGHT);
            String dateStr = order.getCreatedAt() != null ? DATE_FORMATTER.format(order.getCreatedAt().atZone(ZoneId.systemDefault())) : "N/A";
            Paragraph orderDate = new Paragraph("Date: " + dateStr, metaFont);
            orderDate.setAlignment(Element.ALIGN_RIGHT);

            invoiceMetaCell.addElement(invoiceTitle);
            invoiceMetaCell.addElement(orderNum);
            invoiceMetaCell.addElement(orderDate);

            headerTable.addCell(brandCell);
            headerTable.addCell(invoiceMetaCell);
            document.add(headerTable);

            document.add(new Paragraph(" "));

            // 2. Customer & Address Details
            ShippingAddressDto address = null;
            try {
                if (order.getShippingAddressSnapshot() != null) {
                    address = objectMapper.readValue(order.getShippingAddressSnapshot(), ShippingAddressDto.class);
                }
            } catch (Exception ignored) {
            }

            PdfPTable addressTable = new PdfPTable(2);
            addressTable.setWidthPercentage(100);
            addressTable.setWidths(new float[]{50, 50});

            PdfPCell billToCell = new PdfPCell();
            billToCell.setBorder(Rectangle.BOX);
            billToCell.setBorderColor(new Color(220, 225, 220));
            billToCell.setPadding(10);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BRAND_FOREST);
            billToCell.addElement(new Paragraph("DELIVER TO:", sectionTitleFont));
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            if (address != null) {
                billToCell.addElement(new Paragraph(address.name(), textFont));
                billToCell.addElement(new Paragraph(address.address(), textFont));
                billToCell.addElement(new Paragraph(address.city() + ", " + address.pincode(), textFont));
                billToCell.addElement(new Paragraph("Phone: " + address.phone(), textFont));
            } else {
                billToCell.addElement(new Paragraph("Customer / Guest Order", textFont));
            }

            PdfPCell payInfoCell = new PdfPCell();
            payInfoCell.setBorder(Rectangle.BOX);
            payInfoCell.setBorderColor(new Color(220, 225, 220));
            payInfoCell.setPadding(10);
            payInfoCell.addElement(new Paragraph("PAYMENT & STATUS:", sectionTitleFont));
            payInfoCell.addElement(new Paragraph("Payment Method: " + order.getPaymentMethod(), textFont));
            payInfoCell.addElement(new Paragraph("Payment Status: " + order.getPaymentStatus(), textFont));
            payInfoCell.addElement(new Paragraph("Order Status: " + order.getOrderStatus(), textFont));

            addressTable.addCell(billToCell);
            addressTable.addCell(payInfoCell);
            document.add(addressTable);

            document.add(new Paragraph(" "));

            // 3. Line Items Table
            PdfPTable itemsTable = new PdfPTable(5);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{45, 15, 12, 13, 15});

            String[] headers = {"Item Description", "SKU", "Qty", "Unit Price", "Total"};
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            for (String h : headers) {
                PdfPCell th = new PdfPCell(new Phrase(h, tableHeaderFont));
                th.setBackgroundColor(BRAND_FOREST);
                th.setPadding(8);
                th.setHorizontalAlignment(Element.ALIGN_CENTER);
                itemsTable.addCell(th);
            }

            Font itemFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    PdfPCell nameCell = new PdfPCell(new Phrase(item.getProductNameSnapshot(), itemFont));
                    nameCell.setPadding(6);
                    itemsTable.addCell(nameCell);

                    PdfPCell skuCell = new PdfPCell(new Phrase(item.getSkuSnapshot(), itemFont));
                    skuCell.setPadding(6);
                    skuCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemsTable.addCell(skuCell);

                    PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), itemFont));
                    qtyCell.setPadding(6);
                    qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    itemsTable.addCell(qtyCell);

                    PdfPCell priceCell = new PdfPCell(new Phrase("Rs. " + item.getUnitPrice(), itemFont));
                    priceCell.setPadding(6);
                    priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemsTable.addCell(priceCell);

                    PdfPCell lineTotalCell = new PdfPCell(new Phrase("Rs. " + item.getLineTotal(), itemFont));
                    lineTotalCell.setPadding(6);
                    lineTotalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    itemsTable.addCell(lineTotalCell);
                }
            }

            document.add(itemsTable);

            // 4. Financial Summary
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{65, 35});

            PdfPCell assuranceCell = new PdfPCell();
            assuranceCell.setBorder(Rectangle.NO_BORDER);
            assuranceCell.setPadding(10);
            Font assuranceFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, BRAND_FOREST);
            assuranceCell.addElement(new Paragraph("🌿 Flora Fusion Plant Transit Assurance:", assuranceFont));
            Font guaranteeFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);
            assuranceCell.addElement(new Paragraph("All botanical orders are packed in specialized eco-cushioned ventilated cartons. If plants arrive damaged, contact support@florafusion.com within 48h.", guaranteeFont));

            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(100);
            totalsTable.setWidths(new float[]{55, 45});

            addSummaryRow(totalsTable, "Subtotal:", "Rs. " + order.getSubtotal(), false);
            if (order.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                addSummaryRow(totalsTable, "Coupon Discount:", "- Rs. " + order.getDiscountAmount(), false);
            }
            addSummaryRow(totalsTable, "Delivery Fee:", order.getShippingAmount().compareTo(BigDecimal.ZERO) == 0 ? "FREE" : "Rs. " + order.getShippingAmount(), false);
            addSummaryRow(totalsTable, "Final Total:", "Rs. " + order.getTotalAmount(), true);

            PdfPCell totalsCell = new PdfPCell(totalsTable);
            totalsCell.setBorder(Rectangle.NO_BORDER);

            summaryTable.addCell(assuranceCell);
            summaryTable.addCell(totalsCell);
            document.add(summaryTable);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF invoice", e);
        }

        return out.toByteArray();
    }

    private void addSummaryRow(PdfPTable table, String label, String value, boolean isTotal) {
        Font font = isTotal
                ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BRAND_FOREST)
                : FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(4);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(4);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
