import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique certificate ID.
 * Format: CERT-XXXXXXXX (8 char hex string)
 */
export const generateCertificateId = () => {
  const uuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
  return `CERT-${uuid}`;
};
