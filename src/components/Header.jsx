import React from "react";

// 1. Pastikan nama fungsinya adalah 'Header' (Huruf Besar di awal)
const Header = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={{ color: "white", margin: 0 }}>HAINICK</h2>
    </nav>
  );
};

// 2. Buat objek styles sederhana agar tidak error
const styles = {
  nav: {
    padding: "20px 5%",
    backgroundColor: "#1e293b",
    display: "flex",
    alignItems: "center",
  },
};

// 3. Pastikan mengekspor nama yang sama dengan fungsi di atas
export default Header;
