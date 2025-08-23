'use client'

import { useState, useRef, useEffect } from 'react'

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = index => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  const faqs = [
    {
      question: 'Wie funktioniert die Adoption?',
      answer: 'Du kannst ein Tierprofil ansehen und über das Tierheim Kontakt aufnehmen. Danach erfolgt ein Gespräch und ggf. ein Besuch.'
    },
    {
      question: 'Welche Tiere werden vermittelt?',
      answer: 'Aktuell bieten wir Hunde, Katzen, Vögel und Kleintiere von Tierheimen aus ganz Deutschland an.'
    },
    {
      question: 'Kostet die Nutzung von Pawdia etwas?',
      answer: 'Nein, Pawdia ist kostenlos. Tierheime können sich registrieren und Tiere einstellen.'
    }
  ]

  return (
    <div className="flex flex-col gap-[1rem]">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div key={index} className="rounded-[1rem] overflow-hidden w-full shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
            <button
              className="text-left p-[1rem] bg-white text-(--text-color) flex justify-between items-center w-full"
              onClick={() => toggle(index)}
            >
              <span>{item.question}</span>
              <span>{isOpen ? '–' : '+'}</span>
            </button>

            <div
              className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-[500px] p-[1rem]' : 'max-h-0 p-[0_1rem]'}
                bg-(--secondary-color) text-black
              `}
            >
              <div className="opacity-100">{item.answer}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
