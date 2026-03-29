import React from "react";
import Header from "../../components/Header"; // Sesuaikan jika lokasi Header berbeda

const LandingPage = () => {
  return (
    <div
      style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}
    >
      <Header />
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ fontSize: "3rem" }}>Hainick Creative</h1>
        <p style={{ color: "#94a3b8" }}>Landing page is under construction.</p>
      </section>
    </div>
  );
};

export default LandingPage;
