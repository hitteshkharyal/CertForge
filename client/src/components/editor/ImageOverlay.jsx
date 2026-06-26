import { HiPencilAlt, HiShieldCheck } from 'react-icons/hi';
import useEditorStore from '../../store/editorStore';
import FileUpload from '../ui/FileUpload';
import { templateService } from '../../services/templateService';
import toast from 'react-hot-toast';

const ImageOverlay = ({ canvasApi }) => {
  const {
    templateId,
    signatureImageUrl,
    stampImageUrl,
    signaturePosition,
    stampPosition,
    setSignatureImage,
    setStampImage,
    updateSignaturePosition,
    updateStampPosition,
  } = useEditorStore();

  const handleSignatureUpload = async (file) => {
    if (!templateId) {
      // Preview mode — use object URL
      const url = URL.createObjectURL(file);
      setSignatureImage(url);
      if (canvasApi?.addImageOverlay) {
        canvasApi.addImageOverlay(url, signaturePosition, 'signature');
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append('signature', file);
      const result = await templateService.uploadSignature(templateId, formData);
      setSignatureImage(result.signatureImageUrl);
      if (canvasApi?.addImageOverlay) {
        canvasApi.addImageOverlay(result.signatureImageUrl, signaturePosition, 'signature');
      }
      toast.success('Signature uploaded!');
    } catch {
      toast.error('Failed to upload signature');
    }
  };

  const handleStampUpload = async (file) => {
    if (!templateId) {
      const url = URL.createObjectURL(file);
      setStampImage(url);
      if (canvasApi?.addImageOverlay) {
        canvasApi.addImageOverlay(url, stampPosition, 'stamp');
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append('stamp', file);
      const result = await templateService.uploadStamp(templateId, formData);
      setStampImage(result.stampImageUrl);
      if (canvasApi?.addImageOverlay) {
        canvasApi.addImageOverlay(result.stampImageUrl, stampPosition, 'stamp');
      }
      toast.success('Stamp uploaded!');
    } catch {
      toast.error('Failed to upload stamp');
    }
  };

  return (
    <div className="space-y-4">
      {/* Signature */}
      <div>
        <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-2 mb-2">
          <HiPencilAlt className="w-3.5 h-3.5 text-success-400" />
          Signature
        </h4>
        {signatureImageUrl ? (
          <div className="relative group">
            <img
              src={signatureImageUrl}
              alt="Signature"
              className="w-full h-20 object-contain rounded-lg bg-white/5 border border-surface-700/50 p-2"
            />
            <button
              onClick={() => {
                setSignatureImage(null);
                if (canvasApi?.fabricRef?.current) {
                  const obj = canvasApi.fabricRef.current.getObjects().find(o => o.overlayType === 'signature');
                  if (obj) {
                    canvasApi.fabricRef.current.remove(obj);
                    canvasApi.fabricRef.current.renderAll();
                  }
                }
              }}
              className="absolute top-1 right-1 px-2 py-0.5 rounded text-xs bg-danger-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <FileUpload
            id="signature-upload"
            onFileSelect={handleSignatureUpload}
            label="Upload Signature"
            sublabel="PNG with transparent background works best"
            className="min-h-[80px]"
          />
        )}
      </div>

      {/* Stamp */}
      <div>
        <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-2 mb-2">
          <HiShieldCheck className="w-3.5 h-3.5 text-warning-400" />
          Stamp / Seal
        </h4>
        {stampImageUrl ? (
          <div className="relative group">
            <img
              src={stampImageUrl}
              alt="Stamp"
              className="w-full h-20 object-contain rounded-lg bg-white/5 border border-surface-700/50 p-2"
            />
            <button
              onClick={() => {
                setStampImage(null);
                if (canvasApi?.fabricRef?.current) {
                  const obj = canvasApi.fabricRef.current.getObjects().find(o => o.overlayType === 'stamp');
                  if (obj) {
                    canvasApi.fabricRef.current.remove(obj);
                    canvasApi.fabricRef.current.renderAll();
                  }
                }
              }}
              className="absolute top-1 right-1 px-2 py-0.5 rounded text-xs bg-danger-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <FileUpload
            id="stamp-upload"
            onFileSelect={handleStampUpload}
            label="Upload Stamp/Seal"
            sublabel="PNG with transparent background"
            className="min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
};

export default ImageOverlay;
