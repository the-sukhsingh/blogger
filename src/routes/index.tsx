import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import {
  HeroSection,
  ProductShowcase,
  StatsAndSocialProof,
  TransactionalPublishingSection,
  WritingWorkspaceSection,
  AutomationPipelineSection,
  MultiProjectSection,
  AgenticIntegrationsSection,
  TestimonialsSection,
  StillWonderingSection,
  HomepageFooter,
} from '#/components/homepage'

export const Route = createFileRoute('/')({
  component: AutoSendLandingPage,
})

function AutoSendLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Global Unified Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full space-y-24 pt-10 pb-28">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Product Showcase Card */}
        <ProductShowcase />

        {/* 4. Stats & Social Proof */}
        <StatsAndSocialProof />

        {/* 5. Feature #01 — Transactional Publishing & Code / Diff */}
        <TransactionalPublishingSection />

        {/* 6. Feature #02 — Custom Writing Workspace */}
        <WritingWorkspaceSection />

        {/* 7. Feature #03 — Content Health & Automation */}
        <AutomationPipelineSection />

        {/* 8. Multi Project Support */}
        <MultiProjectSection />

        {/* 9. Agentic Integrations */}
        <AgenticIntegrationsSection />

        {/* 10. Testimonials */}
        <TestimonialsSection />

        {/* 11. Still Wondering? */}
        <StillWonderingSection />

        {/* 12. Footer Navigation */}
        <HomepageFooter />
      </main>
    </div>
  )
}
