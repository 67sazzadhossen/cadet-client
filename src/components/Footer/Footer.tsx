"use client";

import React from "react";
import Link from "next/link";
import logo from "@/assets/logo.png";

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Quick Links
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Academic Calendar", href: "/academic-calendar" },
    { name: "Admission", href: "/admission" },
    { name: "Career", href: "/career" },
    { name: "News & Events", href: "/news" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Academic Links
  const academicLinks = [
    { name: "Academic Programs", href: "/academic-programs" },
    { name: "Faculty Members", href: "/faculty" },
    { name: "Research", href: "/research" },
    { name: "Library", href: "/library" },
    { name: "Online Learning", href: "/online-learning" },
    { name: "Student Portal", href: "/student-portal" },
  ];

  // Student Resources
  const studentResources = [
    { name: "Scholarships", href: "/scholarships" },
    { name: "Student Clubs", href: "/clubs" },
    { name: "Sports", href: "/sports" },
    { name: "Campus Life", href: "/campus-life" },
    { name: "Career Services", href: "/career-services" },
    { name: "Alumni", href: "/alumni" },
  ];

  // Social Media Links
  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com/gsca", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com/gsca", label: "Twitter" },
    {
      icon: FaInstagram,
      href: "https://instagram.com/gsca",
      label: "Instagram",
    },
    {
      icon: FaLinkedin,
      href: "https://linkedin.com/school/gsca",
      label: "LinkedIn",
    },
    { icon: FaYoutube, href: "https://youtube.com/gsca", label: "YouTube" },
    { icon: SiWhatsapp, href: "https://wa.me/880123456789", label: "WhatsApp" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Image src={logo} alt="Logo" width={40} height={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Gazipur Shaheen
                  </h3>
                  <p className="text-cyan-200 text-sm">Cadet Academy</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Empowering students with quality education since 1995. We are
                committed to nurturing future leaders through innovative
                teaching methods and holistic development.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <FaMapMarkerAlt className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm">
                  F-224, Joorpukur Road, Gazipur-1700, Bangladesh
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <FaPhone className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm">+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <FaEnvelope className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm">gazipurshaheen@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <FaClock className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm">Sun - Thu: 8:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cyan-400 border-l-4 border-cyan-400 pl-3">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 group"
                  >
                    <FaArrowRight className="text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-2 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cyan-400 border-l-4 border-cyan-400 pl-3">
              Academics
            </h4>
            <ul className="space-y-3">
              {academicLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 group"
                  >
                    <FaArrowRight className="text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-2 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cyan-400 border-l-4 border-cyan-400 pl-3">
              Student Life
            </h4>
            <ul className="space-y-3">
              {studentResources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 group"
                  >
                    <FaArrowRight className="text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-2 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-semibold mb-2 text-cyan-400">
                Stay Updated
              </h4>
              <p className="text-gray-300">
                Subscribe to our newsletter for the latest news, events, and
                updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Gazipur Shaheen Cambridge Academy. All rights
              reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-500 transform hover:scale-110 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <Icon className="text-lg group-hover:scale-110 transition-transform" />
                  </Link>
                );
              })}
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link
                href="/privacy-policy"
                className="hover:text-cyan-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-cyan-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-cyan-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
