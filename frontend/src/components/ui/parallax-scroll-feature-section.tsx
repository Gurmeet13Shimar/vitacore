'use client'

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from "lucide-react"

export interface FeatureSection {
  id: number | string;
  title: string;
  description: string;
  imageUrl: string;
  reverse: boolean;
}

export const ParallaxScrollFeatureSection = ({
  features
}: {
  features: FeatureSection[]
}) => {
  const [scrollContainer, setScrollContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setScrollContainer(document.querySelector('main'));
  }, []);

  if (!scrollContainer) {
    return <div className="min-h-[50vh]" />;
  }

  return (
    <ParallaxScrollFeatureSectionInner scrollContainer={scrollContainer} features={features} />
  );
};

const ParallaxScrollFeatureSectionInner = ({
  scrollContainer,
  features,
}: {
  scrollContainer: HTMLElement;
  features: FeatureSection[];
}) => {
  // Create refs and animations for each section
  const sectionRefs = features.map(() => useRef(null));
  const containerRefObject = React.useMemo(() => ({ current: scrollContainer }), [scrollContainer]);

  const scrollYProgress = features.map((_, index) => {
      return useScroll({
          container: containerRefObject,
          target: sectionRefs[index],
          offset: ["start end", "center center"]
      }).scrollYProgress;
  });

  // Create animations for each section
  const opacityContents = scrollYProgress.map(progress => 
      useTransform(progress, [0, 0.7], [0, 1])
  );
  
  const clipProgresses = scrollYProgress.map(progress => 
      useTransform(progress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
  );
  
  const translateContents = scrollYProgress.map(progress => 
      useTransform(progress, [0, 1], [-50, 0])
  );

  return (
    <div className="w-full relative z-10 bg-[#07071A] text-white">
      <div className='min-h-[25vh] py-8 w-full flex flex-col items-center justify-center relative z-20'>
        <h2 className='text-4xl md:text-6xl font-bold max-w-3xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400'>
          Core Optimization Pillars
        </h2>
        <p className='mt-4 flex items-center gap-2 text-sm text-neutral-400 uppercase tracking-widest'>
          Explore Features <ArrowDown size={16} />
        </p>
      </div>
      
      <div className="flex flex-col md:px-10 px-5 max-w-7xl mx-auto">
        {features.map((section, index) => (
          <div 
            key={section.id}
            ref={sectionRefs[index]} 
            className={`min-h-[45vh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-10 ${section.reverse ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Left text content: Translated as a cohesive unit */}
            <motion.div style={{ y: translateContents[index] }} className="flex-1">
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {section.title}
              </div>
              <p className="text-neutral-300 text-lg max-w-lg mt-6 leading-relaxed">
                {section.description}
              </p>
            </motion.div>
            
            {/* Right image: Animate clipPath and opacity */}
            <motion.div 
              style={{ 
                  opacity: opacityContents[index],
                  clipPath: clipProgresses[index],
              }}
              className="flex-1 relative w-full flex justify-center"
            >
              <img 
                  src={section.imageUrl} 
                  className="w-full max-w-md aspect-square object-cover rounded-2xl shadow-2xl shadow-indigo-500/20" 
                  alt={section.title}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
