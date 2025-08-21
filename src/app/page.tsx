"use client";

import {
  Briefcase,
  FlaskConical,
  CalendarDays,
  MapPin,
  Menu,
  Sun,
  Moon,
  GraduationCap,
  Film,
  Brain,
  Camera,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { ReactTyped } from "react-typed";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import CanvasHero from "@/components/CanvasHero";
import FancyName from "@/components/FancyName";
import StartOverlay from "@/components/StartOverlay";
import CodeGremlin from "@/components/CodeGremlin";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  // navbar draw-in
  const navVariants: Variants = {
    hidden: { opacity: 0, y: -18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", delay: 0.05, staggerChildren: 0.08 },
    },
  };
  const navItem: Variants = {
    hidden: { opacity: 0, y: -8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
  };

  // nav shadow when scrolled
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // theme (light/dark) toggle
  type Mode = "light" | "dark";
  const [theme, setTheme] = useState<Mode>("dark");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as
      | Mode
      | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Mode = saved ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);
  const toggleTheme = () => {
    const next: Mode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // ✅ Start overlay: once per session
  const [showIntro, setShowIntro] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      sessionStorage.getItem("introSeen") === "1";
    setShowIntro(!seen);
    if (seen) setIntroDone(true); // if we've seen it already, animate hero immediately
  }, []);

  useEffect(() => {
    if (showIntro) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prev;
      };
    }
  }, [showIntro]);

  // ---- hero animation variants ----
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };
  const fromLeft: Variants = {
    hidden: { x: -24, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 420, damping: 28 },
    },
  };
  const fromRight: Variants = {
    hidden: { x: 24, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 420, damping: 28 },
    },
  };
  const fromUp: Variants = {
    hidden: { y: -22, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 420, damping: 28 },
    },
  };
  const fromDown: Variants = {
    hidden: { y: 22, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 420, damping: 28 },
    },
  };

  // --- Work (Projects/Skills) state ---
  const [workTab, setWorkTab] = useState<"projects" | "skills">("projects");
  const [showAllProjects, setShowAllProjects] = useState(false);

  // --- Skills you listed (deduped) ---
  const skills: string[] = [
    // Frontend
    "React", "Next.js", "JavaScript", "TypeScript", "Vue.js", "HTML", "CSS", "Bootstrap",
    // Backend / Platforms
    "Node.js", "Java (Spring Boot)", "Python (Django)", "FastAPI", "PHP", "C++",
    // DB
    "MySQL", "PostgreSQL", "Oracle SQL", "SQLite", "Firebase",
    // Mobile
    "Flutter", "Dart",
    // ML / Data / Tools
    "Python", "R", "MATLAB", "JIRA",
  ];

  // Simple brand icon set (inline SVG). Unknown names get a generic icon.
  const SkillIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const n = name.toLowerCase();

    // helper
    const svg = (d: React.ReactNode) => (
      <svg viewBox="0 0 48 48" className={className ?? "h-10 w-10"} fill="none" stroke="currentColor" strokeWidth="2">
        {d}
      </svg>
    );

    if (n.includes("react")) {
      return svg(
        <>
          <circle cx="24" cy="24" r="3" fill="currentColor" />
          <ellipse cx="24" cy="24" rx="18" ry="7" />
          <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)" />
          <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)" />
        </>
      );
    }
    if (n.includes("next")) {
      return svg(
        <>
          <circle cx="24" cy="24" r="19" />
          <path d="M17 16h7m-7 8h10M28 16l10 16" />
        </>
      );
    }
    if (n.includes("typescript")) {
      return svg(<rect x="9" y="12" width="30" height="24" rx="3" className="fill-current" />);
    }
    if (n.includes("node")) {
      return svg(<path d="M24 6l14 8v20l-14 8-14-8V14l14-8Z" />);
    }
    if (n.includes("java") && !n.includes("javascript")) {
      return svg(<path d="M24 10c6 6-8 8 0 14-10 3 8 5-6 9m-5 5h22M14 33c3 2 17 2 20 0" />);
    }
    if (n === "python" || n.includes("python (django)")) {
      return svg(<path d="M30 10h-8a6 6 0 0 0-6 6v4h10m-8 18h8a6 6 0 0 0 6-6v-4H22" />);
    }
    if (n.includes("django")) {
      return svg(<path d="M16 36V12h8a6 6 0 0 1 0 12h-6M32 36V24" />);
    }
    if (n.includes("spring")) {
      return svg(<path d="M10 28c4 10 24 12 28-3-2-9-12-13-18-8l-6 11Z" />);
    }
    if (n.includes("fastapi")) {
      return svg(<path d="M24 6l12 21H12L24 6Zm0 36v-7" />);
    }
    if (n.includes("java") && n.includes("script")) {
      return svg(<path d="M10 10h28v28H10zM18 18v12m12-8v8" />);
    }
    if (n.includes("vue")) {
      return svg(<path d="M6 10h12l6 10 6-10h12L24 42 6 10Z" />);
    }
    if (n === "html") {
      return svg(<path d="M10 6h28l-3 30-11 4-11-4-3-30Z" />);
    }
    if (n === "css") {
      return svg(<path d="M10 6h28l-3 30-11 4-11-4 1-10h10" />);
    }
    if (n.includes("bootstrap")) {
      return svg(<path d="M12 8h24v32H12zM18 18h8a4 4 0 0 1 0 8h-8V18Zm0 0v-4h9a4 4 0 0 1 0 8" />);
    }
    if (n.includes("mysql")) {
      return svg(<path d="M10 30c7-18 21-18 28 0" />);
    }
    if (n.includes("postgres")) {
      return svg(<path d="M12 30c2-10 24-10 24 0M18 26v10m12-10v10" />);
    }
    if (n.includes("oracle")) {
      return svg(<path d="M10 26h28M16 18h16" />);
    }
    if (n.includes("sqlite")) {
      return svg(<path d="M12 10h20l4 4v24H12V10Z" />);
    }
    if (n.includes("firebase")) {
      return svg(<path d="M12 36l8-22 6 10 6-14 4 26-24 0Z" />);
    }
    if (n.includes("flutter")) {
      return svg(<path d="M12 28l16-16 6 6-16 16m-6 6 10-10" />);
    }
    if (n.includes("dart")) {
      return svg(<path d="M12 22l10-10 14 6v18l-10 10-14-6V22Z" />);
    }
    if (n.includes("c++")) {
      return svg(<path d="M24 6l14 8v20l-14 8-14-8V14l14-8Zm0 14v8m-4-4h8" />);
    }
    if (n.includes("php")) {
      return svg(<path d="M10 24h10v10H18V28m4-4h6a6 6 0 1 1 0 12h-2v-8" />);
    }
    if (n === "r") {
      return svg(<path d="M10 28c0-8 12-12 22-10 10 2 8 8 2 10-4 1-8 4-8 6m0-6h8" />);
    }
    if (n.includes("matlab")) {
      return svg(<path d="M8 34l8-16 8 12 8-6 8 10H8Z" />);
    }
    if (n.includes("jira")) {
      return svg(<path d="M12 24l12-12 12 12-12 12-12-12Z" />);
    }

    // fallback generic
    return svg(<path d="M10 10h28v28H10z" />);
  };

  // projects
  const projects = [
    {
      title: "Email AI Auto-Reply",
      desc: "AI-powered Gmail auto-responder with Telegram approval workflow.",
      tech: ["n8n", "Gmail", "OpenAI", "Telegram"],
      image: "/n8n.png",
      link: "https://github.com/Azzkaa/email-ai-auto-reply-n8n",
    },

    {
      title: "Student Portal (SKSU)",
      desc: "Portal features for students: auth, workflows, data.",
      tech: ["Java", "Spring", "SQL"],
      image: "/SKSU.png",
      link: "https://github.com/Azzkaa/Application-Development-SKSU-Student-Portal",
    },
    {
      title: "Fault Detection for Substations",
      desc: "Classifies RMU/VCB thermal images, segments with SAM, and flags hotspots (ΔT).",
      tech: ["Python", "TensorFlow", "OpenCV", "PyTorch", "SAM", "MobileNetV2"],
      image: "/fyp22.png",
      link: "https://github.com/Azzkaa/FYP2",
    },
    {
      title: "Penguin Clustering & Analysis",
      desc: "Unsupervised clustering + EDA.",
      tech: ["Python", "ML"],
      image: "/projects/penguins.png",
      link: "https://github.com/Azzkaa/Penguin-Species-Clustering-and-Analysis-System",
    },

    {
      title: "SP Course Assignment Tracking System",
      desc: "Web app to track assignments & student progress.",
      tech: ["Java", "Spring", "MySQL"],
      image: "/projects/sp.png",
      link: "https://github.com/Azzkaa/SP-Course-Assignment-Tracking-System",
    },

    {
      title: "Vue Task Manager",
      desc: "Lightweight task manager with reusable components.",
      tech: ["Vue.js", "JavaScript", "CSS"],
      image: "/projects/vue-taskmanager.png",
      link: "https://github.com/Azzkaa/VueTask-Manager",
    },
    {
      title: "Property App Backend",
      desc: "REST APIs and services for a property app.",
      tech: ["Node", "Express", "DB"],
      image: "/projects/property-api.png",
      link: "https://github.com/saislamb97/highball-property-backend",
    },
    {
      title: "Handwritten Digit Recognition",
      desc: "ML pipeline for digit classification.",
      tech: ["Python", "ML"],
      image: "/projects/hands.png",
      link: "https://github.com/Azzkaa/Handwritten-Digit-Recognition-System",
    },
  ];

  const experience = [
    {
      company: "Fireworks Solutions Sdn Bhd",
      role: "Project Management Intern",
      period: "Aug 2024 — Feb 2025",
      location: "Selangor, MY",
      color: "pink",
      bullets: [
        "Collaborated with dev team across front-end and back-end tasks.",
        "Coordinated features, timelines, and stakeholder updates.",
        "Helped QA small features and wrote basic implementation notes.",
      ],
      icon: Briefcase,
    },
    {
      company: "Universiti Teknologi Malaysia (UTM)",
      role: "Student Research Assistant",
      period: "Feb 2025 — Jul 2025",
      location: "Kuala Lampur, MY",
      color: "rose",
      bullets: [
        "Researched thermal data analysis for fault detection.",
        "Prepared datasets, ran experiments, and tracked results.",
        "Supported technical writing for thesis/report sections.",
      ],
      icon: FlaskConical,
    },
  ];

  // map old color ids to brand/cyan styles
  const colorClasses: Record<
    "pink" | "rose",
    { dot: string; ring: string; badge: string }
  > = {
    pink: {
      dot: "bg-[var(--brand-600)]",
      ring: "ring-[color:var(--brand-600)]",
      badge:
        "border border-[color:var(--brand-600)] text-[var(--brand-600)] bg-transparent",
    },
    rose: {
      dot: "bg-[var(--brand)]",
      ring: "ring-[color:var(--brand)]",
      badge:
        "border border-[color:var(--brand)] text-[var(--brand)] bg-transparent",
    },
  };

  return (
    <main className="min-h-screen">
      {/* ✅ Start overlay */}
      {showIntro && (
        <StartOverlay
          onFinish={() => {
            sessionStorage.setItem("introSeen", "1"); // don't show again this session
            setShowIntro(false);
            setIntroDone(true); // kick off hero animation
          }}
        />
      )}

      {/* scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 h-1 w-full origin-left bg-[var(--brand)] z-50"
      />

      {/* navbar */}
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate={introDone ? "show" : "hidden"}
        className={
          "sticky top-0 z-40 transition " +
          (scrolled
            ? "backdrop-blur bg-[color:rgba(14,23,42,0.5)] border-b border-[color:var(--brand-600)]/20 shadow-sm"
            : "bg-transparent")
        }
      >
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <motion.a
            variants={navItem}
            href="#hero"
            className="font-semibold relative px-3 py-2 text-[var(--text)]/80 transition-colors duration-200 hover:text-[var(--brand)] 
             after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--brand)]
             after:transition-all after:duration-300 hover:after:w-full"
          >
            Azka Aftab
          </motion.a>

          {/* Right: links + theme toggle grouped together */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              {[
                ["#about", "About"],
                ["#projects", "Projects"],
                ["#experience", "Experience"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <motion.a
                  variants={navItem}
                  key={label}
                  href={href}
                  className="relative px-3 py-2 text-[var(--text)]/70 transition-colors duration-200 hover:text-[var(--brand)]
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--brand)]
                  after:transition-all after:duration-300 hover:after:w-full"
                >
                  {label}
                </motion.a>
              ))}

              {/* theme toggle sits right after Contact */}
              <motion.button
                variants={navItem}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                className="ml-2 p-2 rounded-xl border text-[var(--text)]/80 hover:text-[var(--brand)] transition-colors"
                style={{
                  borderColor:
                    "color-mix(in oklab, var(--brand-600) 40%, transparent)",
                  background:
                    "color-mix(in oklab, var(--brand-600) 6%, transparent)",
                }}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
            </div>
          </div>

          <button
            className="sm:hidden p-2 rounded-xl border text-[var(--text)]/80"
            style={{
              borderColor:
                "color-mix(in oklab, var(--brand-600) 40%, transparent)",
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      </motion.nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative z-0 min-h-[92vh] flex items-center overflow-visible"
      >
        {/* floating canvas on the right */}
        <CanvasHero
          className="pointer-events-none absolute right-5 top-16 w-[48vw] max-w-[760px] aspect-[4/3] opacity-90 -z-10"
          blend={theme === "light" ? "normal" : "screen"}
          delayMs={introDone ? 700 : 700}
          visible={introDone}
          style={{
            WebkitMaskImage:
              "radial-gradient(60% 60% at 70% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            maskImage:
              "radial-gradient(60% 60% at 70% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* content (staggered when introDone) */}
        <motion.div
          className="relative mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 md:gap-10"
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          variants={heroContainer}
        >
          <div className="space-y-6">
            {/* headline: smaller & forced to one line on md+ */}
            <motion.h1
              variants={fromLeft}
              className="font-[var(--font-display)] leading-[1] font-extrabold text-[clamp(2rem,4.6vw,3.6rem)] md:whitespace-nowrap"
            >
              Helo, <FancyName text="Azka" />{" "}
              <span className="text-[var(--text)]/85">here.</span>
            </motion.h1>

            <motion.p
              variants={fromUp}
              className="text-xl md:text-2xl text-[var(--muted)] max-w-[48ch]"
            >
              <span className="font-medium">ideas → pixels → happy users.</span>{" "}
              I&apos;m Azka, your friendly{" "}
              <span className="relative inline-flex items-center gap-2 align-middle">
                <span className="font-mono rounded-md px-1.5 py-0.5 bg-[color:rgba(34,211,238,0.15)] text-[var(--brand)]">
                  code gremlin
                </span>
                <CodeGremlin
                  className="h-9 w-9 md:h-10 md:w-10"
                  delay={introDone ? 1.6 : 1.6}
                />
              </span>
            </motion.p>

            <motion.p variants={fromRight} className="text-lg md:text-xl leading-8">
              <ReactTyped
                strings={[
                  "Software Engineer",
                  "Full-Stack (Java/Spring, Python/Django)",
                  "Mobile Dev (Flutter)",
                  "AI/ML Enthusiast",
                ]}
                typeSpeed={52}
                backSpeed={26}
                backDelay={1100}
                loop
                showCursor
                cursorChar="|"
              />
            </motion.p>

            <motion.div variants={fromDown} className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="
    px-5 py-3 rounded-2xl border border-transparent
    bg-[var(--brand)] text-black
    transition-colors
    hover:bg-[var(--btn-filled-hover)]   /* ← flip bg to gray */
    hover:!text-[var(--brand)]           /* ← keep your teal text on hover */
  "
              >
                Projects
              </a>

              <a
                href="#contact"
                className="px-5 py-3 rounded-2xl border border-[color:var(--brand-600)] text-[var(--text)]"
              >
                Contact
              </a>
              <a
                href="/Resume.pdf"
                target="_blank"
                className="px-5 py-3 rounded-2xl border border-[color:var(--brand-600)] text-[var(--text)]"
              >
                Resume
              </a>
            </motion.div>

            <motion.div variants={fromRight} className="font-mono text-sm text-[var(--muted)]">
              $ <span className="text-[var(--brand)]">npm run</span> build && ship
            </motion.div>
          </div>

          {/* spacer column so text doesn't collide with canvas */}
          <div className="hidden md:block" />
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          {/* Section heading + intro */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6"
          >
            About me
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-lg leading-relaxed text-[var(--muted)] max-w-3xl"
          >
            I design and build {" "}
            <span className="px-2 py-0.5 rounded-md bg-[color:rgba(34,211,238,0.12)] text-[var(--brand)]">
              software
            </span>
            once in a while. I care about making things that feel fast, accessible, and enjoyable—turning ideas into experiences people actually like to use :p
          </motion.p>

          {/* Content grid (text + photo) */}
          <div className="mt-10 grid md:grid-cols-2 gap-10 items-start">
            {/* Left column: cards + chips */}
            <div className="space-y-6">
              {/* Who am I */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-[color:#1f2937] bg-[var(--panel)] p-5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Brain size={16} /> Who am I
                </div>
                <p className="text-[var(--muted)] text-sm leading-6">
                  I enjoy shaping experiences end-to-end—from user flows and
                  prototypes to production code and polish. Currently
                  wrapping up at{" "}
                  <span className="text-[var(--brand)]">
                    Universiti Teknologi Malaysia
                  </span>{" "}
                  (CGPA 3.89).
                </p>
              </motion.div>

              {/* My approach */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="rounded-2xl border border-[color:#1f2937] bg-[var(--panel)] p-5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Dumbbell size={16} /> My approach
                </div>
                <p className="text-[var(--muted)] text-sm leading-6">
                  Design with intent → validate fast → iterate. Type-safe,
                  readable code; thoughtful states and loading skeletons.
                  Documentation that future-you will actually thank you for.
                </p>
              </motion.div>

              {/* Quick facts — interactive icon boxes */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold mb-3 text-[var(--text)]/80">
                  Quick facts
                </h3>

                {(() => {
                  const facts: { icon: LucideIcon; label: string }[] = [
                    { icon: GraduationCap, label: "UTM — Software Engineering (CGPA 3.89)" },
                    { icon: Film, label: "Favorite film: Tangled" },
                    { icon: Brain, label: "Inspo: Cleo Abram" },
                    { icon: Dumbbell, label: "Sports: keeps me balanced" },
                    { icon: Camera, label: "Photography: composition & light nerd" },
                  ];

                  return (
                    <div className="flex flex-wrap gap-3">
                      {facts.map(({ icon: Icon, label }, i) => (
                        <motion.button
                          key={i}
                          type="button"
                          layout
                          whileHover={{ scale: 1.045 }}
                          whileTap={{ scale: 0.98 }}
                          className="
              group inline-flex items-center rounded-2xl
              border border-[color:var(--brand-600)]/45
              bg-[color:rgba(255,255,255,0.03)]
              backdrop-blur px-3 py-2 pr-2
              text-[var(--text)]/85
              shadow-[0_0_0_0_rgba(0,0,0,0)]
              hover:shadow-[0_8px_18px_-8px_rgba(0,0,0,0.35)]
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40
            "
                          aria-label={label}
                        >
                          <span
                            className="
                grid place-items-center h-8 w-8 rounded-xl
                border border-[color:var(--brand-600)]/45
                bg-[var(--panel)]
                text-[var(--brand)]
                shadow-inner
              "
                          >
                            <Icon size={16} />
                          </span>

                          <span
                            className="
                overflow-hidden
                ml-2
                max-w-full opacity-100
                sm:max-w-0 sm:opacity-0 sm:ml-0
                group-hover:sm:max-w-[260px]
                group-hover:sm:opacity-100
                group-hover:sm:ml-2
                transition-all duration-300 whitespace-nowrap
                font-mono text-xs
              "
                          >
                            {label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            </div>

            {/* Right column: photo (square + smaller) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex justify-center md:justify-center"
            >
              <div className="relative w-full max-w-[280px] md:max-w-[300px]">
                <Image
                  src="/me1.jpg"
                  alt="Azka Aftab"
                  width={600}
                  height={600}
                  priority
                  className="w-full aspect-square object-cover rounded-2xl border border-[color:#1f2937] shadow-xl
             transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WORK — Projects + Skills */}
      <section id="projects" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center"
          >
            Work
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-2 text-center text-sm text-[var(--muted)]"
          >
            A few things I&apos;ve built — functional, neat, and user-friendly.
          </motion.p>

          {/* Tabs (underline highlight, not pills) */}
          <div className="mt-6 flex items-center justify-center gap-10 text-[15px]">
            {(["projects", "skills"] as const).map((t) => {
              const active = workTab === t;
              return (
                <button
                  key={t}
                  onClick={() => setWorkTab(t)}
                  className={
                    "relative pb-1 px-1 transition-colors " +
                    (active
                      ? "text-[var(--brand)]"
                      : "text-[var(--text)]/70 hover:text-[var(--brand)]/90")
                  }
                >
                  {t[0].toUpperCase() + t.slice(1)}
                  <span
                    className={
                      "absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[var(--brand)] transition-all duration-300 " +
                      (active ? "w-14" : "w-0")
                    }
                  />
                </button>
              );
            })}
          </div>

          {/* Projects grid */}
          {workTab === "projects" && (
            <>
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(showAllProjects ? projects : projects.slice(0, 6)).map((p, i) => (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group rounded-2xl border border-[color:#1f2937] bg-[var(--panel)] hover:bg-[color:rgba(255,255,255,0.03)] shadow-md hover:shadow-xl transition"
                  >
                    {/* image */}
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={640}
                        height={400}
                        className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition"
                      />
                    </div>

                    {/* body */}
                    <div className="p-5">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm mt-2 opacity-80 text-[var(--muted)]">{p.desc}</p>

                      {/* tech tags (square, not rounded pills) */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.tech.map((t: string) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium
                                 rounded-[6px] border border-[color:var(--brand-600)]/60
                                 text-[var(--brand-600)] bg-[color:rgba(34,211,238,0.06)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* actions */}
                      <div className="mt-5">
                        <a
                          href={p.link}
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm
                               bg-[var(--brand)] text-black border-transparent transition-colors
                               hover:bg-[var(--btn-filled-hover)] hover:!text-[var(--brand)]"
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Show more / less */}
              {projects.length > 6 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllProjects((s) => !s)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                         border border-[color:var(--brand-600)]/40 text-[var(--text)]/80
                         hover:text-[var(--brand)] hover:border-[color:var(--brand)]
                         transition-colors"
                  >
                    {showAllProjects ? "Show less" : `Show ${projects.length - 6} more`}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Skills grid */}
          {workTab === "skills" && (
            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  whileHover={{ scale: 1.06 }}
                  className="flex flex-col items-center justify-center h-40 rounded-2xl
                       border border-[color:#1f2937] bg-[var(--panel)]
                       shadow-sm hover:shadow-xl transition"
                >
                  <div
                    className="text-[var(--brand)]"
                    style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--brand) 45%, transparent))" }}
                  >
                    <SkillIcon name={s} />
                  </div>
                  <div className="mt-3 text-sm text-[var(--text)]/90">{s}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCE — vertical timeline */}
      <section id="experience" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            Experience
          </motion.h2>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-4 top-0 h-full w-px bg-[color:#1f2937] md:left-5" />

            <ul className="space-y-8 overflow-visible">
              {experience.map((item, i) => {
                const Icon = item.icon;
                const c = colorClasses[item.color as "pink" | "rose"];

                return (
                  <motion.li
                    key={item.company + i}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="relative pl-14"
                  >
                    {/* marker */}
                    <span
                      className={`absolute left-3 top-2 h-3.5 w-3.5 rounded-full ${c.dot} ${c.ring} ring-4`}
                    />

                    {/* card (scales on hover) */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.995 }}
                      transition={{ type: "spring", stiffness: 360, damping: 26 }}
                      className="
                  relative origin-left md:origin-center
                  rounded-2xl border border-[color:#1f2937] bg-[var(--panel)] p-5
                  transform-gpu will-change-transform
                  hover:shadow-[0_22px_48px_-16px_rgba(0,0,0,0.45)]
                  hover:border-[color:var(--brand-600)]/40
                  hover:-translate-y-0.5
                  z-0 hover:z-10
                "
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${c.badge}`}
                        >
                          <Icon size={14} />
                          {item.role}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                          <CalendarDays size={14} /> {item.period}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                          <MapPin size={14} /> {item.location}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold">{item.company}</h3>

                      <ul className="mt-3 space-y-2 text-sm text-[var(--muted)] list-disc pl-5">
                        {item.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT — icons only */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-10 text-center"
          >
            Contact
          </motion.h2>

          {/* icon grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* Email */}
            <motion.a
              href="mailto:azka.aftab25@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[color:#1f2937] bg-[var(--panel)]
                         text-[var(--brand)] hover:border-[color:var(--brand)] hover:bg-[color:rgba(255,255,255,0.03)] transition"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4a2 2 0 0 0-2 2v.35l10 6.25L22 6.35V6a2 2 0 0 0-2-2Zm0 4.04-8 5-8-5V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.04Z" />
              </svg>
            </motion.a>

            {/* GitHub */}
            <motion.a
              href="https://github.com/Azzkaa"
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[color:#1f2937] bg-[var(--panel)]
                         text-[var(--text)] hover:border-[color:var(--brand)] hover:text-[var(--brand)] hover:bg-[color:rgba(255,255,255,0.03)] transition"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5A12 12 0 0 0 0 12.6c0 5.34 3.44 9.86 8.2 11.46.6.1.82-.26.82-.58v-2.1c-3.34.75-4.04-1.46-4.04-1.46-.54-1.4-1.32-1.77-1.32-1.77-1.08-.76.08-.74.08-.74 1.2.08 1.84 1.26 1.84 1.26 1.06 1.9 2.78 1.36 3.46 1.04.1-.8.42-1.36.76-1.67-2.66-.3-5.46-1.38-5.46-6.14 0-1.36.46-2.46 1.24-3.32-.12-.3-.54-1.54.12-3.2 0 0 1-.34 3.3 1.26a11 11 0 0 1 6 0c2.28-1.6 3.28-1.26 3.28-1.26.66 1.66.24 2.9.12 3.2.78.86 1.24 1.96 1.24 3.32 0 4.78-2.8 5.82-5.48 6.12.44.38.82 1.12.82 2.28v3.38c0 .32.22.68.82.58A12 12 0 0 0 24 12.6C24 5.82 18.62.5 12 .5Z" />
              </svg>
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/azka-aftab-19b1a1249/"
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[color:#1f2937] bg-[var(--panel)]
                         text-sky-400 hover:border-[color:var(--brand)] hover:text-[var(--brand)] hover:bg-[color:rgba(255,255,255,0.03)] transition"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.82v2.18h.05C12.6 8.8 14.4 8 16.46 8 21.2 8 22 10.96 22 15.2V24h-4v-7.76c0-1.86-.03-4.26-2.6-4.26-2.6 0-3 2.03-3 4.12V24h-4V8z" />
              </svg>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/60176491858"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl
             border border-[color:#1f2937] bg-[var(--panel)]
             text-[#25D366] hover:border-[color:var(--brand)]
             hover:text-[var(--brand)] hover:bg-[color:rgba(255,255,255,0.03)]
             transition"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.673.149-.198.297-.768.966-.941 1.164-.173.198-.347.223-.644.074-1.758-.879-2.91-1.571-4.083-3.554-.308-.531.308-.492.879-1.641.098-.197.049-.366-.025-.515-.075-.149-.673-1.611-.923-2.204-.242-.579-.487-.5-.673-.51-.173-.009-.371-.011-.57-.011a1.096 1.096 0 0 0-.795.37c-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.362.195 1.875.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.571-.347zM12.051 21.62h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.52-5.236c.001-5.45 4.436-9.884 9.885-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.897 6.993c-.003 5.45-4.437 9.884-9.876 9.884z" />
              </svg>
            </motion.a>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} Azka
      </footer>

      {/* custom cursor */}
      <CustomCursor />
    </main>
  );
}
