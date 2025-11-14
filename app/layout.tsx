import "./globals.css";
import Header from "@/src/components/Header";

export const metadata = {
  title: "MasseurMatch",
  description: "Find real massage therapists. Connect with confidence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
