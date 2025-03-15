"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");
  // const [status, setStatus] = useState({
  //   message: "",
  //   type: "", // "success" or "error"
  //   isSubmitting: false,
  // });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    message: "",
    type: "", // 'success' or 'error'
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus((prevStatus) => ({
          ...prevStatus,
          message: "",
        }));
      }, 5000); // 5 seconds

      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, message: "", type: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Ensure response is not empty before parsing JSON
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setStatus({
        isSubmitting: false,
        message: data.message,
        type: "success",
      });

      // Reset form after success
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      setStatus({ isSubmitting: false, message: error.message, type: "error" });
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-violet-900/30">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex justify-between items-start">
          {/* Logo and Description Section */}
          <motion.div
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <svg
                className="w-7 h-7 text-violet-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-lg font-bold">Blockchain Lab</span>
            </Link>
            <p className="mt-3 text-gray-400 max-w-md text-sm">
              Empowering developers to build the future of Web3 through
              interactive learning, practice challenges, and expert guidance in
              blockchain development.
            </p>
            <div className="flex mt-4 space-x-3">
              <a
                href="#"
                className="text-gray-400 hover:text-violet-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.163 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-violet-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-violet-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.014-.628.961-.689 1.8-1.56 2.46-2.548z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-violet-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-base font-bold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/editor"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Code Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/arena"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Practice Arena
                </Link>
              </li>
              <li>
                <Link
                  href="/chatbot"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Expert Chatbot
                </Link>
              </li>
              <li>
                {/* <Link
                  href="/blog"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Blog
                </Link> */}
                <Link
                  href="/courses"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-base font-bold mb-3">Resources</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Community Forum
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-gray-400 hover:text-violet-400 transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </motion.div> */}
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="md:w-1/2">
              <h3 className="text-base font-bold mb-3">Contact Us</h3>
              <p className="text-gray-400 text-sm mb-4">
                Have questions or feedback? Reach out to our team and we'll get
                back to you as soon as possible.
              </p>
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <svg
                  className="w-4 h-4 mr-2 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                adityaanandatwork276@gmail.com / rakshabv.work@gmail.com
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <svg
                  className="w-4 h-4 mr-2 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Bengaluru, India
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm"
                      required
                      disabled={status.isSubmitting}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm"
                      required
                      disabled={status.isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm"
                    required
                    disabled={status.isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className={`px-4 py-2 bg-violet-700 hover:bg-violet-600 rounded-lg text-white font-medium transition-colors text-sm flex items-center justify-center ${
                    status.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={status.isSubmitting}
                >
                  {status.isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                {status.message && (
                  <p
                    className={`text-sm ${
                      status.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-500 text-xs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>
            © {new Date().getFullYear()} Blockchain Lab. All rights reserved.
          </p>
          {/* <div className="mt-2 flex justify-center space-x-4">
            <Link
              href="/privacy"
              className="hover:text-violet-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-violet-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div> */}
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
