import React from 'react';

// Shared design tokens for the VitaCore deep-purple theme
export const DS = {
  bg: 'linear-gradient(145deg, #6b5ce7 0%, #7c4ff0 40%, #6248d4 100%)',
  card: {
    background: '#ffffff',
    borderRadius: 20,
    border: '1.5px solid rgba(107,92,231,0.08)',
    boxShadow: '0 2px 16px rgba(107,92,231,0.10)',
    padding: '28px',
  },
  colors: {
    purple: '#8b5cf6',
    pink: '#e91e8c',
    gold: '#f5c518',
    green: '#16a34a',
    navy: '#1e1040',
    muted: '#64748b',
    white: '#ffffff',
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#64748b',
    textTransform: 'uppercase' as const,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    fontSize: 14,
    color: 'rgba(233,221,255,0.75)',
    fontWeight: 500,
    marginTop: 6,
  },
};

export const pageWrapperStyle: React.CSSProperties = {
  minHeight: '100%',
  background: DS.bg,
  padding: '36px 40px 60px',
  fontFamily: 'Inter, sans-serif',
  position: 'relative',
};

export const innerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
};

export const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 20,
  border: '1.5px solid rgba(107,92,231,0.08)',
  boxShadow: '0 2px 16px rgba(107,92,231,0.10)',
  padding: '28px',
};

