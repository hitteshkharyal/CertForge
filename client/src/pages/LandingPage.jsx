import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight, HiCloudUpload, HiCursorClick, HiTemplate,
  HiPencilAlt, HiDocumentDownload, HiQrcode, HiSparkles
} from 'react-icons/hi';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';

const features = [
  {
    icon: HiCloudUpload,
    title: 'Upload Any Template',
    desc: 'Upload your PNG, JPG, or PDF certificate design. Any layout, any style.',
    color: 'text-primary-400 bg-primary-500/10',
  },
  {
    icon: HiCursorClick,
    title: 'Drag & Drop Editor',
    desc: 'Place fields anywhere on your template. Full control over fonts, sizes, and colors.',
    color: 'text-accent-400 bg-accent-500/10',
  },
  {
    icon: HiTemplate,
    title: 'Unlimited Custom Fields',
    desc: 'Create any field you need — name, course, date, grade. No restrictions.',
    color: 'text-success-400 bg-success-400/10',
  },
  {
    icon: HiPencilAlt,
    title: 'Signature & Stamp',
    desc: 'Upload, resize, and position signature and seal images freely.',
    color: 'text-warning-400 bg-warning-400/10',
  },
  {
    icon: HiDocumentDownload,
    title: 'Bulk Generation',
    desc: 'Upload Excel data and generate hundreds of certificates in seconds.',
    color: 'text-primary-400 bg-primary-500/10',
  },
  {
    icon: HiQrcode,
    title: 'QR Verification',
    desc: 'Each certificate gets a unique ID and QR code for instant verification.',
    color: 'text-accent-400 bg-accent-500/10',
  },
];

const steps = [
  { num: '01', title: 'Upload Template', desc: 'Upload your certificate design image' },
  { num: '02', title: 'Define Fields', desc: 'Create and place custom fields on the template' },
  { num: '03', title: 'Enter Data', desc: 'Fill in manually or upload Excel/CSV' },
  { num: '04', title: 'Generate', desc: 'Download PDF certificates instantly' },
];

const LandingPage = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-8 animate-fade-in">
            <HiSparkles className="w-3.5 h-3.5" />
            No-Code Certificate Generator
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-[Outfit] leading-tight mb-6"
          >
            Generate
            <span className="gradient-text"> Professional Certificates </span>
            in Seconds
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-surface-300 max-w-2xl mx-auto mb-10"
          >
            <span className="font-semibold text-white block mb-2">No more editing the same certificate multiple times. Create once, use many times.</span>
            Upload your template, define custom fields, and generate hundreds of beautiful certificates instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="xl" icon={HiArrowRight}>
                    Go to Dashboard
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="xl" icon={HiArrowRight}>
                      Start Creating — It's Free
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="secondary" size="xl">
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-8 sm:gap-16 mt-16"
          >
            {[
              { value: '∞', label: 'Custom Fields' },
              { value: 'PDF', label: 'Export' },
              { value: 'QR', label: 'Verification' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-surface-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[Outfit] text-surface-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              A complete no-code solution for generating professional certificates at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 hover:bg-surface-800/50 transition-colors duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-surface-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-surface-700/50 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-[Outfit] text-surface-100 mb-4">
              How It Works
            </h2>
            <p className="text-surface-400">Four simple steps to professional certificates</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center group"
              >
                <div className="text-4xl font-extrabold gradient-text font-[Outfit] mb-3 group-hover:scale-110 transition-transform inline-block">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-surface-100 mb-2">{step.title}</h3>
                <p className="text-sm text-surface-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-12 relative overflow-hidden group">
            <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold font-[Outfit] text-surface-100 mb-4">
                Ready to Create?
              </h2>
              <p className="text-surface-400 mb-8 max-w-lg mx-auto">
                Start generating professional certificates in minutes. Upload your design, add fields, and go.
              </p>
              <Link to={user ? "/dashboard" : "/register"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Button size="xl" icon={HiArrowRight}>
                    {user ? "Go to Dashboard" : "Get Started for Free"}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
