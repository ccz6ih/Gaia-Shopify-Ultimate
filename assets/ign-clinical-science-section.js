(function() {
  'use strict';
  
  // Store animated progress bars to prevent re-animation
  const animatedBars = new WeakSet();
  
  // ============================================
  // POPUP CONTROLS
  // ============================================
  const popupTriggers = document.querySelectorAll('[data-popup-target]');
  const popups = document.querySelectorAll('.ign-cs-popup');
  const popupCloseButtons = document.querySelectorAll('[data-popup-close]');

  popupTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const targetId = this.getAttribute('data-popup-target');
      const popup = document.getElementById(targetId);
      if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // DON'T animate on popup open since Results tab is hidden
        // The animation will trigger when the Results tab is clicked
      }
    });
  });

  popupCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const popup = this.closest('.ign-cs-popup');
      if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close popup on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activePopup = document.querySelector('.ign-cs-popup.active');
      if (activePopup) {
        activePopup.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // ============================================
  // TAB CONTROLS - FIXED FOR PROGRESS BARS
  // ============================================
  const tabs = document.querySelectorAll('.ign-cs-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetId = this.getAttribute('data-tab');
      const popup = this.closest('.ign-cs-popup');
      
      // Remove active from all tabs and contents in this popup
      popup.querySelectorAll('.ign-cs-tab').forEach(t => t.classList.remove('active'));
      popup.querySelectorAll('.ign-cs-tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active to clicked tab and corresponding content
      this.classList.add('active');
      const content = document.getElementById(targetId);
      
      if (content) {
        content.classList.add('active');
        
        // FIX: Animate progress bars when Results tab becomes visible
        if (targetId.includes('results')) {
          // Use requestAnimationFrame to ensure DOM has updated
          requestAnimationFrame(() => {
            setTimeout(() => {
              animateProgressBars(content);
            }, 50); // Small delay for smooth tab transition
          });
        }
      }
    });
  });

  // ============================================
  // PROGRESS BAR ANIMATION - FIXED VERSION
  // ============================================
  function animateProgressBars(container) {
    // Find all progress bars in the visible container
    const progressBars = container.querySelectorAll('.ign-cs-progress-fill');
    
    progressBars.forEach((bar, index) => {
      // Skip if already animated (prevents re-animation)
      if (animatedBars.has(bar)) {
        return;
      }
      
      const percent = parseFloat(bar.getAttribute('data-progress')) || 0;
      
      // Reset bar to 0 width
      bar.style.width = '0%';
      
      // Stagger animation for visual appeal
      const delay = index * 100; // 100ms delay between each bar
      
      setTimeout(() => {
        // Trigger animation with smooth transition
        bar.style.width = percent + '%';
        
        // Mark as animated
        animatedBars.add(bar);
      }, delay);
    });
  }

  // ============================================
  // COUNTER ANIMATION FOR RESULT VALUES
  // ============================================
  function animateCounters() {
    const counters = document.querySelectorAll('.ign-cs-result-value[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = entry.target;
          const countStr = target.getAttribute('data-count');
          
          // Extract number and suffix (like %, +, etc)
          const match = countStr.match(/^([+-]?\d+(?:\.\d+)?)\s*(.*)$/);
          if (match) {
            const endValue = parseFloat(match[1]);
            const suffix = match[2];
            animateValue(target, 0, endValue, 1500, suffix);
            target.classList.add('counted');
          }
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      
      const displayValue = Math.round(current * 10) / 10;
      element.textContent = (displayValue >= 0 ? '+' : '') + displayValue + suffix;
    }, 16);
  }

  // ============================================
  // INITIALIZE ON PAGE LOAD
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
  });

})();