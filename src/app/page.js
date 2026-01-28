'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, ShieldCheck, TrendingUp, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import { getSiteContent } from "@/app/actions/content";
import { getRandomProducts } from "@/app/actions/product";

export default function Home() {
  const { t, language } = useLanguage();
  const [latestProducts, setLatestProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [heroContent, setHeroContent] = useState({
    title1: 'The heart of Saudi',
    highlight1: 'Manufacturing',
    title2: 'Connecting you to',
    highlight2: 'verified factories',
    description: 'Discover the power of local production. Connect directly with over 500+ verified Saudi factories and streamline your supply chain today.',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Browse Factories'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await getSiteContent('homepage_hero');
        if (content) setHeroContent(content);

        // Fetch two sets of products (simulating latest vs top selling)
        const latest = await getRandomProducts(8);
        if (Array.isArray(latest)) setLatestProducts(latest);

        const top = await getRandomProducts(8);
        if (Array.isArray(top)) setTopProducts(top);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const isArabic = language === 'ar';

  return (
    <div className={`flex flex-col min-h-screen font-sans text-gray-900 overflow-x-hidden ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center bg-surface-50 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-left"
          >
            <motion.span variants={itemVariants} className="inline-block px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              {t('hero_badge')}
            </motion.span>
            <motion.h1 variants={itemVariants} className={`text-5xl md:text-7xl font-bold text-primary-950 leading-tight mb-6 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
              {/* Use dynamic content for English, fallback/t() for Arabic if needed (or make CMS multilingual later) */}
              {isArabic ? t('hero_title_1') : heroContent.title1} <span className="text-primary-600">{isArabic ? t('hero_title_highlight') : heroContent.highlight1}</span> <br />
              {isArabic ? t('hero_title_2') : heroContent.title2} <span className="italic text-accent-600">{isArabic ? t('hero_title_highlight_2') : heroContent.highlight2}</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              {isArabic ? t('hero_desc') : heroContent.description}
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="group px-8 py-4 bg-primary-900 text-white rounded-full font-medium hover:bg-primary-800 transition-all shadow-lg hover:shadow-primary-900/30 flex items-center justify-center gap-2">
                {isArabic ? t('hero_cta_primary') : heroContent.ctaPrimary}
                <ArrowRight size={18} className={`transition-transform ${isArabic ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </Link>
              <Link href="/factories" className="px-8 py-4 bg-white text-primary-900 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center justify-center">
                {isArabic ? t('hero_cta_secondary') : heroContent.ctaSecondary}
              </Link>
            </motion.div>
          </motion.div>

          {/* Abstract Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-[600px] w-full hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-primary-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
              {/* Floating Cards simulating UI */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 right-10 bg-white/90 backdrop-blur rounded-lg p-6 shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-green-100 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="w-full h-2 bg-gray-100 rounded" />
                  <div className="w-5/6 h-2 bg-gray-100 rounded" />
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 right-10 w-64 bg-surface-50 p-4 rounded-lg shadow-2xl border border-white/20"
              >
                <div className="flex gap-3 items-center">
                  <div className="bg-accent-500 rounded-full p-2 text-white">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">{t('verification_status')}</p>
                    <p className="font-bold text-primary-900">{t('verified_factory')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: t('stat_factories'), value: "500+" },
              { label: t('stat_buyers'), value: "2,000+" },
              { label: t('stat_transactions'), value: "$4.5M+" },
              { label: t('stat_satisfaction'), value: "99%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className={`text-4xl font-bold text-primary-900 mb-2 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{stat.value}</h3>
                <p className="text-gray-500 uppercase tracking-wider text-xs font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel - The Latest */}
      <section className="bg-white">
        <ShowcaseCarousel
          title={isArabic ? "أحدث المنتجات" : "The latest."}
          subtitle={isArabic ? "ألق نظرة على ما هو جديد الآن." : "Take a look at what’s new, right now."}
          products={latestProducts}
          linkHref="/products"
          linkText={t('view_all_products')}
        />
      </section>

      {/* Value Proposition (How it Works) */}
      <section className="py-32 bg-surface-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className={`text-3xl md:text-5xl font-bold text-primary-950 mb-6 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('features_title')}</h2>
            <p className="text-gray-600">{t('features_desc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: t('feature_1_title'), desc: t('feature_1_desc') },
              { icon: TrendingUp, title: t('feature_2_title'), desc: t('feature_2_desc') },
              { icon: ShieldCheck, title: t('feature_3_title'), desc: t('feature_3_desc') },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="bg-surface-50 pb-16">
        <ShowcaseCarousel
          title={isArabic ? "الأكثر مبيعاً" : "Top-selling."}
          subtitle={isArabic ? "الخيار المفضل للمشترين هذا الأسبوع." : "Buyer favorites this week."}
          products={topProducts}
          linkHref="/products"
          linkText={t('view_all_products')}
        />
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 text-white ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('cta_title')}</h2>
          <p className="text-primary-100 max-w-xl mx-auto mb-10 text-lg">{t('cta_desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-10 py-4 bg-accent-600 text-white rounded-full font-bold shadow-lg hover:bg-accent-500 hover:scale-105 transition-all">
              {t('cta_btn_primary')}
            </Link>
            <Link href="/factories" className="px-10 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
              {t('cta_btn_secondary')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-950 text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className={`text-2xl font-bold ${isArabic ? 'font-arabic' : 'font-heading'}`}>Jisr</span>
              <p className="text-primary-400 text-sm mt-1">{t('rights_reserved')}</p>
            </div>
            <div className="flex gap-8 text-sm text-primary-300">
              <Link href="#" className="hover:text-white transition">{t('privacy')}</Link>
              <Link href="#" className="hover:text-white transition">{t('terms')}</Link>
              <Link href="#" className="hover:text-white transition">{t('support')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
