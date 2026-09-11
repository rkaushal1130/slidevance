import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './ContactFAQ.module.css';

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'What types of projects can Slidevance handle?',
    answer:
      'Slidevance specializes in high-stakes presentation design (executive pitches, board decks, keynote presentations), proposal and RFP documents, business and financial reports, data storytelling and dashboards, sales enablement collateral, and secondary research deliverables.'
  },
  {
    id: 'faq-2',
    question: 'Can you deliver on urgent timelines?',
    answer:
      'Yes. With our 24/7 agile operating model and weekend coverage, we routinely support mission-critical, fast-turnaround requests. Turnarounds can range from 24 to 48 hours for urgent sprints, depending on scope and source materials.'
  },
  {
    id: 'faq-3',
    question: 'Can we work with our existing brand guidelines and templates?',
    answer:
      'Absolutely. We seamlessly integrate with your corporate typography, color palettes, visual standards, and master slide templates. If you do not have established guidelines, our design team can develop a clean, bespoke design system for your deliverables.'
  },
  {
    id: 'faq-4',
    question: 'Do we receive editable source files?',
    answer:
      'Yes. All deliverables include complete, editable source files—typically PowerPoint (.pptx), Google Slides, Keynote, Word (.docx), or Figma—along with print-ready and web-optimized PDFs.'
  },
  {
    id: 'faq-5',
    question: 'How do ongoing design partnerships work?',
    answer:
      'In addition to standalone project-based engagements, we offer monthly retainer agreements and dedicated designer arrangements. These models provide guaranteed resource allocation, priority turnaround, and seamless integration into your team’s workflow.'
  }
];

export default function ContactFAQ() {
  const [openItem, setOpenItem] = useState('faq-1');

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`section-spacing ${styles.faqSection}`} aria-label="Frequently Asked Questions">
      <div className="container">
        <div className={`${styles.headerWrapper} reveal-on-scroll`}>
          <h2 className={styles.heading}>
            Everything You Need
            <br />
            <span className="gradient-text">to Know.</span>
          </h2>
          <p className={styles.subheading}>
            Clear answers about our turnaround times, confidentiality, deliverables, and engagement formats.
          </p>
        </div>

        <div className={styles.accordionContainer}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openItem === item.id;
            return (
              <div
                key={item.id}
                className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''} reveal-on-scroll reveal-delay-${index + 1}`}
              >
                <button
                  type="button"
                  id={`btn-${item.id}`}
                  className={styles.questionBtn}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`content-${item.id}`}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <div className={`${styles.chevronWrapper} ${isOpen ? styles.chevronOpen : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <div
                  id={`content-${item.id}`}
                  role="region"
                  aria-labelledby={`btn-${item.id}`}
                  className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ''}`}
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answerText}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
