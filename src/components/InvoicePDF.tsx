"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    lineHeight: 1.3,
  },
  watermarkContainer: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: '70%',
    height: '50%',
    opacity: 0.05,
    zIndex: -1
  },
  watermarkImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 80,
    height: 80,
    objectFit: 'contain'
  },
  cnpjText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    marginTop: 20
  },
  titleCenter: {
    textAlign: 'center',
    marginTop: -10,
  },
  proformaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1
  },
  invoiceNoBoxContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  invoiceNoBox: {
    border: '1px solid #000000',
    padding: '4px 8px',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between'
  },
  metaCol1: {
    width: '25%',
  },
  metaRowText: {
    flexDirection: 'row',
    marginBottom: 3
  },
  metaLabel: {
    color: '#00509E',
    fontFamily: 'Helvetica-Bold',
    width: 80,
  },
  metaValue: {
    fontFamily: 'Helvetica',
  },
  metaCol2: {
    width: '35%',
    flexDirection: 'row',
  },
  metaCol3: {
    width: '35%',
    flexDirection: 'row',
  },
  yellowTag: {
    backgroundColor: '#FDE047',
    color: '#EF4444',
    padding: '2px 4px',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    height: 12,
    marginRight: 6,
  },
  metaAddressText: {
    flex: 1,
    fontSize: 7,
    lineHeight: 1.4,
    textTransform: 'uppercase'
  },

  // Green Table
  greenTableContainer: {
    marginTop: 25,
  },
  greenTableHeaders: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  greenColHeader: {
    color: '#00509E',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'center',
  },
  greenTableBody: {
    flexDirection: 'row',
    backgroundColor: '#86EFAC',
  },
  greenCell: {
    border: '1px solid #000000',
    padding: 5,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    justifyContent: 'center',
  },
  
  // Items Table
  itemsTableContainer: {
    marginTop: 25,
  },
  itemsTableHeaders: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  itemsColHeader: {
    color: '#00509E',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  itemsRow: {
    flexDirection: 'row',
    borderTop: '1px solid #000000',
    borderLeft: '1px solid #000000',
    borderRight: '1px solid #000000',
  },
  itemsCell: {
    padding: 6,
    fontSize: 8,
    borderRight: '1px solid #000000',
    textTransform: 'uppercase',
    justifyContent: 'center',
  },
  itemsCellLast: {
    padding: 6,
    fontSize: 8,
    justifyContent: 'center',
  },
  itemsTotalRow: {
    flexDirection: 'row',
    border: '1px solid #000000',
  },
  
  // Bank Details
  bankTitle: {
    backgroundColor: '#86EFAC',
    padding: '3px 8px',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 5,
    border: '1px solid #86EFAC'
  },
  bankBox: {
    border: '1px solid #000000',
    padding: 10,
  },
  bankLine: {
    fontSize: 8,
    marginBottom: 3,
    textTransform: 'uppercase'
  },
  
  // Signature
  signatureContainer: {
    marginTop: 25,
    alignItems: 'flex-end',
    paddingRight: 20
  },
  
  // Footer
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
  },
  footerCompany: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase'
  },
  footerDetails: {
    fontSize: 7,
    marginTop: 3,
    textTransform: 'uppercase',
    color: '#4A4A4A'
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
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  companyLogo?: string;
  bankDetails?: string;
}

export default function InvoicePDF({ data }: { data: InvoiceData }) {
  const defaultLogo = `${data.origin}/images/footsprintLogo.jpeg`;
  const logoUrl = data.companyLogo || defaultLogo;

  const formatCurrency = (amount: number) => {
    return 'US$ ' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const cName = data.companyName || "Footprints Energy";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Watermark */}
        <View style={styles.watermarkContainer}>
          <Image src={logoUrl} style={styles.watermarkImage} />
        </View>

        {/* Top Header */}
        <View style={styles.topRow}>
          <View style={{ flexDirection: 'column', alignItems: 'center', width: 120 }}>
            <Image src={logoUrl} style={styles.logoImage} />
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#1D1D1D', marginTop: 2, textAlign: 'center' }}>
              {cName.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 5.5, color: '#DAA35D', marginTop: 1.5, letterSpacing: 0.5, textAlign: 'center' }}>
              GLOBAL COMMODITIES TRADE
            </Text>
          </View>
          {/* We assume CNPJ or Registration might be in notes or contact, if not we leave a placeholder or empty */}
          <Text style={styles.cnpjText}></Text>
        </View>

        <View style={styles.titleCenter}>
          <Text style={styles.proformaTitle}>PROFORMA INVOICE</Text>
        </View>

        <View style={styles.invoiceNoBoxContainer}>
          <Text style={styles.invoiceNoBox}>Nº: {data.invoiceNo}</Text>
        </View>

        {/* Meta Data Row */}
        <View style={styles.metaContainer}>
          <View style={styles.metaCol1}>
            <View style={styles.metaRowText}>
              <Text style={styles.metaLabel}>DATA:</Text>
              <Text style={styles.metaValue}>{data.date.toUpperCase()}</Text>
            </View>
            <View style={styles.metaRowText}>
              <Text style={styles.metaLabel}>INVOICE NUMBER:</Text>
              <Text style={styles.metaValue}>{data.invoiceNo}</Text>
            </View>
          </View>
          
          <View style={styles.metaCol2}>
            <Text style={styles.yellowTag}>BUYER</Text>
            <Text style={styles.metaAddressText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>{data.clientName}</Text>{'\n'}
              {data.clientAddress}
            </Text>
          </View>

          <View style={styles.metaCol3}>
            <Text style={styles.yellowTag}>SELLER ADDRESS</Text>
            <Text style={styles.metaAddressText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>{cName}</Text>{'\n'}
              {data.companyAddress}{'\n'}
              {data.companyContact ? `PHONE: ${data.companyContact.replace('\n', ' | ')}` : ''}
            </Text>
          </View>
        </View>

        {/* Green Conditions Table */}
        <View style={styles.greenTableContainer}>
          <View style={styles.greenTableHeaders}>
            <Text style={{ ...styles.greenColHeader, width: '30%' }}>SELLER</Text>
            <Text style={{ ...styles.greenColHeader, width: '25%' }}>BUYER</Text>
            <Text style={{ ...styles.greenColHeader, width: '30%' }}>PAYMENT CONDITIONS</Text>
            <Text style={{ ...styles.greenColHeader, width: '15%' }}>EXPIRATION DATE</Text>
          </View>
          <View style={styles.greenTableBody}>
            <View style={{ ...styles.greenCell, width: '30%', borderRight: 0 }}><Text>{cName}</Text></View>
            <View style={{ ...styles.greenCell, width: '25%', borderRight: 0 }}><Text>{data.clientName}</Text></View>
            <View style={{ ...styles.greenCell, width: '30%', borderRight: 0 }}>
              <Text>IN ADVANCE, AGAINST PROFORMA INVOICE</Text>
            </View>
            <View style={{ ...styles.greenCell, width: '15%' }}>
              <Text>30 DAYS</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.itemsTableContainer}>
          <View style={styles.itemsTableHeaders}>
            <Text style={{ ...styles.itemsColHeader, width: '50%', paddingLeft: 6 }}>DESCRIPTION</Text>
            <Text style={{ ...styles.itemsColHeader, width: '25%', textAlign: 'center' }}>PRICE</Text>
            <Text style={{ ...styles.itemsColHeader, width: '25%', textAlign: 'center' }}>TOTAL PRICE</Text>
          </View>
          
          {data.items.map((item, i) => {
            const lineTotal = item.unitPrice * (parseFloat(item.quantity) || 1);
            return (
              <View key={i} style={styles.itemsRow}>
                <View style={{ ...styles.itemsCell, width: '50%' }}>
                  <Text>{item.quantity} {item.productName || "Custom Item"}</Text>
                </View>
                <View style={{ ...styles.itemsCell, width: '25%', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{formatCurrency(item.unitPrice)}</Text>
                </View>
                <View style={{ ...styles.itemsCellLast, width: '25%', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{formatCurrency(lineTotal)}</Text>
                </View>
              </View>
            );
          })}
          
          {/* Summary Row */}
          <View style={styles.itemsTotalRow}>
            <View style={{ ...styles.itemsCell, width: '75%', alignItems: 'center', borderBottom: 0 }}>
              <Text>TOTAL AMOUNT</Text>
            </View>
            <View style={{ ...styles.itemsCellLast, width: '25%', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>{formatCurrency(data.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Bank Details */}
        {data.bankDetails && (
          <View wrap={false}>
            <Text style={styles.bankTitle}>BANK DETAILS</Text>
            <View style={styles.bankBox}>
              {data.bankDetails.split('\n').map((line, i) => (
                <Text key={`bank-${i}`} style={styles.bankLine}>{line}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Notes (If any) */}
        {data.notes && (
          <View wrap={false} style={{ marginTop: 15 }}>
            <Text style={{ ...styles.bankTitle, backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' }}>NOTES / TERMS</Text>
            <View style={{ ...styles.bankBox, padding: 8 }}>
              {data.notes.split('\n').map((line, i) => (
                <Text key={`note-${i}`} style={styles.bankLine}>{line}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Signature */}
        <View wrap={false} style={styles.signatureContainer}>
          <Image src={`${data.origin}/images/signaturee.png`} style={{ width: 140, height: 70, objectFit: 'contain' }} />
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11, marginTop: 5 }}>Moyosore Atobatele</Text>
          <Text style={{ fontSize: 9, color: '#4A4A4A', marginTop: 2 }}>Executive Director</Text>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.footerCompany}>{cName}</Text>
          <Text style={styles.footerDetails}>
            {data.companyAddress ? data.companyAddress.replace('\n', ' - ') : ''} 
            {data.companyContact ? ` - ${data.companyContact.replace('\n', ' - ')}` : ''}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
