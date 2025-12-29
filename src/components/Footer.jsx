
import React from 'react'
import { Menu, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="bg-black/90 text-gray-300 relative pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-primary transition-colors">Scan</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">Sports</a></li>
              <li><a href="/livescoring" className="hover:text-primary transition-colors">Leaderboard</a></li>
              <li><a href="/livescoring" className="hover:text-primary transition-colors">Live Scoring</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="/occupancy" className="hover:text-primary transition-colors">Occupancy</a></li>
              <li><a href="/playersearch" className="hover:text-primary transition-colors">Player Search</a></li>
              <li><a href="/bookingsystem" className="hover:text-primary transition-colors">Booking</a></li>
              <li><a href="/others" className="hover:text-primary transition-colors">Others</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/others" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="/others" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; 2025 SportsBook. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
