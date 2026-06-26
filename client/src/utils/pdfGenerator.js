import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { generateQRCodeBytes } from './qrGenerator';

/**
 * Convert hex color to pdf-lib rgb.
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return rgb(0, 0, 0);
  return rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  );
};

/**
 * Fetch image bytes from URL.
 */
const fetchImageBytes = async (url) => {
  const response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
};

/**
 * Embed an image in a PDF document (auto-detect PNG vs JPG).
 */
const embedImage = async (pdfDoc, imageBytes) => {
  try {
    return await pdfDoc.embedPng(imageBytes);
  } catch {
    return await pdfDoc.embedJpg(imageBytes);
  }
};

/**
 * Map font family name to a standard PDF font.
 * pdf-lib only supports standard fonts natively;
 * custom font embedding can be added later.
 */
const getStandardFont = async (pdfDoc, fontFamily, fontWeight, fontStyle) => {
  // Map common font requests to standard PDF fonts
  const isBold = fontWeight === 'bold' || fontWeight === '700';
  const isItalic = fontStyle === 'italic';

  if (isBold && isItalic) return pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  if (isBold) return pdfDoc.embedFont(StandardFonts.HelveticaBold);
  if (isItalic) return pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  return pdfDoc.embedFont(StandardFonts.Helvetica);
};

/**
 * Generate a single certificate PDF.
 *
 * @param {Object} template - Template object with fields, image URLs, positions
 * @param {Object} recipientData - Key-value pairs { fieldName: value }
 * @param {string} certificateId - Unique certificate ID for QR code
 * @param {Object} options - Additional options
 * @returns {Promise<Uint8Array>} PDF bytes
 */
export const generateCertificatePDF = async (template, recipientData, certificateId, options = {}) => {
  const pdfDoc = await PDFDocument.create();

  // Load and embed template image
  const templateBytes = await fetchImageBytes(template.templateImageUrl);
  const templateImage = await embedImage(pdfDoc, templateBytes);

  const imgWidth = template.templateWidth || templateImage.width;
  const imgHeight = template.templateHeight || templateImage.height;

  let scaleMultiplier = 1;
  if (template.canvasWidth && template.canvasWidth > 0) {
    scaleMultiplier = imgWidth / template.canvasWidth;
  }

  let objectsData = [];
  if (template.canvasJSON) {
    try {
      const json = JSON.parse(template.canvasJSON);
      objectsData = json.objects || [];
      // Fallback: If canvasWidth isn't present, deduce scale from the canvas background
      if ((!template.canvasWidth || template.canvasWidth === 0) && json.backgroundImage && json.backgroundImage.scaleX) {
        scaleMultiplier = 1 / json.backgroundImage.scaleX;
      }
    } catch (e) {
      console.warn('Failed to parse canvasJSON:', e);
    }
  }

  // Create page sized to template
  const page = pdfDoc.addPage([imgWidth, imgHeight]);

  // Draw template as background
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: imgWidth,
    height: imgHeight,
  });

  // Draw each field's text
  for (const field of (template.fields || [])) {
    const value = recipientData[field.name] || '';
    if (!value) continue;

    const font = await getStandardFont(pdfDoc, field.fontFamily, field.fontWeight, field.fontStyle);
    
    // Extract precise object state from canvas if available
    const canvasObj = objectsData.find(o => o.fieldId === field.id);
    const objScaleX = canvasObj ? (canvasObj.scaleX || 1) : 1;
    const objScaleY = canvasObj ? (canvasObj.scaleY || 1) : 1;
    
    const canvasX = canvasObj ? canvasObj.left : field.x;
    const canvasY = canvasObj ? canvasObj.top : field.y;
    // Visually scaling an object in FabricJS changes scaleX/Y but not fontSize. 
    // We compute the true visible font size here.
    const canvasFontSize = canvasObj ? (canvasObj.fontSize * objScaleY) : field.fontSize;
    const canvasWidth = canvasObj ? (canvasObj.width * objScaleX) : field.width;

    const fontSize = (canvasFontSize || 24) * scaleMultiplier;
    const color = hexToRgb(field.fontColor || '#1a1a2e');
    const fieldWidth = (canvasWidth || 200) * scaleMultiplier;

    // Convert canvas coordinates (origin top-left) to PDF coordinates (origin bottom-left)
    const pdfX = canvasX * scaleMultiplier;
    // We use a slight offset multiplier (0.85) to better align FabricJS top origin with PDF-lib baseline origin.
    const pdfY = imgHeight - (canvasY * scaleMultiplier) - (fontSize * 0.85);

    // Calculate text alignment offset
    let xOffset = 0;
    if (field.textAlign === 'center') {
      const textWidth = font.widthOfTextAtSize(value, fontSize);
      xOffset = (fieldWidth - textWidth) / 2;
    } else if (field.textAlign === 'right') {
      const textWidth = font.widthOfTextAtSize(value, fontSize);
      xOffset = fieldWidth - textWidth;
    }

    page.drawText(value, {
      x: pdfX + Math.max(0, xOffset),
      y: pdfY,
      size: fontSize,
      font,
      color,
    });
  }

  // Draw signature image if exists
  if (template.signatureImageUrl) {
    try {
      const sigObj = objectsData.find(o => o.overlayType === 'signature');
      const sp = template.signaturePosition || {};
      
      const canvasX = sigObj ? sigObj.left : (sp.x || 0);
      const canvasY = sigObj ? sigObj.top : (sp.y || 0);
      const objScaleX = sigObj ? (sigObj.scaleX || 1) : 1;
      const objScaleY = sigObj ? (sigObj.scaleY || 1) : 1;
      const canvasWidth = sigObj ? (sigObj.width * objScaleX) : (sp.width || 150);
      const canvasHeight = sigObj ? (sigObj.height * objScaleY) : (sp.height || 80);
      const opacity = sigObj ? (sigObj.opacity || 1) : (sp.opacity || 1);

      const sigBytes = await fetchImageBytes(template.signatureImageUrl);
      const sigImage = await embedImage(pdfDoc, sigBytes);

      page.drawImage(sigImage, {
        x: canvasX * scaleMultiplier,
        y: imgHeight - (canvasY * scaleMultiplier) - (canvasHeight * scaleMultiplier),
        width: canvasWidth * scaleMultiplier,
        height: canvasHeight * scaleMultiplier,
        opacity: opacity,
      });
    } catch (e) {
      console.warn('Failed to embed signature:', e);
    }
  }

  // Draw stamp image if exists
  if (template.stampImageUrl) {
    try {
      const stpObj = objectsData.find(o => o.overlayType === 'stamp');
      const stp = template.stampPosition || {};
      
      const canvasX = stpObj ? stpObj.left : (stp.x || 0);
      const canvasY = stpObj ? stpObj.top : (stp.y || 0);
      const objScaleX = stpObj ? (stpObj.scaleX || 1) : 1;
      const objScaleY = stpObj ? (stpObj.scaleY || 1) : 1;
      const canvasWidth = stpObj ? (stpObj.width * objScaleX) : (stp.width || 100);
      const canvasHeight = stpObj ? (stpObj.height * objScaleY) : (stp.height || 100);
      const opacity = stpObj ? (stpObj.opacity || 1) : (stp.opacity || 1);

      const stampBytes = await fetchImageBytes(template.stampImageUrl);
      const stampImage = await embedImage(pdfDoc, stampBytes);

      page.drawImage(stampImage, {
        x: canvasX * scaleMultiplier,
        y: imgHeight - (canvasY * scaleMultiplier) - (canvasHeight * scaleMultiplier),
        width: canvasWidth * scaleMultiplier,
        height: canvasHeight * scaleMultiplier,
        opacity: opacity,
      });
    } catch (e) {
      console.warn('Failed to embed stamp:', e);
    }
  }

  // Draw QR code
  if (certificateId) {
    try {
      const qrBytes = await generateQRCodeBytes(certificateId);
      const qrImage = await pdfDoc.embedPng(qrBytes);
      const qrSize = 80;
      const margin = 20;

      page.drawImage(qrImage, {
        x: imgWidth - qrSize - margin,
        y: margin,
        width: qrSize,
        height: qrSize,
      });

      // Draw certificate ID text below QR
      const idFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const idText = certificateId;
      const idFontSize = 7;
      const idTextWidth = idFont.widthOfTextAtSize(idText, idFontSize);

      page.drawText(idText, {
        x: imgWidth - qrSize - margin + (qrSize - idTextWidth) / 2,
        y: margin - 10,
        size: idFontSize,
        font: idFont,
        color: rgb(0.2, 0.2, 0.2),
      });
    } catch (e) {
      console.warn('Failed to embed QR code:', e);
    }
  }

  return pdfDoc.save();
};

/**
 * Trigger a PDF download in the browser.
 */
export const downloadPDF = (pdfBytes, filename = 'certificate.pdf') => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
