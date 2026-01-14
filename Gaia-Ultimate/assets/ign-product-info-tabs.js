/**
 * IGN Product Info Tabs - Interactive JavaScript
 * Handles tab switching and animations
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initProductInfoTabs();
    setupScrollAnimations();
  });

  function initProductInfoTabs() {
    // Find all tab sections on the page
    const tabSections = document.querySelectorAll('.ign-tabs-wrapper');
    
    tabSections.forEach(function(section) {
      setupTabs(section);
    });
  }

  function setupTabs(wrapper) {
    const tabButtons = wrapper.querySelectorAll('.ign-tab-button');
    const tabPanels = wrapper.querySelectorAll('.ign-tab-panel');
    
    if (tabButtons.length === 0) return;

    // Add click handlers to all tab buttons
    tabButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab(button, tabButtons, tabPanels);
      });

      // Add keyboard navigation
      button.addEventListener('keydown', function(e) {
        handleKeyboardNavigation(e, button, tabButtons);
      });
    });

    // Initialize ARIA attributes
    initializeAccessibility(tabButtons, tabPanels);
  }

  function switchTab(activeButton, allButtons, allPanels) {
    const targetPanelId = activeButton.getAttribute('data-tab-target');
    const targetPanel = document.getElementById(targetPanelId);
    
    if (!targetPanel) return;

    // Add loading state
    targetPanel.classList.add('loading');

    // Remove active state from all buttons and panels
    allButtons.forEach(function(btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    allPanels.forEach(function(panel) {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    });

    // Add active state to clicked button and corresponding panel
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');
    
    // Small delay for smooth transition
    setTimeout(function() {
      targetPanel.classList.add('active');
      targetPanel.setAttribute('aria-hidden', 'false');
      targetPanel.classList.remove('loading');
      
      // Focus management for accessibility
      targetPanel.focus();
      
      // Trigger custom event
      const event = new CustomEvent('ign:tab-changed', {
        detail: {
          tabId: targetPanelId,
          tabButton: activeButton
        }
      });
      wrapper.dispatchEvent(event);
    }, 50);
  }

  function handleKeyboardNavigation(e, currentButton, allButtons) {
    const buttonsArray = Array.from(allButtons);
    const currentIndex = buttonsArray.indexOf(currentButton);
    let newIndex = currentIndex;

    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex === buttonsArray.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex === 0 ? buttonsArray.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = buttonsArray.length - 1;
        break;
      default:
        return;
    }

    buttonsArray[newIndex].focus();
    buttonsArray[newIndex].click();
  }

  function initializeAccessibility(buttons, panels) {
    // Set up proper ARIA roles
    buttons.forEach(function(button, index) {
      button.setAttribute('role', 'tab');
      button.setAttribute('tabindex', index === 0 ? '0' : '-1');
      
      // Set aria-controls if not already set
      if (!button.hasAttribute('aria-controls')) {
        const targetId = button.getAttribute('data-tab-target');
        button.setAttribute('aria-controls', targetId);
      }
    });

    panels.forEach(function(panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '0');
    });
  }

  // Smooth scroll to section if there's a hash in URL pointing to a tab
  function checkForTabInUrl() {
    const hash = window.location.hash;
    if (!hash) return;

    const tabButton = document.querySelector(`[data-tab-target="${hash.substring(1)}"]`);
    if (tabButton) {
      // Wait for page to load
      setTimeout(function() {
        tabButton.click();
        
        // Scroll to the tab section
        const tabSection = tabButton.closest('.ign-product-info-section');
        if (tabSection) {
          tabSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  // Check URL on load and hash change
  window.addEventListener('load', checkForTabInUrl);
  window.addEventListener('hashchange', checkForTabInUrl);

  // Add swipe support for mobile
  function addSwipeSupport(wrapper) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    wrapper.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) < swipeThreshold) return;
      
      const activeButton = wrapper.querySelector('.ign-tab-button.active');
      const allButtons = wrapper.querySelectorAll('.ign-tab-button');
      const buttonsArray = Array.from(allButtons);
      const currentIndex = buttonsArray.indexOf(activeButton);
      
      if (diff > 0 && currentIndex < buttonsArray.length - 1) {
        // Swipe left - next tab
        buttonsArray[currentIndex + 1].click();
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous tab
        buttonsArray[currentIndex - 1].click();
      }
    }
  }

  // Initialize swipe support for mobile
  document.querySelectorAll('.ign-tabs-wrapper').forEach(addSwipeSupport);

  // Add intersection observer for animation on scroll
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.ign-info-block');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      animatedElements.forEach(function(element) {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
      });
    }
  }

})();