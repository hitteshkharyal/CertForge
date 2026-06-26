import QRCode from 'qrcode';

/**
 * Generate a QR code as a PNG data URL.
 * @param {string} certificateId - The unique certificate ID
 * @param {string} baseUrl - The base URL of the app
 * @returns {Promise<string>} Data URL of the QR code image
 */
export const generateQRCode = async (certificateId, baseUrl = window.location.origin) => {
  const verifyUrl = `${baseUrl}/verify/${certificateId}`;

  const dataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 120,
    margin: 1,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });

  return dataUrl;
};

/**
 * Generate QR code as a Uint8Array (for embedding in PDFs).
 * @param {string} certificateId
 * @param {string} baseUrl
 * @returns {Promise<Uint8Array>}
 */
export const generateQRCodeBytes = async (certificateId, baseUrl = window.location.origin) => {
  const dataUrl = await generateQRCode(certificateId, baseUrl);
  // Convert data URL to Uint8Array
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
