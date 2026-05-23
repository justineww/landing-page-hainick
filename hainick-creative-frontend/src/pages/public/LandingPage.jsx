import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HomeSection from "./section/HomeSection";
import AboutSection from "./section/AboutSection";
import TalentSection from "./section/TalentSection";
import ServiceSection from "./section/ServiceSection";
import PricelistSection from "./section/PricelistSection";
import ActivitySection from "./section/ActivitySection";
import TestimonySection from "./section/TestimonySection";
import ContactSection from "./section/ContactSection";
import CreatorSection from "./section/CreatorSection";

// Nanti uncomment setelah section dibuat:

const LandingPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#0a0a0a",
      }}
    >
      <Header />
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px", // ← atur jarak antar section di sini
        }}
      >
        <HomeSection />
        <AboutSection />
        <TalentSection />
        <CreatorSection />
        <ServiceSection />
        <PricelistSection />
        <ActivitySection />
        <TestimonySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
