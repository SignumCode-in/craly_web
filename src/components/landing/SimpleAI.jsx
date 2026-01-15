import { motion } from 'framer-motion';

const SimpleAI = () => {
    const features = [
        { title: 'Trending AI Tools', icon: '🔥', color: 'bg-white' },
        { title: 'All in 1 Directory', icon: '📁', color: 'bg-white' },
        { title: 'News AI Launcher', icon: '🚀', color: 'bg-white' },
        { title: 'Minimal Clean UI', icon: '✨', color: 'bg-white' },
        { title: '1-Tap Try Now', icon: '☝️', color: 'bg-white' },
        { title: 'Step-by-Step Play', icon: '🔄', color: 'bg-white' },
    ];

    return (
        <section className="py-24 bg-[#2176FF] relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none">
                    <path d="M-100,200 Q400,100 800,400 T1600,200" stroke="white" strokeWidth="2" />
                    <path d="M-100,300 Q500,200 900,500 T1700,300" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                <motion.h2
                    className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    Craly makes AI simple
                </motion.h2>

                <motion.p
                    className="text-white/80 text-xl mb-20 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Designed for students learning smarter, creators building content faster,
                    and entrepreneurs launching projects and startups with confidence.
                </motion.p>

                <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
                    {/* Left Feature Cards */}
                    <div className="flex flex-col gap-8 w-full md:w-auto">
                        {features.slice(0, 3).map((f, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-black shadow-2xl w-full md:w-40 h-40 hover:scale-105 transition-transform cursor-pointer"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <span className="text-4xl">{f.icon}</span>
                                <span className="font-bold text-sm text-center leading-tight">{f.title}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Phone Mockup */}
                    <motion.div
                        className="relative w-[300px] md:w-[350px] group"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-black rounded-[3.5rem] p-3 shadow-2xl border-[8px] border-white/10 ring-1 ring-white/20">
                            <div className="aspect-[9/19.5] bg-[#0F0F0F] rounded-[3rem] overflow-hidden relative">
                                <img
                                    src="/assets/app-preview.jpg"
                                    alt="App Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-blue-300 blur-[100px] opacity-30 -z-10" />
                    </motion.div>

                    {/* Right Feature Cards */}
                    <div className="flex flex-col gap-8 w-full md:w-auto">
                        {features.slice(3, 6).map((f, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-black shadow-2xl w-full md:w-40 h-40 hover:scale-105 transition-transform cursor-pointer"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <span className="text-4xl">{f.icon}</span>
                                <span className="font-bold text-sm text-center leading-tight">{f.title}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SimpleAI;
