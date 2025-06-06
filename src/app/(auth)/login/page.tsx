import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import {
  UserGroupIcon,
  CameraIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { LoginForm } from '@/features/authentication/LoginForm'

export default function LoginPage() {
  const features = [
    {
      icon: CameraIcon,
      text: 'Kamp anılarını paylaş'
    },
    {
      icon: MapPinIcon,
      text: 'Yeni kamp alanları keşfet'
    },
    {
      icon: UserGroupIcon,
      text: 'Doğa severlerle tanış'
    },
    {
      icon: HeartIcon,
      text: 'İlham verici hikayeleri beğen'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <div className="absolute inset-0 bg-[url('/camping-pattern.svg')] opacity-5"></div>
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Visual Background & Content (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/login-bg.png"
              alt="Camping Background"
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
                  Kamp Deneyimini
                  <span className="text-primary-200 block">Sosyalleştir</span>
                </h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Türkiye&apos;nin en güzel kamp alanlarını keşfet, maceralarını paylaş ve doğa severlerle bağlantı kur.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors border border-white/20">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-100 group-hover:text-white transition-colors">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-200">Kullanıcı</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-200">Kamp Alanı</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">25K+</div>
                  <div className="text-sm text-gray-200">Paylaşım</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 bg-white dark:bg-secondary-900">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-12">
              <Logo
                variant="full"
                size="lg"
                clickable={false}
                className="justify-center mb-4"
              />
              <p className="text-secondary-600 dark:text-secondary-400">
                Doğada macera, sosyalde paylaşım
              </p>
            </div>

            {/* Login Form Component */}
            <LoginForm />
            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Hesabın yok mu?{' '}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
                >
                  Üye Ol
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Devam ederek{' '}
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