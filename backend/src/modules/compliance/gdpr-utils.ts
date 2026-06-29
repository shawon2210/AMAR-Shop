export function anonymizeUser(user: any): any {
  const anonymized = { ...user };
  anonymized.name = 'Deleted User';
  anonymized.phone = `deleted-${anonymized.id?.slice(0, 8) || 'anon'}`;
  anonymized.email = null;
  anonymized.password = '[REDACTED]';
  anonymized.avatar = null;
  anonymized.addresses = [];
  anonymized.deviceTokens = [];
  anonymized.twoFactorSecret = null;
  return anonymized;
}

export async function exportUserData(userId: string): Promise<{
  account: any;
  orders: any[];
  addresses: any[];
  reviews: any[];
  activities: any[];
  exportDate: string;
}> {
  return {
    account: { id: userId, exportedAt: new Date().toISOString() },
    orders: [],
    addresses: [],
    reviews: [],
    activities: [],
    exportDate: new Date().toISOString(),
  };
}

export function getDataRetentionPeriods(): {
  dataType: string;
  retentionPeriod: string;
  legalBasis: string;
}[] {
  return [
    { dataType: 'account', retentionPeriod: '5 years after closure', legalBasis: 'Legal obligation' },
    { dataType: 'orders', retentionPeriod: '7 years', legalBasis: 'Tax compliance' },
    { dataType: 'payment', retentionPeriod: '7 years', legalBasis: 'Financial regulations' },
    { dataType: 'browsing', retentionPeriod: '90 days', legalBasis: 'Legitimate interest' },
    { dataType: 'search', retentionPeriod: '90 days', legalBasis: 'Legitimate interest' },
    { dataType: 'messages', retentionPeriod: '2 years', legalBasis: 'Customer service' },
    { dataType: 'cookies', retentionPeriod: '1 year', legalBasis: 'Consent' },
    { dataType: 'kyc', retentionPeriod: '5 years', legalBasis: 'Regulatory compliance' },
    { dataType: 'logs', retentionPeriod: '3 years', legalBasis: 'Security' },
  ];
}
