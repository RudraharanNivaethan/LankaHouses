import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ImageSection } from '../../components/layout/ImageSection'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { ROUTES } from '../../constants/routes'
import { buttonClassName } from '../../components/ui/Button'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { FormSubmitButton } from '../../components/ui/FormSubmitButton'
import { useAuth } from '../../context/AuthContext'
import { can } from '../../utils/can'
import { createInquirySchema, type CreateInquirySchema } from '../../schemas/inquiry'
import { createGeneralInquiry } from '../../services/inquiryService'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80'

const TEAM_MEMBERS = [
  {
    name: 'Kasun Perera',
    role: 'Founder & CEO',
    description:
      'Leads the vision and strategy of LankaHouses, ensuring a transparent and user-first property platform.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Nadeesha Fernando',
    role: 'Operations Manager',
    description:
      'Oversees daily operations and ensures every property listing meets our verification standards.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Tharindu Silva',
    role: 'Product & Technology Lead',
    description:
      'Responsible for building and improving the platform experience with modern technology.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Ishara Jayasinghe',
    role: 'Customer Success Manager',
    description:
      'Works closely with users to ensure smooth inquiries and excellent support throughout their journey.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
  },
]

const FAQ_ITEMS = [
  {
    question: 'How do I inquire about a property?',
    answer:
      'Create an account, browse listings, and submit an inquiry directly through the platform.',
  },
  {
    question: 'Are all listings verified?',
    answer:
      'Yes, every property goes through a verification process before being published.',
  },
  {
    question: 'Do you charge any fees?',
    answer: 'No hidden fees. You connect directly with the seller.',
  },
]

export function ContactPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [selectedFaq, setSelectedFaq] = useState(0)
  const [messageSent, setMessageSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInquirySchema>({
    resolver: zodResolver(createInquirySchema),
  })

  const mutation = useMutation({
    mutationFn: createGeneralInquiry,
    onSuccess: () => {
      toast.success('Inquiry submitted successfully')
      setMessageSent(true)
      setServerError(null)
      reset()
    },
    onError: (err: Error) => {
      setServerError(err.message ?? 'Failed to submit inquiry.')
    },
  })

  const canSubmitInquiry = !isLoading && isAuthenticated && can(user, 'inquiries.submit')

  function onSubmit(data: CreateInquirySchema) {
    setServerError(null)
    setMessageSent(false)
    mutation.mutate(data)
  }

  return (
    <div className="bg-white">
      <ImageSection
        src={HERO_IMAGE}
        alt="Modern Sri Lankan home exterior"
        overlay="bg-gradient-to-br from-slate-950/80 via-slate-900/55 to-brand-dark/50"
        className="py-20 sm:py-24"
      >
        <SectionContainer>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-200">
              Have questions or need assistance? Our team is here to help you every step of the way.
            </p>
          </div>
        </SectionContainer>
      </ImageSection>

      <section className="bg-slate-50 py-16 sm:py-20">
        <SectionContainer>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>

              <div className="mt-6 space-y-5 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Phone:</span> +94 11 234 5678
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Email:</span>{' '}
                  <a className="text-brand hover:text-brand-dark" href="mailto:info@lankahouses.lk">
                    info@lankahouses.lk
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Address:</span> No. 42, Galle Road,
                  Colombo 03, Sri Lanka
                </p>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Working Hours
                </h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
              {!canSubmitInquiry ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">Sign in required</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    To contact our team, please sign in and submit your inquiry through your account.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CONTACT)}`}
                      className={buttonClassName('primary', 'md', 'w-full sm:w-auto text-center')}
                    >
                      Log in
                    </Link>
                    <Link
                      to={`${ROUTES.SIGNUP}?redirect=${encodeURIComponent(ROUTES.CONTACT)}`}
                      className={buttonClassName('outline', 'md', 'w-full sm:w-auto text-center')}
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <AlertBanner message={serverError} />
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5" noValidate>
                    <Input
                      label="Title"
                      placeholder="Brief summary of your question"
                      error={errors.title?.message}
                      disabled={mutation.isPending}
                      {...register('title')}
                    />
                    <Textarea
                      label="Message"
                      rows={6}
                      placeholder="Describe your inquiry in detail…"
                      error={errors.message?.message}
                      disabled={mutation.isPending}
                      {...register('message')}
                    />
                    <FormSubmitButton
                      isLoading={mutation.isPending}
                      label="Send Message"
                      loadingLabel="Sending…"
                    />
                  </form>

                  {messageSent && (
                    <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Your inquiry has been sent. Our team will get back to you shortly.
                    </p>
                  )}
                </>
              )}
            </article>
          </div>
        </SectionContainer>
      </section>

      <section className="py-16 sm:py-20">
        <SectionContainer>
          <SectionHeader
            eyebrow="Our people"
            title="Meet Our Team"
            description="The people behind LankaHouses, committed to making property discovery simple and trustworthy."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img src={member.image} alt={member.name} className="h-64 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <p className="mt-0.5 text-sm font-medium text-brand">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.description}</p>
                </div>
              </article>
            ))}
          </div>
        </SectionContainer>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <SectionContainer>
          <SectionHeader
            eyebrow="Location"
            title="Visit Our Colombo Office"
            description="Find us in the heart of Colombo for in-person assistance and property guidance."
          />
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              title="LankaHouses Colombo Office Map"
              src="https://www.google.com/maps?q=Galle+Road,+Colombo+03,+Sri+Lanka&z=14&output=embed"
              className="h-[360px] w-full md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </SectionContainer>
      </section>

      <section className="py-16 sm:py-20">
        <SectionContainer>
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Quick answers to common questions about using LankaHouses."
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = selectedFaq === index
              return (
                <article
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedFaq((prev) => (prev === index ? -1 : index))}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-base font-semibold text-slate-900">{item.question}</span>
                    <span className="text-xl font-semibold text-brand" aria-hidden="true">
                      {isOpen ? '-' : '+'}
                    </span>
                  </button>
                  {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</p>}
                </article>
              )
            })}
          </div>
        </SectionContainer>
      </section>

      <ImageSection
        src={HERO_IMAGE}
        overlay="bg-brand-dark/90"
        className="py-20 sm:py-24"
      >
        <SectionContainer className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to Find Your Dream Property?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={ROUTES.LISTINGS}
              className={buttonClassName(
                'outline',
                'lg',
                'w-full border-white/50 text-white hover:border-white hover:bg-white/10 sm:w-auto',
              )}
            >
              Browse Listings
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              className={buttonClassName(
                'outline',
                'lg',
                'w-full border-white/50 text-white hover:border-white hover:bg-white/10 sm:w-auto',
              )}
            >
              Register Account
            </Link>
          </div>
        </SectionContainer>
      </ImageSection>
    </div>
  )
}
