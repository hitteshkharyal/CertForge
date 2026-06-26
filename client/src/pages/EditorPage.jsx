import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiSave, HiArrowRight, HiCloudUpload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useEditorStore from '../store/editorStore';
import { templateService } from '../services/templateService';
import CanvasEditor from '../components/editor/CanvasEditor';
import FieldToolbar from '../components/editor/FieldToolbar';
import PropertyPanel from '../components/editor/PropertyPanel';
import ImageOverlay from '../components/editor/ImageOverlay';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StepIndicator from '../components/ui/StepIndicator';

const EDITOR_STEPS = ['Upload Template', 'Add Fields', 'Style & Position', 'Signature/Stamp'];

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [canvasApi, setCanvasApi] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    templateId,
    templateName,
    templateImageUrl,
    fields,
    setTemplateId,
    setTemplateName,
    setTemplateImage,
    loadTemplate,
    reset,
  } = useEditorStore();

  // Load existing template if editing
  useEffect(() => {
    if (id) {
      loadExistingTemplate(id);
    } else {
      reset();
    }
    return () => {
      // Don't reset on unmount if we're navigating to generate page
    };
  }, [id]); // eslint-disable-line

  const loadExistingTemplate = async (templateId) => {
    try {
      const template = await templateService.getById(templateId);
      loadTemplate(template);
      setCurrentStep(template.fields?.length > 0 ? 2 : 1);
    } catch {
      toast.error('Failed to load template');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateUpload = async (file) => {
    const url = URL.createObjectURL(file);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setTemplateImage(url, img.width, img.height);
      setCurrentStep(1);
    };
    img.src = url;

    // If we have a template ID, upload to server
    if (!templateId) {
      try {
        const formData = new FormData();
        formData.append('template', file);
        formData.append('name', templateName || 'Untitled Template');
        const result = await templateService.create(formData);
        setTemplateId(result._id);
        toast.success('Template uploaded!');
      } catch {
        toast.error('Failed to upload template');
      }
    }
  };

  const handleSave = async () => {
    if (!templateId) {
      toast.error('Please upload a template first');
      return;
    }

    setSaving(true);
    try {
      const storeState = useEditorStore.getState();
      await templateService.update(templateId, {
        name: storeState.templateName,
        fields: storeState.fields,
        canvasJSON: canvasApi?.getCanvasJSON?.() || null,
        signaturePosition: storeState.signaturePosition,
        stampPosition: storeState.stampPosition,
        templateWidth: storeState.templateWidth,
        templateHeight: storeState.templateHeight,
        canvasWidth: storeState.canvasWidth,
        canvasHeight: storeState.canvasHeight,
      });
      useEditorStore.getState().setDirty(false);
      toast.success('Template saved!');
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleProceedToGenerate = () => {
    if (!templateId) {
      toast.error('Please upload and save template first');
      return;
    }
    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }
    navigate(`/generate/${templateId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-xl sm:text-2xl font-bold font-[Outfit] text-surface-100 bg-transparent border-none outline-none focus:text-primary-400 transition-colors"
              placeholder="Template Name"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleSave}
              loading={saving}
              icon={HiSave}
              disabled={!templateId}
            >
              Save
            </Button>
            <Button
              onClick={handleProceedToGenerate}
              icon={HiArrowRight}
              disabled={!templateId || fields.length === 0}
            >
              Generate Certificates
            </Button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator steps={EDITOR_STEPS} currentStep={currentStep} />
        </div>

        {/* Main editor layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full lg:w-72 space-y-6 order-2 lg:order-1">
            {/* Template upload (if no template yet) */}
            {!templateImageUrl && (
              <div className="glass rounded-2xl p-4">
                <FileUpload
                  id="template-upload"
                  onFileSelect={handleTemplateUpload}
                  label="Upload Certificate Template"
                  sublabel="PNG, JPG up to 10MB"
                />
              </div>
            )}

            {/* Fields panel */}
            <div className="glass rounded-2xl p-4">
              <FieldToolbar canvasApi={canvasApi} />
            </div>

            {/* Signature & Stamp */}
            <div className="glass rounded-2xl p-4">
              <ImageOverlay canvasApi={canvasApi} />
            </div>
          </div>

          {/* Canvas area */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="glass rounded-2xl p-4">
              {templateImageUrl ? (
                <CanvasEditor onCanvasReady={setCanvasApi} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-surface-400">
                  <HiCloudUpload className="w-20 h-20 mb-4 text-surface-600" />
                  <h3 className="text-lg font-semibold text-surface-300 mb-2">Upload Your Template</h3>
                  <p className="text-sm text-center max-w-md">
                    Start by uploading your certificate design. We support PNG, JPG, and WebP formats.
                  </p>
                  <div className="mt-6 w-full max-w-sm">
                    <FileUpload
                      id="canvas-template-upload"
                      onFileSelect={handleTemplateUpload}
                      label="Choose File"
                      sublabel="or drag and drop here"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar — Properties */}
          <div className="w-full lg:w-64 order-3">
            <div className="glass rounded-2xl p-4 sticky top-24">
              <PropertyPanel canvasApi={canvasApi} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
