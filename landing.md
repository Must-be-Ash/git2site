'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { ChevronUp, Github, Code, Rocket, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import { useInView } from 'react-intersection-observer'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [codeText, setCodeText] = useState('')
  const codeRef = useRef<HTMLPreElement>(null)

  const featuresRef = useRef<HTMLElement>(null)
  const benefitsRef = useRef<HTMLElement>(null)
  const demoRef = useRef<HTMLElement>(null)
  const joinRef = useRef<HTMLElement>(null)

  const controls = useAnimation()
  const [ref, inView] = useInView()
  const codeAnimation = useAnimation()
  const siteAnimation = useAnimation()
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

  useEffect(() => {
    const joined = localStorage.getItem('hasJoinedWaitlist')
    if (joined) {
      setHasJoined(true)
    }
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateEmail(email)) {
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.toLowerCase() }), // Convert email to lowercase before sending
        })

        const data = await response.json()

        if (response.ok) {
          if (data.message === 'Email already registered' || hasJoined) {
            toast.info('You\'re already on the waitlist!')
          } else {
            toast.success('Thank you for joining the waitlist!')
            localStorage.setItem('hasJoinedWaitlist', 'true')
            setHasJoined(true)
          }
          setEmail('')
        } else {
          toast.error('Failed to join the waitlist. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting email:', error)
        toast.error('An error occurred. Please try again later.')
      }
    } else {
      setIsEmailValid(false)
    }
  }

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

  const startAnimation = async () => {
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

    // Wait for a moment after text animation
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Fade out text and fade in image
    await codeAnimation.start({ opacity: 0, transition: { duration: 0.5 } })
    setShowImage(true)
    await imageAnimation.start({ opacity: 1, transition: { duration: 0.5 } })
  }

  useEffect(() => {
    startAnimation()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
            <button onClick={() => scrollToSection(joinRef)} className="text-foreground hover:text-primary transition duration-300">
              Join
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

            <button
              onClick={() => scrollToSection(joinRef)}
              className="text-foreground hover:text-primary transition duration-300"
            >
              Join
            </button>
          </nav>
        </div>
      )}

      <main className="flex-grow">
        <section className="relative overflow-hidden py-32 md:py-40 lg:py-48"> {/* Increased padding here */}
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
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
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
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onSubmit={handleSubmit}
                className="w-full max-w-md"
              >
                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full ${
                      isEmailValid ? 'border-primary' : 'border-destructive'
                    } focus:ring-2 focus:ring-primary`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setIsEmailValid(true)
                    }}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-secondary text-white"
                  >
                    Get Early Access
                  </Button>
                </div>
                {!isEmailValid && <p className="text-destructive text-sm mt-2">Please enter a valid email address.</p>}
              </motion.form>
            </div>
          </div>
        </section>

        {/* New Demo Section */}
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

        <section ref={featuresRef} className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
              Showcase Your Code{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Effortlessly</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-card p-8 rounded-xl shadow-lg"
              >
                <Github className="text-primary w-12 h-12 mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">GitHub Integration</h3>
                <p className="text-muted-foreground">
                  Connect your GitHub account or paste your profile URL to instantly create your portfolio.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-card p-8 rounded-xl shadow-lg"
              >
                <Code className="text-secondary w-12 h-12 mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Automatic Updates</h3>
                <p className="text-muted-foreground">
                  Your portfolio stays in sync with your GitHub repos, always showcasing your latest work.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-card p-8 rounded-xl shadow-lg"
              >
                <Rocket className="text-primary w-12 h-12 mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Custom Domains</h3>
                <p className="text-muted-foreground">
                  Use your own domain to make your portfolio truly yours and stand out from the crowd.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="benefits" ref={benefitsRef} className="py-20 md:py-32 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
              Unlock a World of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Possibilities
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Centralized Access</h3>
                  <p className="text-muted-foreground">Manage all your API keys from one secure, user-friendly dashboard.</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Precise Budget Tracking</h3>
                  <p className="text-muted-foreground">Allocate and monitor budgets for each project with pinpoint accuracy.</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002  2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Effortless Key Generation</h3>
                  <p className="text-muted-foreground">Create and manage API keys with ease, organized by project.</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Streamlined Workflow</h3>
                  <p className="text-muted-foreground">Download ready-to-use .env files, accelerating your development process.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={joinRef} className="py-20 md:py-32 bg-gradient-to-br from-primary via-secondary to-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Ready to Showcase Your Code?
            </h2>
            <p className="text-xl text-white opacity-90 mb-12 max-w-2xl mx-auto">
              Join the waitlist for early access to Git to Site and transform your GitHub into a stunning portfolio in minutes.
            </p>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full ${
                    isEmailValid ? 'border-white' : 'border-destructive'
                  } focus:ring-2 focus:ring-white text-foreground`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setIsEmailValid(true)
                  }}
                />
                <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-black hover:text-white">
                  Get Early Access
                </Button>
              </div>
              {!isEmailValid && <p className="text-destructive-foreground text-sm mt-2">Please enter a valid email address.</p>}
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="bg-[#242424] text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <img 
              src="/ash.png" 
              alt="Ash" 
              className="w-10 h-10 rounded-full mr-3"
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
      <Toaster />
    </div>
  )
}