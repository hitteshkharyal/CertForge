import JSZip from 'jszip';

/**
 * Build a ZIP file from an array of { name, data } entries.
 * @param {{ name: string, data: Uint8Array }[]} files
 * @param {string} zipName - Name of the ZIP file
 * @returns {Promise<void>} Triggers download
 */
export const buildAndDownloadZip = async (files, zipName = 'certificates.zip') => {
  const zip = new JSZip();

  files.forEach(({ name, data }) => {
    zip.file(name, data);
  });

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  // Trigger download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = zipName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
