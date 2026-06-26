import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiPlus, HiTrash, HiPencil, HiTemplate, HiDocumentText } from 'react-icons/hi';
import { templateService } from '../services/templateService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await templateService.getAll();
      setTemplates(data);
    } catch {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this template?')) return;
    try {
      await templateService.delete(id);
      setTemplates(prev => prev.filter(t => t._id !== id));
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-surface-100">Dashboard</h1>
            <p className="text-surface-400 mt-1">Manage your certificate templates</p>
          </div>
          <Link to="/editor">
            <Button icon={HiPlus}>New Template</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: HiTemplate, label: 'Templates', value: templates.length, color: 'text-primary-400 bg-primary-500/10' },
            { icon: HiDocumentText, label: 'Total Fields', value: templates.reduce((acc, t) => acc + (t.fields?.length || 0), 0), color: 'text-accent-400 bg-accent-500/10' },
            { icon: HiDocumentText, label: 'Ready', value: templates.filter(t => t.fields?.length > 0).length, color: 'text-success-400 bg-success-400/10' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-surface-100">{stat.value}</div>
                <div className="text-xs text-surface-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <HiTemplate className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-2">No Templates Yet</h3>
            <p className="text-sm text-surface-400 mb-6">
              Create your first certificate template to get started.
            </p>
            <Link to="/editor">
              <Button icon={HiPlus}>Create Template</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New template card */}
            <Link
              to="/editor"
              className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-surface-600 hover:border-primary-500/50 hover:bg-surface-800/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HiPlus className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-sm font-medium text-surface-300 mt-3">New Template</span>
            </Link>

            {/* Template cards */}
            {templates.map((template) => (
              <div
                key={template._id}
                className="glass rounded-2xl overflow-hidden hover:shadow-glow transition-all cursor-pointer group"
                onClick={() => navigate(`/editor/${template._id}`)}
              >
                {/* Preview image */}
                <div className="h-36 overflow-hidden bg-surface-800/50">
                  <img
                    src={template.templateImageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-surface-100 truncate">{template.name}</h3>
                  <p className="text-xs text-surface-400 mt-1">
                    {template.fields?.length || 0} fields · {new Date(template.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      to={`/generate/${template._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1"
                    >
                      <Button variant="secondary" size="sm" className="w-full">
                        Generate
                      </Button>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(template._id, e)}
                      className="p-2 rounded-lg text-surface-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all cursor-pointer"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
