import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiDocumentDownload, HiArchive, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { templateService } from '../services/templateService';
import { certificateService } from '../services/certificateService';
import { generateCertificatePDF, downloadPDF } from '../utils/pdfGenerator';
import { buildAndDownloadZip } from '../utils/zipBuilder';
import ManualEntryForm from '../components/data/ManualEntryForm';
import ExcelUpload from '../components/data/ExcelUpload';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GeneratePage = () => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [bulkData, setBulkData] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    loadTemplate();
  }, [templateId]); // eslint-disable-line

  const loadTemplate = async () => {
    try {
      const data = await templateService.getById(templateId);
      setTemplate(data);
    } catch {
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  // Generate a single certificate
  const handleSingleGenerate = async (recipientData) => {
    if (!template) return;
    setGenerating(true);

    try {
      // Save certificate record to server
      const certRecord = await certificateService.generate({
        templateId: template._id,
        recipientData,
      });

      // Generate PDF client-side
      const pdfBytes = await generateCertificatePDF(
        template,
        recipientData,
        certRecord.certificateId
      );

      // Download
      const firstName = recipientData[template.fields?.[0]?.name] || 'certificate';
      downloadPDF(pdfBytes, `${firstName.replace(/\s+/g, '_')}_certificate.pdf`);

      toast.success('Certificate generated and downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  // Generate bulk certificates
  const handleBulkGenerate = async () => {
    if (!template || bulkData.length === 0) return;
    setGenerating(true);
    setProgress({ current: 0, total: bulkData.length });

    try {
      // Save all certificate records to server
      const result = await certificateService.bulkGenerate({
        templateId: template._id,
        recipients: bulkData,
      });

      // Generate PDFs
      const files = [];
      for (let i = 0; i < result.certificates.length; i++) {
        const cert = result.certificates[i];
        const recipientData = bulkData[i];

        const pdfBytes = await generateCertificatePDF(
          template,
          recipientData,
          cert.certificateId
        );

        const firstName = recipientData[template.fields?.[0]?.name] || `cert_${i + 1}`;
        files.push({
          name: `${firstName.replace(/\s+/g, '_')}_certificate.pdf`,
          data: pdfBytes,
        });

        setProgress({ current: i + 1, total: bulkData.length });
      }

      // Build and download ZIP
      await buildAndDownloadZip(files, `certificates_${template.name.replace(/\s+/g, '_')}.zip`);

      toast.success(`${files.length} certificates generated!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate certificates');
    } finally {
      setGenerating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-surface-400">Template not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/editor/${template._id}`}>
            <Button variant="ghost" icon={HiArrowLeft}>Back to Editor</Button>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold font-[Outfit] text-surface-100 mb-2">
            Generate Certificates
          </h1>
          <p className="text-surface-400 text-sm mb-8">
            Template: <span className="text-primary-400">{template.name}</span> ·
            {template.fields?.length || 0} fields defined
          </p>

          {/* Tab selector */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'gradient-primary text-white shadow-glow'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('excel')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'excel'
                  ? 'gradient-primary text-white shadow-glow'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
              }`}
            >
              Excel / CSV Upload
            </button>
          </div>

          {/* Content */}
          {activeTab === 'manual' ? (
            <ManualEntryForm
              fields={template.fields || []}
              onGenerate={handleSingleGenerate}
              loading={generating}
            />
          ) : (
            <div className="space-y-6">
              <ExcelUpload
                fields={template.fields || []}
                onDataParsed={setBulkData}
              />

              {bulkData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                    <span className="text-sm text-surface-200">
                      <strong className="text-primary-400">{bulkData.length}</strong> records ready for generation
                    </span>
                  </div>

                  {/* Progress bar */}
                  {generating && progress.total > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-surface-400">
                        <span>Generating certificates...</span>
                        <span>{progress.current} / {progress.total}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-primary transition-all duration-300"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleBulkGenerate}
                      loading={generating}
                      icon={HiArchive}
                      size="lg"
                    >
                      Generate All & Download ZIP
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
