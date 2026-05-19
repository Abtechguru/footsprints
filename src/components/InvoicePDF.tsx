"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1D1D1D',
    backgroundColor: '#FFFFFF',
    lineHeight: 1.5,
  },
  watermarkContainer: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    height: '40%',
    opacity: 0.05, // very light watermark
    zIndex: -1
  },
  watermarkImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '2px solid #FD630A',
    paddingBottom: 20
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1D1D1D',
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: '#FD630A',
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 9,
    color: '#4A4A4A',
  },
  documentTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#1D1D1D'
  },
  metaDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clientSection: {
    width: '50%',
  },
  metaSection: {
    width: '40%',
    textAlign: 'right'
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#DAA35D',
    textTransform: 'uppercase',
    marginBottom: 5,
    letterSpacing: 1
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1D1D1D',
    color: '#FFFFFF',
    padding: 8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E5E5',
    padding: 10,
  },
  colDesc: { width: '40%' },
  colQty: { width: '20%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  
  summaryBox: {
    alignSelf: 'flex-end',
    width: '40%',
    borderTop: '2px solid #1D1D1D',
    paddingTop: 10,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1px solid #E5E5E5',
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#FD630A'
  },
  notesSection: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#F7F3E6',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
    borderTop: '1px solid #E5E5E5',
    paddingTop: 10
  }
});

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: string;
  unitPrice: number;
}

interface InvoiceData {
  invoiceNo: string;
  date: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  notes: string;
  origin: string;
}

export default function InvoicePDF({ data }: { data: InvoiceData }) {
  const logoUrl = `${data.origin}/images/footsprintLogo.jpeg`;

  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Watermark */}
        <View style={styles.watermarkContainer}>
          <Image src={logoUrl} style={styles.watermarkImage} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src={logoUrl} style={styles.logoImage} />
            <View style={styles.logoTextContainer}>
              <View>
                <Text style={styles.logoTitle}>Footprints <Text style={styles.logoHighlight}>Energy</Text></Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 9, color: '#DAA35D', letterSpacing: 1 }}>GLOBAL COMMODITIES TRADE</Text>
              </View>
            </View>
          </View>
          <View style={styles.companyDetails}>
            <Text>123 Trade Center Blvd</Text>
            <Text>New York, NY 10001</Text>
            <Text>contact@footprintsenergy.com</Text>
            <Text>+1 (555) 123-4567</Text>
          </View>
        </View>

        <Text style={styles.documentTitle}>Quotation / Invoice</Text>

        {/* Meta Data */}
        <View style={styles.metaDataContainer}>
          <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>Billed To:</Text>
            <Text style={styles.boldText}>{data.clientName || "Client Name"}</Text>
            <Text>{data.clientAddress || "Client Address"}</Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.sectionTitle}>Invoice Details:</Text>
            <Text>Invoice No: <Text style={styles.boldText}>{data.invoiceNo}</Text></Text>
            <Text>Date: <Text style={styles.boldText}>{data.date}</Text></Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Quantity / Size</Text>
            <Text style={styles.colPrice}>Unit Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          
          {data.items.map((item, i) => {
            const lineTotal = item.unitPrice * (parseFloat(item.quantity) || 1);
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.productName || "Custom Item"}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={styles.colTotal}>{formatCurrency(lineTotal)}</Text>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(data.totalAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tax (0%):</Text>
            <Text>$0.00</Text>
          </View>
          <View style={styles.summaryTotalRow}>
            <Text>Grand Total:</Text>
            <Text>{formatCurrency(data.totalAmount)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Terms & Conditions / Quotation Text</Text>
            <Text style={{ fontSize: 9, marginTop: 5 }}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          This is a computer-generated document. No signature is required. Thank you for doing business with Footprints Energy.
        </Text>
      </Page>
    </Document>
  );
}
