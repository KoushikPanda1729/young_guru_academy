"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Award, Rocket, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatItem } from "./statsItem";
import { brico } from "./fonts";

export default function AboutUsSection() {
  const aboutData = {
    title: "About Us",
    subtitle:
      "Talk2Partners™ is the new-age learning platform Managed by Bunni Education Service Pvt. Ltd., created as a pivot brand from our successful journey with Young Guru Academy. For over a decade, Young Guru Academy has empowered more than 50,000 students through online courses in Spoken English, Interview Preparation, and Soft Skills Training.",
    mission:
      "Helping Hindi-medium learners speak English in real life situations by practicing with same-level partners and learning from expert guidance.",
    vision:
      "Within the next 5 years, our vision is to empower at least 1 crore learners to master Spoken English and Soft Skills at an affordable fee with the help of technology",
  };

  const stats = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      label: "Students",
      value: 50000,
      title: "Successfully Taught Students",
      delay: 0.1,
      decimalPlaces: 0,
      color: "primary",
    },
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      label: "Experience",
      value: 10,
      title: "Years of Experience",
      delay: 0.2,
      decimalPlaces: 0,
      color: "amber",
    },
  ];
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });

  return (
    <section id="about" className="relative w-full overflow-hidden py-20">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* CTA-Style Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mx-auto mb-6 max-w-2xl text-center"
        >
          <h2
            className={cn(
              "cursor-crosshair bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl",
              brico.className
            )}
          >
            About <span className="text-primary">Us</span>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto mb-16 max-w-2xl text-center text-muted-foreground sm:text-lg"
        >
          {aboutData.subtitle}
        </motion.p>

        {/* Stats Section */}
        {/* Stats Section */}
        <div ref={statsRef} className="mb-20">
          <div className="flex justify-center">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl">
              {stats.map((stat, index) => (
                <StatItem
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  delay={stat.delay || index * 0.1}
                  decimalPlaces={stat.decimalPlaces}
                  color={stat.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div ref={missionRef} className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 grid gap-12 md:grid-cols-2"
          >
            {/* Mission */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="from-transparent via-primary/40 to-transparent"
              />
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-3xl font-bold text-transparent">
                Our Mission
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {aboutData.mission}
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="from-transparent via-blue-500/40 to-transparent"
                reverse
              />
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mb-4 bg-gradient-to-r from-blue-500/90 to-blue-500/70 bg-clip-text text-3xl font-bold text-transparent">
                Our Vision
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {aboutData.vision}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
