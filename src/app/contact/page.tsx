import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F3E6]">
      <Navbar />

      {/* --- PREMIUM CONTACT HERO --- */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Technical Arcs */}
        <svg className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none" viewBox="0 0 500 500">
          {[...Array(15)].map((_, i) => (
            <circle key={i} cx="500" cy="0" r={i * 45} fill="none" stroke="#1D1D1D" strokeWidth="1" />
          ))}
        </svg>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-3 mb-10">
              <div className="h-px w-8 bg-[#DAA35D]"></div>
              <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Connect</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-semibold text-[#1D1D1D] leading-[0.95] tracking-tighter mb-12">
              Let’s Build the Future <br />
              <span className="text-[#FD630A]">of Trade Together.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-[#1D1D1D]/70 leading-relaxed font-medium max-w-2xl">
              Have questions about our commodities or partnership opportunities? Reach out to our global team today.
            </p>
          </div>
        </div>
      </section>

      {/* --- DARK SECTION: CONTACT INFO --- */}
      <section className="py-32 bg-[#1D1D1D] relative overflow-hidden">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(white 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            
            {/* Visit Us */}
            <div className="space-y-8 group">
              <div className="flex items-center space-x-4">
                <div className="h-px w-12 bg-[#FD630A]"></div>
                <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">visit us</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ADDRESS</h3>
                <p className="text-xl lg:text-2xl font-medium text-white leading-relaxed group-hover:text-[#FD630A] transition-colors">
                  5868 A1 Westheimer Rd, <br /> Houston, Texas 77057, USA
                </p>
              </div>
            </div>

            {/* Call Us */}
            <div className="space-y-8 group">
              <div className="flex items-center space-x-4">
                <div className="h-px w-12 bg-white/20"></div>
                <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">call us</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">PHONE</h3>
                <p className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#FD630A] transition-colors">
                  +1 346 434 8264
                </p>
              </div>
            </div>

            {/* Mail Us */}
            <div className="space-y-8 group">
              <div className="flex items-center space-x-4">
                <div className="h-px w-12 bg-white/20"></div>
                <span className="text-[10px] font-bold text-[#DAA35D] uppercase tracking-[0.4em]">Mail us</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">EMAIL</h3>
                <p className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#FD630A] transition-colors">
                  info@footprintsenergy.com
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- MAP & FORM SPLIT --- */}
      <section className="py-32 bg-white relative">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            
            {/* Left: Map with Architectural Frame */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -top-6 -left-6 w-full h-full border border-[#1D1D1D]/10 translate-x-4 translate-y-4"></div>
              <div className="relative h-[600px] w-full overflow-hidden rounded-sm shadow-2xl border border-[#1D1D1D]/5">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.7663435134!2d-95.4851214!3d29.7340333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c39f28c2c77d%3A0xc3f6a2a0a2f4a2f4!2s5868%20Westheimer%20Rd%2C%20Houston%2C%20TX%2077057!5e0!3m2!1sen!2sus!4v1715690000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.9)' }} 
                  allowFullScreen 
                  loading="lazy" 
                  title="Footprints Energy Office Location"
                ></iframe>
              </div>
              {/* Floating Badge on Map */}
              <div className="absolute -bottom-8 -right-8 bg-[#1D1D1D] text-white p-8 hidden xl:block shadow-2xl">
                <span className="block text-2xl font-bold tracking-tight">Houston</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mt-1">Headquarters</span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-semibold text-[#1D1D1D] tracking-tight">Send a Message</h2>
                <p className="text-lg text-[#1D1D1D]/60 font-medium">Our global trade desk is ready to assist you.</p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest ml-1">Name</label>
                  <input type="text" className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-sm px-6 py-4 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-[#1D1D1D]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest ml-1">E-mail</label>
                  <input type="email" className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-sm px-6 py-4 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-[#1D1D1D]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest ml-1">Subject</label>
                  <input type="text" className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-sm px-6 py-4 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-[#1D1D1D]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest ml-1">Message</label>
                  <textarea rows={5} className="w-full bg-[#F7F3E6]/30 border border-[#1D1D1D]/10 rounded-sm px-6 py-4 focus:outline-none focus:border-[#FD630A] transition-colors font-medium text-[#1D1D1D] resize-none"></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="bg-[#FD630A] text-white px-16 py-5 rounded-sm font-bold hover:bg-[#1D1D1D] transition-all duration-500 flex items-center justify-center space-x-4 group w-full sm:w-auto">
                    <span>Inquire Now</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
