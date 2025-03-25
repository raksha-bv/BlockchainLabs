"use client";
import React from "react";
import Link from "next/link";
import { Twitter, Linkedin, Send, Mail, GitBranchIcon } from "lucide-react";

const CoursePageFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerNavigation = [
    {
      title: "Learn",
      links: [
        { name: "Courses", href: "/courses" },
        { name: "Learning Paths", href: "/learning-paths" },
        { name: "Resources", href: "/resources" },
        { name: "Community", href: "/community" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Partners", href: "/partners" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "FAQ", href: "/faq" },
        { name: "Troubleshooting", href: "/support" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-950 px-6 py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(124,58,237,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.1) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-violet-700 text-white p-2 rounded-lg mr-3">
                <Send className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Blockchain <span className="text-violet-400">Labs</span>
              </h2>
            </div>
            <p className="text-gray-300 max-w-xl mb-6">
              Empowering developers to build the future of decentralized
              technology. Learn, create, and innovate with our comprehensive
              blockchain education platform.
            </p>

            {/* Newsletter Signup */}
            <div className="bg-gray-900/60 p-4 rounded-lg border border-violet-900/30 flex items-center">
              <Mail className="w-6 h-6 text-violet-400 mr-3" />
              <div>
                <h3 className="font-semibold text-white">Stay Updated</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Subscribe to our newsletter for the latest blockchain insights
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-3 py-2 bg-gray-800 text-white rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                  <button className="px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white rounded-r-lg">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-3 gap-6">
            {footerNavigation.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-white mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-violet-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-700/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} Blockchain Labs. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/blockchainhq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-violet-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/blockchainhq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-violet-400 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/blockchainhq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-violet-400 transition-colors"
            >
              <GitBranchIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CoursePageFooter;
