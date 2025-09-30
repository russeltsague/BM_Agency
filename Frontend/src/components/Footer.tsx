import Link from 'next/link'
import { MotionDiv, MotionH4, MotionLi, MotionA } from '@/components/MotionComponents'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from './Button'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { href: '/services', label: 'Communication digitale' },
      { href: '/services', label: 'Marketing digital' },
      { href: '/services', label: 'Objets publicitaires' },
      { href: '/services', label: 'Création de contenu' },
    ],
    company: [
      { href: '/agence', label: 'À propos' },
      { href: '/equipe', label: 'Notre équipe' },
      { href: '/contact', label: 'Contact' },
      { href: '/recrutement', label: 'Recrutement' },
    ],
    legal: [
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/politique-confidentialite', label: 'Politique de confidentialité' },
      { href: '/conditions-generales', label: 'Conditions générales' },
    ],
  }

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">BM Agency</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Votre partenaire de confiance pour la communication digitale 360° au Cameroun.
                Créativité, stratégie et résultats au service de votre succès numérique.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  123 Avenue Kennedy<br />
                  Yaoundé, Cameroun
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Phone className="w-4 h-4 mr-2" />
                  +237 222 123 456
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@bm_Agency.cm
                </div>
              </div>
            </MotionDiv>
          </div>

          {/* Services */}
          <div>
            <MotionH4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100"
            >
              Nos services
            </MotionH4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <MotionLi
                  key={`${link.href}-${link.label}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </MotionLi>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <MotionH4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100"
            >
              Entreprise
            </MotionH4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <MotionLi
                  key={`${link.href}-${link.label}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </MotionLi>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <MotionH4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100"
            >
              Newsletter
            </MotionH4>
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              Restez informé de nos dernières actualités et tendances du digital.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <Button size="sm" className="w-full">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-slate-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              © {currentYear}  BM Agency. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => (
                <MotionA
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </MotionA>
              ))}
            </div>
          </div>
        </MotionDiv>
      </div>
    </footer>
  )
}
