import { motion } from 'framer-motion';
import Logo from '../Logo';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 relative overflow-hidden bg-black">
      {/* Background patterns */}
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 scale-110"
          style={{ filter: 'grayscale(0.5) brightness(0.6)' }}
        >
          <source
            src="https://v1.pinimg.com/videos/mc/expMp4/47/45/ed/4745ed0eec38a43cea86f373a08d179e_t1.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <Logo className="w-16 h-16" />
            <span className="text-5xl font-semibold tracking-tight">Craly</span>
          </div>

          <motion.h1
            className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The India's #1 AI <br /> discovery app
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-soft-grey mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Craly brings more than 1000 AI tools and <br className="hidden md:block" /> 100+ ready-to-use workflows
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="https://play.google.com/store/apps/details?id=com.signumcode.craly"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-14"
              />
            </a>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-blue-500 text-sm font-semibold flex flex-col items-center gap-1 cursor-pointer mt-12 group"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="group-hover:text-blue-400 transition-colors">Scroll down</span>
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="opacity-80"
              >
                <path d="M7 13l5 5 5-5m-10-7l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


