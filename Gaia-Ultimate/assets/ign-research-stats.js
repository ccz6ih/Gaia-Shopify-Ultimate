/**
 * Research Stats Section - JavaScript
 * GSAP-powered scroll animations
 */

(function() {
  'use strict';
  
  // console.log('🚀 Research Stats JS loaded');
  // console.log('✅ GSAP available:', typeof gsap !== 'undefined');
  // console.log('✅ ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');

  class ResearchStatsSection {
    constructor(sectionElement) {
      this.section = sectionElement;
      this.cards = this.section.querySelectorAll('.stat-card');
      // console.log('📊 Found', this.cards.length, 'stat cards');
      this.init();
    }

    init() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // console.error('❌ GSAP or ScrollTrigger not loaded!');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      this.animateHeader();
      this.animateCards();
      this.setupNavigation();
    }

    animateHeader() {
      const header = this.section.querySelector('.stats-header');
      const disclaimer = this.section.querySelector('.stats-disclaimer');
      
      if (header) {
        gsap.to(header, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            once: true,
            onEnter: () => header.classList.add('animated')
          }
        });
      }

      if (disclaimer) {
        gsap.to(disclaimer, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: disclaimer,
            start: 'top 90%',
            once: true,
            onEnter: () => disclaimer.classList.add('animated')
          }
        });
      }
    }

    animateCards() {
      const carousel = this.section.querySelector('.stats-carousel');
      
      if (carousel) {
        gsap.to(carousel, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carousel,
            start: 'top 75%',
            once: true,
            onEnter: () => {
              // console.log('🎬 Starting card animations');
              carousel.classList.add('animated');
              this.cards.forEach((card, index) => {
                setTimeout(() => {
                  this.animateCard(card);
                }, index * 150);
              });
            }
          }
        });
      }
    }

    animateCard(card) {
      const chartType = card.dataset.chartType;
      // console.log('🎨 Animating card:', chartType);
      card.classList.add('animated');

      switch (chartType) {
        case 'vertical-bar':
          this.animateVerticalBar(card);
          break;
        case 'growth-curve':
          this.animateGrowthCurve(card);
          break;
        case 'horizontal-bars':
          this.animateHorizontalBars(card);
          break;
        default:
          // console.warn('⚠️ Unknown chart type:', chartType);
      }
    }

    animateVerticalBar(card) {
      const numberElement = card.querySelector('[data-animate-number]');
      const barFill = card.querySelector('.bar-fill');
      const topIndicator = card.querySelector('.top-indicator');
      
      if (numberElement) {
        const targetNumber = parseInt(numberElement.dataset.animateNumber);
        this.animateNumber(numberElement, 0, targetNumber, 2000);
      }

      if (barFill) {
        const targetHeight = parseFloat(barFill.dataset.targetHeight);
        const barStartY = 438;
        const finalY = barStartY - targetHeight;
        
        gsap.set(barFill, {
          attr: { height: 0, y: barStartY }
        });
        
        gsap.to(barFill, {
          attr: { height: targetHeight, y: finalY },
          duration: 1.8,
          ease: 'power2.out',
          delay: 0.3
        });
      }

      if (topIndicator) {
        const targetHeight = parseFloat(barFill.dataset.targetHeight);
        const barStartY = 438;
        const finalY = barStartY - targetHeight - 18;
        
        gsap.set(topIndicator, {
          attr: { y1: finalY, y2: finalY }
        });
        
        gsap.to(topIndicator, {
          opacity: 1,
          duration: 0.5,
          delay: 1.8,
          ease: 'power2.out'
        });
      }
    }

    animateGrowthCurve(card) {
      const numberElement = card.querySelector('[data-animate-number]');
      const growthLine = card.querySelector('.growth-line');
      const growthArea = card.querySelector('.growth-area');
      const dayMarkers = card.querySelectorAll('.day-markers line');
      const glowDot = card.querySelector('.glow-dot');
      
      if (numberElement) {
        const targetText = numberElement.textContent.trim();
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        this.animateNumber(numberElement, 0, targetNumber, 2000, targetText.includes('+'));
      }

      if (growthLine) {
        gsap.to(growthLine, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.3
        });
      }

      if (growthArea) {
        gsap.to(growthArea, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 1
        });
      }

      // Animate day markers with blinking
      if (dayMarkers.length > 0) {
        dayMarkers.forEach((marker, index) => {
          const delay = 1.5 + (index * 0.5);
          
          // Initial double blink
          gsap.timeline({ delay: delay })
            .to(marker, { 
              opacity: 1, 
              strokeWidth: 4,
              duration: 0.15,
              ease: 'power2.out'
            })
            .to(marker, { 
              opacity: 1,
              strokeWidth: 2,
              duration: 0.15,
              ease: 'power2.in'
            })
            .to(marker, { 
              opacity: 1, 
              strokeWidth: 4,
              duration: 0.15,
              ease: 'power2.out'
            })
            .to(marker, { 
              opacity: 1,
              strokeWidth: 2,
              duration: 0.15,
              ease: 'power2.in'
            });
          
          // Continuous pulse
          gsap.to(marker, {
            opacity: 0.7,
            strokeWidth: 3,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: delay + 1
          });
        });
      }

      // Animate glowing dot at Day 30
      if (glowDot) {
        // console.log('✨ Animating glow dot');
        
        // Fade in the dot
        gsap.to(glowDot, {
          opacity: 1,
          duration: 0.5,
          delay: 2.5,
          ease: 'power2.out'
        });
        
        // Continuous glow pulse
        gsap.to(glowDot, {
          r: 8,
          opacity: 0.8,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 3
        });
      }
    }

    animateHorizontalBars(card) {
      // console.log('📊 Starting horizontal bars animation');
      
      const progressItems = card.querySelectorAll('.progress-item');
      // console.log('   Found progress items:', progressItems.length);
      
      if (progressItems.length === 0) {
        // console.error('❌ No progress items found!');
        return;
      }
      
      progressItems.forEach((item, index) => {
        const baseDelay = 0.3 + (index * 0.2);
        const progressBar = item.querySelector('.progress-bar-fill');
        
        // console.log(`   Item ${index + 1}:`, {
        //   element: item,
        //   hasBar: !!progressBar,
        //   targetWidth: progressBar?.dataset.targetWidth
        // });
        
        // Animate item entrance
        gsap.fromTo(item, 
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: baseDelay,
            ease: 'power2.out',
            onStart: () => {
              // console.log(`   ▶️ Item ${index + 1} entrance started`);
            },
            onComplete: () => {
              item.classList.add('animated');
              // console.log(`   ✅ Item ${index + 1} entrance complete`);
            }
          }
        );

        // Animate progress bar fill
        if (progressBar) {
          const targetWidth = parseFloat(progressBar.dataset.targetWidth);
          // console.log(`   🎯 Animating bar ${index + 1} to ${targetWidth}%`);
          
          gsap.fromTo(progressBar,
            { width: '0%' },
            {
              width: `${targetWidth}%`,
              duration: 1.5,
              delay: baseDelay + 0.3,
              ease: 'power2.out',
              onUpdate: function() {
                if (index === 0) {
                  // console.log(`   📈 Bar 1 width:`, this.targets()[0].style.width);
                }
              },
              onComplete: () => {
                // console.log(`   ✅ Bar ${index + 1} animation complete at ${targetWidth}%`);
              }
            }
          );
        } else {
          // console.error(`   ❌ No progress bar found in item ${index + 1}`);
        }
      });
    }

    animateNumber(element, start, end, duration, includeplus = false) {
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = `${includeplus ? '+' : ''}${currentValue}%`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = `${includeplus ? '+' : ''}${end}%`;
        }
      };
      
      requestAnimationFrame(animate);
    }

    setupNavigation() {
      const navDots = this.section.querySelectorAll('.nav-dot');
      if (!navDots.length) return;

      navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.showSlide(index);
          this.updateActiveNav(index);
        });
      });

      if (window.innerWidth < 1024) {
        this.setupIntersectionObserver();
      }
    }

    showSlide(index) {
      const cards = Array.from(this.cards);
      const targetCard = cards[index];
      
      if (!targetCard) return;

      if (window.innerWidth >= 1024) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } else {
        const container = this.section.querySelector('.stats-track');
        const cardRect = targetCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const scrollLeft = targetCard.offsetLeft - (containerRect.width / 2) + (cardRect.width / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }

    updateActiveNav(index) {
      const navDots = this.section.querySelectorAll('.nav-dot');
      navDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    setupIntersectionObserver() {
      const options = {
        root: this.section.querySelector('.stats-track'),
        threshold: 0.6
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(this.cards).indexOf(entry.target);
            this.updateActiveNav(index);
          }
        });
      }, options);

      this.cards.forEach(card => observer.observe(card));
    }
  }

  function initResearchStats() {
    // console.log('🔄 Initializing Research Stats sections');
    const sections = document.querySelectorAll('.research-stats-section');
    // console.log('   Found sections:', sections.length);
    
    sections.forEach((section, index) => {
      // console.log(`   Initializing section ${index + 1}`);
      new ResearchStatsSection(section);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResearchStats);
  } else {
    initResearchStats();
  }

  // Shopify theme editor support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', (event) => {
      if (event.target.classList.contains('research-stats-section')) {
        // console.log('🔄 Reloading section in theme editor');
        new ResearchStatsSection(event.target);
      }
    });
  }
})();