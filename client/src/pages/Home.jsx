import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import TrustedBy from '../components/landing/TrustedBy'
import Problem from '../components/landing/Problem'
import Solution from '../components/landing/Solution'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import DashboardPreview from '../components/landing/DashboardPreview'
import AISection from '../components/landing/AISection'
import Benefits from '../components/landing/Benefits'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

function Home() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <AISection />
      <Benefits />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home
