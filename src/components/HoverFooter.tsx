import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Ticket,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TextHoverEffect } from "@/components/ui/hover-footer";

function HoverFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  // Footer link data
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { label: "For Organizers", href: "#organizers" },
        { label: "Contact Us", href: "#contact" },
        { label: "About Us", href: "/about" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
    {
      title: "Helpful Links",
      links: [
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Support", href: "#contact" },
        {
          label: "Live Chat",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "gettogetherebookings@gmail.com",
      href: "mailto:gettogetherebookings@gmail.com",
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "+91 9079235893",
      href: "tel:+919079235893",
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa]" />,
      text: "Phagwara - 144401, Punjab, India",
    },
  ];

  // Social media icons
  const socialLinks = [
    { 
      icon: <Facebook size={20} />, 
      label: "Facebook", 
      href: "#" 
    },
    { 
      icon: <Instagram size={20} />, 
      label: "Instagram", 
      href: "#" 
    },
    { 
      icon: <Twitter size={20} />, 
      label: "Twitter", 
      href: "#" 
    },
  ];

  return (
    <footer className="bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden m-8">
      <div className="max-w-7xl mx-auto p-14 z-50 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-[#3ca2fa] glow-sm" />
              <span className="text-white text-3xl font-bold">GetTogether</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Your premier destination for discovering and booking amazing events. 
              From concerts to conferences, we've got you covered.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    {link.href === '#' && link.pulse ? (
                      <span className="text-gray-300 cursor-not-allowed relative z-50">
                        {link.label}
                      </span>
                    ) : link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (location.pathname !== '/') {
                            e.preventDefault();
                            navigate('/' + link.href);
                          }
                        }}
                        className="text-gray-300 hover:text-[#3ca2fa] transition-colors relative z-50 cursor-pointer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-gray-300 hover:text-[#3ca2fa] transition-colors relative z-50"
                      >
                        {link.label}
                      </Link>
                    )}
                    {link.pulse && (
                      <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-[#3ca2fa] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-[#3ca2fa] transition-colors text-sm"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-300 hover:text-[#3ca2fa] transition-colors text-sm">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-700 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-gray-400">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-[#3ca2fa] transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-gray-300">
            &copy; {new Date().getFullYear()} GetTogether. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36" style={{ pointerEvents: 'auto' }}>
        <TextHoverEffect text="GetTogether" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
