"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1D1D1D',
    backgroundColor: '#FFFFFF',
    lineHeight: 1.5,
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
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: 5,
  },
  companyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#1D1D1D',
    textAlign: 'center',
  },
  slogan: {
    fontSize: 7,
    color: '#DAA35D',
    marginTop: 2,
    letterSpacing: 1,
    textAlign: 'center',
  },
  dateLine: {
    textAlign: 'right',
    marginBottom: 20,
    fontSize: 10,
  },
  recipientBox: {
    marginBottom: 30,
    maxWidth: '50%',
  },
  recipientText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  subjectLine: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 10,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureImage: {
    width: 120,
    height: 60,
    objectFit: 'contain',
    marginLeft: -10,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
    marginTop: 5,
  },
  signatureTitle: {
    fontSize: 9,
    color: '#4A4A4A',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1px solid #E5E5E5',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    lineHeight: 1.4,
  }
});

export interface LetterData {
  date: string;
  recipientDetails: string;
  subject: string;
  body: string;
  origin: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  letterheadUrl?: string | null;
  signatureUrl?: string | null;
}

export default function LetterPDF({ data }: { data: LetterData }) {
  const defaultLogo = `${data.origin}/images/footsprintLogo.jpeg`;
  const defaultSignature = `${data.origin}/images/signaturee.png`;
  
  const logoUrl = data.letterheadUrl || defaultLogo;
  const signatureImg = data.signatureUrl || defaultSignature;
  
  const cName = data.companyName || "Footprints Energy";
  
  // Split body text by newlines into paragraphs
  const paragraphs = data.body.split('\n').filter(p => p.trim() !== '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Watermark */}
        <View style={styles.watermarkContainer}>
          <Image src={logoUrl} style={styles.watermarkImage} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logoImage} />
          <Text style={styles.companyName}>{cName.toUpperCase()}</Text>
          <Text style={styles.slogan}>GLOBAL COMMODITIES TRADE</Text>
        </View>

        {/* Date */}
        <Text style={styles.dateLine}>{data.date}</Text>

        {/* Recipient */}
        <View style={styles.recipientBox}>
          {data.recipientDetails.split('\n').map((line, i) => (
            <Text key={i} style={styles.recipientText}>{line}</Text>
          ))}
        </View>

        {/* Subject */}
        {data.subject && (
          <Text style={styles.subjectLine}>{data.subject}</Text>
        )}

        {/* Body */}
        <View>
          {paragraphs.map((p, i) => (
            <Text key={i} style={styles.bodyText}>{p}</Text>
          ))}
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={{ fontSize: 10, marginBottom: 10 }}>Yours faithfully,</Text>
          <Image src={signatureImg} style={styles.signatureImage} />
          <Text style={styles.signatureName}>Moyosore Atobatele</Text>
          <Text style={styles.signatureTitle}>Executive Director</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{cName.toUpperCase()}</Text>
          <Text style={styles.footerText}>
            {data.companyAddress || '123 Business Avenue, Corporate District'}
          </Text>
          <Text style={styles.footerText}>
            {data.companyContact || 'contact@footprintsenergy.com | +1 234 567 8900'}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
