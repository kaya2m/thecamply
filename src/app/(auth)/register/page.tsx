import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RegisterForm } from '@/features/authentication/RegisterForm'
import { Logo } from '@/components/ui/Logo'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const benefits = [
    'Kamp alanlarını keşfet ve değerlendir',
    'Maceralarını fotoğraf ve hikayelerle paylaş',
    'Doğa severlerle bağlantı kur',
    'Favori kamp yerlerini kaydet',
    'Kamp ipuçları ve tavsiyeleri al',
    'Topluluk etkinliklerine katıl'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <div className="absolute inset-0 bg-[url('/camping-pattern.svg')] opacity-5"></div>
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Visual Background & Content (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Image - Farklı kamp görseli */}
          <div className="absolute inset-0">
            <Image
              src="/register-bg.png"
              alt="Mountain Camping Background"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full">
            <div className="max-w-md mx-auto">
              {/* Logo */}
              <div className="mb-12">
                <Logo
                  variant="icon"
                  size="xl"
                  theme="dark"
                  clickable={false}
                />
                <p className="text-gray-200 text-sm">Doğada macera, sosyalde paylaşım</p>
              </div>

              {/* Hero Content */}
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  Kamp Topluluğuna
                  <span className="text-primary-200 block">Katıl</span>
                </h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Türkiye&apos;nin en büyük kamp topluluğunun bir parçası ol ve maceralarını binlerce doğa severiyle paylaş.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-12">
                <h3 className="text-lg font-semibold text-primary-200 mb-4">
                  Neler kazanacaksın?
                </h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-400/80 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-300/50">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-100 text-sm leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xl font-bold text-white">10K+</div>
                  <div className="text-xs text-gray-200">Kullanıcı</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xl font-bold text-white">500+</div>
                  <div className="text-xs text-gray-200">Kamp Alanı</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xl font-bold text-white">25K+</div>
                  <div className="text-xs text-gray-200">Paylaşım</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 bg-white dark:bg-secondary-900">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Logo 
                variant="icon" 
                size="lg" 
                clickable={false}
                className="justify-center mb-4"
              />
              <p className="text-secondary-600 dark:text-secondary-400">
                Kamp topluluğuna katıl
              </p>
            </div>

            {/* Register Form Component */}
            <RegisterForm />
            
            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Zaten hesabın var mı?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Hesap oluşturarak{' '}
                <a href="#" className="text-primary-600 hover:underline">Kullanım Şartları</a>
                {' '}ve{' '}
                <a href="#" className="text-primary-600 hover:underline">Gizlilik Politikası</a>
                &apos;nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}