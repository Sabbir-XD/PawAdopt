import {
    FaPaw,
    FaHeart,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebook,
    FaInstagram,
    FaTwitter,
  } from "react-icons/fa";
  import { motion } from "framer-motion";
  
  const Footer = () => {
    const footerLinks = [
      {
        title: "Explore",
        links: [
          { name: "Home", href: "/" },
          { name: "Pet Listing", href: "/pets" },
          { name: "Success Stories", href: "/success" },
          { name: "Donation Campaigns", href: "/donate" },
        ],
      },
      {
        title: "Resources",
        links: [
          { name: "Adoption Guide", href: "/guide" },
          { name: "Pet Care Tips", href: "/care" },
          { name: "FAQ", href: "/faq" },
          { name: "Blog", href: "/blog" },
        ],
      },
      {
        title: "Organization",
        links: [
          { name: "About Us", href: "/about" },
          { name: "Our Shelters", href: "/shelters" },
          { name: "Volunteer", href: "/volunteer" },
          { name: "Careers", href: "/careers" },
        ],
      },
    ];
  
    return (
      <footer className="bg-gradient-to-br from-teal-800 via-teal-900 to-cyan-900 text-white pt-16 pb-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
            {/* Brand Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white p-2 rounded-full shadow">
                  <FaPaw className="text-teal-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold">
                  <span className="text-amber-300">Paw</span>Adopt
                </h2>
              </div>
              <p className="text-white/80 leading-relaxed text-sm">
                Connecting loving homes with rescued pets since 2018. We aim to
                end pet homelessness through technology and compassion.
              </p>
              <div className="flex gap-4">
                {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -4 }}
                    href="#"
                    aria-label={`Social icon ${i}`}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>
  
            {/* Link Columns */}
            {footerLinks.map((col, idx) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold border-b border-white/20 pb-2">
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <motion.a
                        whileHover={{ x: 6 }}
                        href={link.href}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition"
                      >
                        <FaPaw className="text-amber-300 text-xs" />
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
  
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold border-b border-white/20 pb-2">
                Contact Us
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <FaPhone className="text-teal-300 mt-1" />
                  <div>
                    <p className="font-medium">Adoption Hotline</p>
                    <p className="text-white/80">(555) 123-4567</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaEnvelope className="text-teal-300 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-white/80">adopt@pawadopt.org</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaMapMarkerAlt className="text-teal-300 mt-1" />
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-white/80">
                      123 Pet Lane, San Francisco, CA
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
  
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-inner"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <FaHeart className="text-amber-300" />
                  Stay Connected
                </h3>
                <p className="text-white/80 text-sm">
                  Get heartwarming success stories and pet adoption alerts in your inbox.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3 flex-1 w-full max-w-lg">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-amber-300 outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <FaPaw />
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
  
          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between text-white/60 text-sm gap-4">
            <p>© {new Date().getFullYear()} PawAdopt. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  