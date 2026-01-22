'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  alt: string;
  rating: number;
  content: string;
}

interface TestimonialsSectionProps {
  className?: string;
}

const TestimonialsSection = ({ className = '' }: TestimonialsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marie Kouam',
    role: 'Small Business Owner',
    company: 'Kouam Fashion Boutique',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16326238c-1763296602542.png",
    alt: 'Professional African woman with braided hair in burgundy blazer smiling confidently',
    rating: 5,
    content: 'A.S Accounting made my first tax filing experience stress-free. The team guided me through every step, and I received my documents within 48 hours. Their expertise in Cameroonian tax law is exceptional.'
  },
  {
    id: '2',
    name: 'Jean-Paul Mbarga',
    role: 'Freelance Consultant',
    company: 'Independent Professional',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f44f4439-1763293731587.png",
    alt: 'Young African man in navy blue suit with warm smile in modern office setting',
    rating: 5,
    content: 'Getting my TIN was incredibly simple with A.S Accounting. The mobile money payment option was convenient, and the platform kept me updated throughout the process. Highly recommended for freelancers!'
  },
  {
    id: '3',
    name: 'Aminata Diallo',
    role: 'Restaurant Owner',
    company: 'Chez Aminata Restaurant',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_140a94777-1763295330584.png",
    alt: 'Confident African businesswoman in white blouse with natural hair in professional setting',
    rating: 5,
    content: 'As a restaurant owner, tax compliance was overwhelming. A.S Accounting simplified everything. Their team is professional, responsive, and truly understands the challenges SMEs face in Cameroon.'
  },
  {
    id: '4',
    name: 'Emmanuel Nkeng',
    role: 'Tech Startup Founder',
    company: 'InnovateCM',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14a3645c0-1763296944878.png",
    alt: 'Young African entrepreneur in casual blazer with glasses in modern tech office',
    rating: 5,
    content: 'The digital platform is exactly what modern businesses need. Fast, secure, and efficient. A.S Accounting helped us stay compliant while we focused on growing our startup. Their service is world-class.'
  }];


  const handlePrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={`py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-secondary/5 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-golden/10 px-4 py-2 rounded-full mb-4">
            <Icon name="ChatBubbleLeftRightIcon" size={20} variant="solid" className="text-brand-golden" />
            <span className="text-sm font-medium text-brand-golden">Client Success Stories</span>
          </div>
          
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Trusted by Cameroon's Businesses
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Hear from real clients who've experienced the A.S Accounting difference in their tax compliance journey.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-8 lg:p-12 relative">
            <div className="absolute top-8 left-8 text-primary/10">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/10">
                  <AppImage
                    src={currentTestimonial.image}
                    alt={currentTestimonial.alt}
                    className="w-full h-full object-cover" />

                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="CheckIcon" size={20} variant="solid" className="text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-1 mb-3">
                  {[...Array(currentTestimonial.rating)].map((_, i) =>
                  <Icon key={i} name="StarIcon" size={20} variant="solid" className="text-brand-golden" />
                  )}
                </div>
                
                <p className="text-lg text-foreground leading-relaxed mb-6 italic">
                  "{currentTestimonial.content}"
                </p>
                
                <div>
                  <h4 className="font-heading font-bold text-lg text-foreground">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.role} • {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={handlePrevious}
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-smooth"
                aria-label="Previous testimonial">

                <Icon name="ChevronLeftIcon" size={20} variant="outline" />
              </button>
              
              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) =>
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-smooth ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'}`
                  }
                  aria-label={`Go to testimonial ${index + 1}`} />

                )}
              </div>
              
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-smooth"
                aria-label="Next testimonial">

                <Icon name="ChevronRightIcon" size={20} variant="outline" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Join over 2,500 satisfied clients who trust A.S Accounting
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="StarIcon" size={16} variant="solid" className="text-brand-golden" />
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="UserGroupIcon" size={16} variant="outline" />
              <span>2,500+ Happy Clients</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;