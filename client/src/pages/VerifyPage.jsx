import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiCheckCircle, HiXCircle, HiQrcode } from 'react-icons/hi';
import { certificateService } from '../services/certificateService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VerifyPage = () => {
  const { certificateId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verify();
  }, [certificateId]); // eslint-disable-line

  const verify = async () => {
    try {
      const data = await certificateService.verify(certificateId);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl text-center">
          {/* Logo */}
          <div className="inline-flex w-14 h-14 rounded-2xl gradient-primary items-center justify-center text-white font-bold text-xl shadow-glow mb-6">
            C
          </div>

          {result?.verified ? (
            <>
              {/* Success */}
              <div className="w-20 h-20 rounded-full bg-success-400/10 flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="w-12 h-12 text-success-400" />
              </div>

              <h1 className="text-2xl font-bold font-[Outfit] text-success-400 mb-2">
                Certificate Verified ✓
              </h1>
              <p className="text-surface-400 text-sm mb-6">
                This is an authentic certificate issued by CertForge.
              </p>

              <div className="space-y-3 text-left bg-surface-800/30 rounded-xl p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Certificate ID</span>
                  <span className="text-surface-200 font-mono text-xs">{result.certificate.certificateId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Template</span>
                  <span className="text-surface-200">{result.certificate.templateName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Issued</span>
                  <span className="text-surface-200">
                    {new Date(result.certificate.issuedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Recipient data */}
                <hr className="border-surface-700/50" />
                {Object.entries(result.certificate.recipientData || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-surface-400">{key}</span>
                    <span className="text-surface-200">{val}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Failure */}
              <div className="w-20 h-20 rounded-full bg-danger-400/10 flex items-center justify-center mx-auto mb-4">
                <HiXCircle className="w-12 h-12 text-danger-400" />
              </div>

              <h1 className="text-2xl font-bold font-[Outfit] text-danger-400 mb-2">
                Verification Failed
              </h1>
              <p className="text-surface-400 text-sm">
                {error || 'This certificate ID could not be verified.'}
              </p>
              <p className="text-surface-500 text-xs mt-4">
                Certificate ID: <span className="font-mono">{certificateId}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
