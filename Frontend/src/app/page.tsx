import { Navbar } from '@/components/Navbar'
import {
  HeroSection,
  ServicesSection,
  PortfolioSection,
  BlogSection,
  ContactSection,
} from '@/sections'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
