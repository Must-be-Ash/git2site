'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronUp, Github, Code, Rocket, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export default function LandingPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [codeText, setCodeText] = useState('')
  const codeRef = useRef<HTMLPreElement>(null)

  const featuresRef = useRef<HTMLElement>(null)
  const benefitsRef = useRef<HTMLElement>(null)
  const demoRef = useRef<HTMLElement>(null)

  const controls = useAnimation()
  const [ref, inView] = useInView()
  const codeAnimation = useAnimation()
  const [showImage, setShowImage] = useState(false)
  const imageAnimation = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50
      if (show !== isHeaderVisible) setIsHeaderVisible(show)
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [isHeaderVisible])

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const yOffset = -80; // Adjust this value based on your header height
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
    setIsMenuOpen(false)
  }

  const codeSnippet = `// Git2Site: Automated Portfolio Generator

function createPortfolio(username) {
  const repos = fetchGitHubRepos(username);
  const portfolio = {
    projects: selectBestProjects(repos),
    skills: analyzeLanguages(repos),
    about: generateProfile(username),
    contact: addContactForm()
  };
  const site = deployPortfolio(portfolio);
  enableAutoSync(repos, site);
}

// Code more, showcase effortlessly
createPortfolio('yourGithubUsername');
// Visit git2site.com to get started!`

  const startAnimation = useCallback(async () => {
    setCodeText('')
    setShowImage(false)
    await codeAnimation.start({ opacity: 1, transition: { duration: 0.5 } })
    
    for (let i = 0; i < codeSnippet.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      setCodeText(prev => prev + codeSnippet[i])
      if (codeRef.current) {
        codeRef.current.scrollTop = codeRef.current.scrollHeight
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    await codeAnimation.start({ opacity: 0, transition: { duration: 0.5 } })
    setShowImage(true)
    await imageAnimation.start({ opacity: 1, transition: { duration: 0.5 } })
  }, [codeAnimation, imageAnimation, codeSnippet])

  useEffect(() => {
    startAnimation()
  }, [startAnimation])

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isHeaderVisible ? 'bg-background shadow-lg py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Github className="h-8 w-8 mr-2 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Git2Site
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection(demoRef)} className="text-foreground hover:text-primary transition duration-300">
              Demo
            </button>
            <button onClick={() => scrollToSection(featuresRef)} className="text-foreground hover:text-primary transition duration-300">
              Features
            </button>
            <button onClick={() => scrollToSection(benefitsRef)} className="text-foreground hover:text-primary transition duration-300">
              Benefits
            </button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-20 bg-background bg-opacity-95 flex flex-col items-center justify-center">
          <nav className="flex flex-col space-y-8 text-2xl">
            <button
              onClick={() => scrollToSection(demoRef)}
              className="text-foreground hover:text-primary transition duration-300"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="text-foreground hover:text-primary transition duration-300"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(benefitsRef)}
              className="text-foreground hover:text-primary transition duration-300"
            >
              Benefits
            </button>
          </nav>
        </div>
      )}

      <main className="flex-grow">
        <section className="relative overflow-hidden py-32 md:py-40 lg:py-48">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-10"></div>
          <div className="relative container mx-auto px-4 z-10">
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-foreground"
              >
                Turn Your GitHub Into a{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff8533] to-[#ffbf00]">
                  Stunning Portfolio
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl"
              >
                Turn your repository into a presentable portfolio that keeps itself updated. Like a link in bio for devs 🔗
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button asChild className="bg-white text-black hover:bg-[#ff8533] px-8 py-3 text-lg">
                  <Link href="/api/auth/github">Login with GitHub</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section ref={demoRef} className="py-20 md:py-32 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
              See Git2Site in{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Action
              </span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe 
                  src="https://www.youtube.com/embed/your-video-id" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                ></iframe>
              </div>
              <p className="text-center mt-8 text-lg text-muted-foreground">
                Watch how easily you can turn your GitHub repositories into a stunning portfolio website.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 md:py-32">
          {/* ... (keep the existing features section) ... */}
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef} className="py-20 md:py-32 bg-muted">
          {/* ... (keep the existing benefits section) ... */}
        </section>
      </main>

      <footer className="bg-[#242424] text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <Image 
              src="/ash.png" 
              alt="Ash" 
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <p className="text-center text-white">
              made by{' '}
              <a 
                href="https://x.com/Must_be_Ash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#ffc0fa] hover:underline"
              >
                @must_be_ash
              </a>
            </p>
          </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg transition-opacity duration-300 ${
          isHeaderVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  )
}
