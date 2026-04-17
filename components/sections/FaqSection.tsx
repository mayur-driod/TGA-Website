import SectionLabel from "@/components/common/SectionLabel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import faqsData from "@/data/faqs.json"
import type { FaqItem } from "@/lib/types"

export default function FaqSection() {
  const faqs = faqsData as FaqItem[]

  return (
    <section id="faq" className="scroll-mt-24 bg-background px-4 py-14 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="text-center">
          <SectionLabel>FAQs</SectionLabel>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Questions people ask the most
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Quick answers about memberships, events, collaborations, and biodiversity initiatives at TGA.
          </p>
        </div>

        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-7">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
