import { motion } from 'framer-motion';

const DownloadSection = () => {
  return (
    <section className="py-24 px-4 bg-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-[#1A1A1A] rounded-[4rem] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border border-white/5"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Content */}
          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Download the <br className="hidden md:block" /> app now
            </h2>
            <p className="text-2xl text-white font-semibold mb-2">
              The India's #1 AI discovery app
            </p>
            <p className="text-soft-grey text-lg mb-12 max-w-sm">
              Craly brings more than 1000 AI tools and 100+ ready-to-use workflows
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=com.signumcode.craly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105 active:scale-95 drop-shadow-2xl"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-16"
              />
            </a>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center md:justify-end relative mr-[-40px] mb-[-80px] md:mb-[-120px]">
            <motion.div
              className="relative w-80 h-80 md:w-[500px] md:h-[500px]"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/assets/surprise_avtar.png"
                alt="3D Character"
                className="w-full h-full object-contain relative z-10"
              />
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-full h-[30%] bg-blue-500/20 blur-[100px] rounded-full -z-10" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadSection;


