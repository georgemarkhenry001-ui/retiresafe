import React from "react";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                RetireSafe<span className="text-indigo-400">Crypto</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Empowering retirees to grow their wealth through secure,
              professionally managed digital asset portfolios.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#approach"
                  className="hover:text-white transition-colors"
                >
                  Our Approach
                </a>
              </li>
              <li>
                <a
                  href="#calculator"
                  className="hover:text-white transition-colors"
                >
                  Growth Calculator
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400" />
                hello@retiresafe.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400" />
                (800) 555-SAFE
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-indigo-400" />
                7788 Orbit Industrial Way, Aetherfield, IL 60666-4444
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">
              Get our monthly 'Secure Growth' insights.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs leading-relaxed text-slate-500">
          <p>© 2026 RetireSafe Crypto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}