/*
 * Gaia Ultimate Theme
 * Enhanced JavaScript for Quick Shop, Quick Add, and other features
 * ==================================================================
 */

(function() {
  'use strict';

  /* ==========================================================================
     MODAL SYSTEM
     ========================================================================== */

  class Modal {
    constructor(element) {
      this.element = element;
      this.overlay = element.querySelector('.modal__overlay');
      this.closeButtons = element.querySelectorAll('[data-modal-close]');
      this.focusableElements = null;
      this.firstFocusableElement = null;
      this.lastFocusableElement = null;
      this.previousActiveElement = null;

      this.bindEvents();
    }

    bindEvents() {
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      this.closeButtons.forEach(button => {
        button.addEventListener('click', () => this.close());
      });

      this.element.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.close();
      }

      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    }

    trapFocus(e) {
      if (!this.focusableElements) {
        this.focusableElements = this.element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
      }

      if (e.shiftKey) {
        if (document.activeElement === this.firstFocusableElement) {
          this.lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === this.lastFocusableElement) {
          this.firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }

    open() {
      this.previousActiveElement = document.activeElement;
      this.element.removeAttribute('hidden');
      this.element.classList.add('is-active');
      document.body.style.overflow = 'hidden';

      // Focus first focusable element
      setTimeout(() => {
        const firstFocusable = this.element.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) firstFocusable.focus();
      }, 100);
    }

    close() {
      this.element.classList.remove('is-active');
      document.body.style.overflow = '';

      setTimeout(() => {
        this.element.setAttribute('hidden', '');
        if (this.previousActiveElement) {
          this.previousActiveElement.focus();
        }
      }, 300);
    }
  }

  /* ==========================================================================
     QUICK SHOP
     ========================================================================== */

  class QuickShop {
    constructor() {
      this.modal = null;
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-quick-shop-open]');
        if (trigger) {
          e.preventDefault();
          this.openQuickShop(trigger);
        }
      });
    }

    async openQuickShop(trigger) {
      const productId = trigger.dataset.quickShopOpen;
      const handle = trigger.dataset.handle;

      const modalElement = document.getElementById(`QuickShopModal-${productId}`);
      if (!modalElement) {
        console.error('Quick shop modal not found for product:', productId);
        return;
      }

      this.modal = new Modal(modalElement);
      this.modal.open();

      // Load product content
      const holder = document.getElementById(`QuickShopHolder-${handle}`);
      if (holder && !holder.dataset.loaded) {
        try {
          const response = await fetch(`/products/${handle}?view=quick-shop`);
          if (response.ok) {
            const html = await response.text();
            holder.innerHTML = html;
            holder.dataset.loaded = 'true';

            // Initialize any product forms
            this.initProductForm(holder);
          }
        } catch (error) {
          console.error('Error loading quick shop content:', error);
          holder.innerHTML = '<p>Sorry, there was an error loading this product.</p>';
        }
      }
    }

    initProductForm(container) {
      // Re-initialize variant selectors, quantity inputs, etc.
      const form = container.querySelector('form[action="/cart/add"]');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.addToCart(form);
        });
      }
    }

    async addToCart(form) {
      const formData = new FormData(form);

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const item = await response.json();
          this.onAddSuccess(item);
        } else {
          const error = await response.json();
          this.onAddError(error);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }

    onAddSuccess(item) {
      // Close modal
      if (this.modal) this.modal.close();

      // Update cart count
      this.updateCartCount();

      // Dispatch event for cart drawer/notification
      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: item }));
    }

    onAddError(error) {
      alert(error.message || 'Could not add item to cart');
    }

    async updateCartCount() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();

        const countElements = document.querySelectorAll('[data-cart-count]');
        countElements.forEach(el => {
          el.textContent = cart.item_count;
          el.classList.toggle('hidden', cart.item_count === 0);
        });
      } catch (error) {
        console.error('Error updating cart count:', error);
      }
    }
  }

  /* ==========================================================================
     QUICK ADD
     ========================================================================== */

  class QuickAdd {
    constructor() {
      this.modal = null;
      this.init();
    }

    init() {
      // Handle quick add with variants (opens modal)
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-quick-add-open]');
        if (trigger) {
          e.preventDefault();
          this.openQuickAdd(trigger);
        }
      });

      // Handle single variant quick add
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-quick-add-single]');
        if (trigger) {
          e.preventDefault();
          this.quickAddSingle(trigger);
        }
      });
    }

    async openQuickAdd(trigger) {
      const productUrl = trigger.dataset.productUrl;

      const modalElement = document.getElementById('QuickAddModal');
      if (!modalElement) {
        console.error('Quick add modal not found');
        return;
      }

      this.modal = new Modal(modalElement);
      this.modal.open();

      const holder = document.getElementById('QuickAddHolder');
      if (holder) {
        holder.innerHTML = '<div class="quick-add-modal__loading"><div class="loading-spinner"><svg class="spinner" viewBox="0 0 66 66"><circle class="spinner__path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></div></div>';

        try {
          const response = await fetch(productUrl);
          if (response.ok) {
            const html = await response.text();
            holder.innerHTML = html;

            // Initialize form
            this.initProductForm(holder);
          }
        } catch (error) {
          console.error('Error loading quick add content:', error);
          holder.innerHTML = '<p>Sorry, there was an error loading this product.</p>';
        }
      }
    }

    async quickAddSingle(trigger) {
      const variantId = trigger.dataset.variantId;

      trigger.classList.add('loading');
      trigger.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: variantId,
            quantity: 1
          })
        });

        if (response.ok) {
          const item = await response.json();
          this.onAddSuccess(item);
        } else {
          const error = await response.json();
          this.onAddError(error);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        trigger.classList.remove('loading');
        trigger.disabled = false;
      }
    }

    initProductForm(container) {
      const form = container.querySelector('form[action="/cart/add"]');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.addToCart(form);
        });
      }
    }

    async addToCart(form) {
      const formData = new FormData(form);

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const item = await response.json();
          this.onAddSuccess(item);
        } else {
          const error = await response.json();
          this.onAddError(error);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }

    onAddSuccess(item) {
      if (this.modal) this.modal.close();
      this.updateCartCount();
      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: item }));
    }

    onAddError(error) {
      alert(error.message || 'Could not add item to cart');
    }

    async updateCartCount() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();

        const countElements = document.querySelectorAll('[data-cart-count]');
        countElements.forEach(el => {
          el.textContent = cart.item_count;
          el.classList.toggle('hidden', cart.item_count === 0);
        });
      } catch (error) {
        console.error('Error updating cart count:', error);
      }
    }
  }

  /* ==========================================================================
     RECENTLY VIEWED
     ========================================================================== */

  class RecentlyViewed {
    constructor() {
      this.storageKey = 'gaia-recently-viewed';
      this.maxProducts = 20;
      this.init();
    }

    init() {
      // Track current product
      this.trackProduct();

      // Initialize any recently viewed sections
      document.querySelectorAll('[data-section-type="recently-viewed"]').forEach(section => {
        this.loadRecentlyViewed(section);
      });
    }

    trackProduct() {
      const productId = document.querySelector('[data-product-id]')?.dataset.productId;
      const productHandle = document.querySelector('[data-product-handle]')?.dataset.productHandle;

      if (!productHandle) return;

      const products = this.getProducts();

      // Remove if already exists
      const index = products.findIndex(p => p.handle === productHandle);
      if (index > -1) {
        products.splice(index, 1);
      }

      // Add to beginning
      products.unshift({
        handle: productHandle,
        id: productId,
        timestamp: Date.now()
      });

      // Limit to max products
      if (products.length > this.maxProducts) {
        products.pop();
      }

      this.saveProducts(products);
    }

    getProducts() {
      try {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
      } catch {
        return [];
      }
    }

    saveProducts(products) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(products));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
    }

    async loadRecentlyViewed(section) {
      const config = document.getElementById(`RecentlyViewedConfig-${section.dataset.sectionId}`);
      if (!config) return;

      const settings = JSON.parse(config.textContent);
      const products = this.getProducts();

      // Filter out current product
      const filteredProducts = products.filter(p => p.id !== settings.productId);

      const container = section.querySelector(`#RecentlyViewedProducts-${settings.sectionId}`);
      const loading = section.querySelector('.recently-viewed__loading');
      const empty = section.querySelector('.recently-viewed__empty');

      if (filteredProducts.length === 0) {
        loading?.classList.add('hidden');
        empty?.classList.remove('hidden');
        return;
      }

      // Fetch product cards
      const handles = filteredProducts.slice(0, settings.maxProducts).map(p => p.handle);

      try {
        const productCards = await Promise.all(
          handles.map(handle => this.fetchProductCard(handle))
        );

        container.innerHTML = productCards.filter(Boolean).join('');
        loading?.classList.add('hidden');
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
        loading?.classList.add('hidden');
        empty?.classList.remove('hidden');
      }
    }

    async fetchProductCard(handle) {
      try {
        const response = await fetch(`/products/${handle}?view=card`);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        console.error('Error fetching product card:', error);
      }
      return null;
    }
  }

  /* ==========================================================================
     COLOR SWATCHES
     ========================================================================== */

  class ColorSwatches {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const swatch = e.target.closest('.color-swatch[data-variant-id]');
        if (swatch) {
          this.handleSwatchClick(swatch);
        }
      });

      document.addEventListener('mouseenter', (e) => {
        const swatch = e.target.closest('.color-swatch[data-variant-image]');
        if (swatch) {
          this.showVariantImage(swatch);
        }
      }, true);

      document.addEventListener('mouseleave', (e) => {
        const swatch = e.target.closest('.color-swatch[data-variant-image]');
        if (swatch) {
          this.hideVariantImage(swatch);
        }
      }, true);
    }

    handleSwatchClick(swatch) {
      const url = swatch.dataset.url;
      if (url) {
        window.location.href = url;
      }
    }

    showVariantImage(swatch) {
      const card = swatch.closest('.card-product-enhanced, .grid-product');
      if (!card) return;

      const variantImage = swatch.dataset.variantImage;
      const primaryImage = card.querySelector('.card-product-enhanced__image--primary, .grid-product__image');

      if (primaryImage && variantImage) {
        primaryImage.dataset.originalSrc = primaryImage.src;
        primaryImage.src = variantImage;
      }
    }

    hideVariantImage(swatch) {
      const card = swatch.closest('.card-product-enhanced, .grid-product');
      if (!card) return;

      const primaryImage = card.querySelector('.card-product-enhanced__image--primary, .grid-product__image');

      if (primaryImage && primaryImage.dataset.originalSrc) {
        primaryImage.src = primaryImage.dataset.originalSrc;
      }
    }
  }

  /* ==========================================================================
     TOOLTIP SYSTEM
     ========================================================================== */

  class ToolTip {
    constructor() {
      this.activeTooltip = null;
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-tool-tip-trigger]');
        if (trigger) {
          e.preventDefault();
          this.toggle(trigger.dataset.toolTipTrigger);
          return;
        }

        const closeButton = e.target.closest('[data-tool-tip-close]');
        if (closeButton) {
          e.preventDefault();
          this.close(closeButton.dataset.toolTipClose);
          return;
        }

        // Close on click outside
        if (this.activeTooltip && !e.target.closest('.tool-tip')) {
          this.closeAll();
        }
      });
    }

    toggle(id) {
      const tooltip = document.getElementById(`ToolTip-${id}`);
      if (!tooltip) return;

      if (tooltip.classList.contains('is-visible')) {
        this.close(id);
      } else {
        this.open(id);
      }
    }

    open(id) {
      this.closeAll();

      const tooltip = document.getElementById(`ToolTip-${id}`);
      const trigger = document.querySelector(`[data-tool-tip-trigger="${id}"]`);

      if (!tooltip || !trigger) return;

      tooltip.removeAttribute('hidden');
      tooltip.classList.add('is-visible');

      // Position tooltip
      this.position(tooltip, trigger);

      this.activeTooltip = id;
      trigger.setAttribute('aria-expanded', 'true');
    }

    close(id) {
      const tooltip = document.getElementById(`ToolTip-${id}`);
      const trigger = document.querySelector(`[data-tool-tip-trigger="${id}"]`);

      if (tooltip) {
        tooltip.classList.remove('is-visible');
        setTimeout(() => tooltip.setAttribute('hidden', ''), 200);
      }

      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }

      if (this.activeTooltip === id) {
        this.activeTooltip = null;
      }
    }

    closeAll() {
      document.querySelectorAll('.tool-tip.is-visible').forEach(tooltip => {
        const id = tooltip.id.replace('ToolTip-', '');
        this.close(id);
      });
    }

    position(tooltip, trigger) {
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

      // Keep within viewport
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      // Flip above if not enough space below
      if (top + tooltipRect.height > window.innerHeight - 8) {
        top = triggerRect.top - tooltipRect.height - 8;
      }

      tooltip.style.position = 'fixed';
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }
  }

  /* ==========================================================================
     INITIALIZE
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    new QuickShop();
    new QuickAdd();
    new RecentlyViewed();
    new ColorSwatches();
    new ToolTip();

    console.log('Gaia Ultimate Theme initialized');
  });

})();
