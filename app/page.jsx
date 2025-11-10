// "use client"
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";
// import Image from "next/image";

// export default function Home() {

//   const { setTheme } = useTheme()

//   return (
//     <div className="flex">
//       <h2>Welcome
//         <Button>Subscribe</Button>
//       </h2>
//       <Button onClick={() => setTheme("dark")}>Dark Mode</Button>
//       <Button onClick={() => setTheme("light")}>Light Mode</Button>
//     </div>
//   )
// }



"use client"

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sparkles, Zap, MessageSquare, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { setTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = /** @type {any} */ ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  });

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const models = [
    { name: "GPT-4", icon: Cpu },
    { name: "Claude", icon: MessageSquare },
    { name: "Gemini", icon: Sparkles },
    { name: "Llama", icon: Zap },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#581c87_0%,#312e81_50%,#000000_100%)] dark:bg-black">
      {/* Animated background circles */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 dark:opacity-0"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 dark:opacity-0"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Theme toggle buttons - top right */}
      <div className="absolute top-6 right-6 flex gap-2 z-50">
        <Button
          onClick={() => setTheme("dark")}
          variant="outline"
          size="sm"
          className="bg-black/30 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-500/20"
        >
          Dark
        </Button>
        <Button
          onClick={() => setTheme("light")}
          variant="outline"
          size="sm"
          className="bg-white/10 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-500/20"
        >
          Light
        </Button>
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating icon */}
        <motion.div variants={floatingVariants} animate="animate">
          <Sparkles className="w-16 h-16 text-purple-400 mb-6" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-center mb-6 bg-linear-to-r from-purple-500 via-pink-500 to-indigo-300 bg-clip-text text-transparent"
        >
          AI Fusion Lab
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-purple-200 text-center mb-4 max-w-2xl"
        >
          Experience the Power of Multiple AI Models in One Place
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-purple-300/80 text-center mb-12 max-w-xl"
        >
          Chat with GPT-4, Claude, Gemini, and Llama seamlessly. Compare
          responses, unlock insights, and supercharge your productivity.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Button
            size="lg"
            className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl shadow-purple-500/50 transition-all duration-300"
          >
            Get Started Free
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Model cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-lg p-6 flex flex-col items-center gap-3 hover:bg-white/10 transition-all cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <model.icon className="w-8 h-8 text-purple-400" />
              <span className="text-purple-100 font-medium">{model.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature list */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap justify-center gap-6 text-purple-300/70 text-sm"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Smart Conversations</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Multi-Model Support</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}