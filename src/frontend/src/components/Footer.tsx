import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="section-footer text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#E67E22" }}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Visit Subang</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Jelajahi keindahan wisata Subang — dari pegunungan hijau hingga
              pantai yang memukau.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Destinasi</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link
                  to="/destinations"
                  className="hover:opacity-100 transition-opacity"
                >
                  Semua Destinasi
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="hover:opacity-100 transition-opacity"
                >
                  Paket Tour
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="hover:opacity-100 transition-opacity"
                >
                  Hotel & Penginapan
                </Link>
              </li>
              <li>
                <Link
                  to="/agencies"
                  className="hover:opacity-100 transition-opacity"
                >
                  Tour & Travel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Informasi</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link to="/" className="hover:opacity-100 transition-opacity">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:opacity-100 transition-opacity">
                  Kontak
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:opacity-100 transition-opacity">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:opacity-100 transition-opacity">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Ikuti Kami</h4>
            <div className="flex gap-3">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://instagram.com",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                  href: "https://facebook.com",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                  href: "https://twitter.com",
                },
                {
                  icon: Youtube,
                  label: "YouTube",
                  href: "https://youtube.com",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-50">
            © {year} Visit Subang. Hak cipta dilindungi.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            className="text-sm opacity-50 hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
