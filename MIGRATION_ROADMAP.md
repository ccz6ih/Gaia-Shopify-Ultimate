# Gaia Theme Migration Roadmap
## Fetch → Dawn Migration with Ultimate Flexibility

**Project:** Transform Dawn into the ultimate Shopify theme with Webflow/Elementor-level flexibility
**Source Themes:** Gaia-Fetch (v1.1.2) + Gaia-Fetch-NEW (v5.0.0)
**Target Theme:** Gaia-Dawn (v15.4.1)
**Date:** January 2026

---

## Executive Summary

This document outlines the complete migration strategy to transform Shopify's Dawn theme into a feature-rich, highly customizable theme that combines:
- **Dawn's Performance** - Lightweight, fast-loading foundation
- **Fetch's Features** - Rich sections, textures, advanced customization
- **Fetch-NEW's Architecture** - Modern component patterns, organized snippets
- **Enhanced Flexibility** - Webflow/Elementor-level control for merchants

---

## Theme Analysis Summary

### Current State

| Metric | Gaia-Dawn | Gaia-Fetch | Gaia-Fetch-NEW |
|--------|-----------|------------|----------------|
| Version | 15.4.1 | 1.1.2 | 5.0.0 |
| Sections | 54 | 123 | 71 |
| Templates | 13 | 187 | 18 |
| Snippets | 38 | 88 | 191 |
| Assets | 185 | 36 | 201 |
| Locale Files | 51 | 12 | 12 |
| Settings Groups | 20 | 15 | 14 |

### Key Architectural Differences

1. **Color System**
   - Dawn: `color_scheme_group` with roles (modern OS 2.0)
   - Fetch 1.x: Individual color properties (legacy)
   - Fetch 5.0: `color_scheme_group` with texture support

2. **Typography**
   - Dawn: Scale percentages (100-150%)
   - Fetch: Pixel values with letter-spacing controls

3. **Component Architecture**
   - Dawn: Flat snippet naming
   - Fetch-NEW: Prefixed organization (`block.`, `element.`, `layout.`, etc.)

4. **Unique Fetch Features**
   - Texture overlays (paper, marble, swirl, dots, etc.)
   - Quick View/Quick Add modals
   - Color swatches on grid
   - Advanced product tiles styles
   - Metafield-driven content
   - RTL language support

---

## Phase 1: Discovery & Audit (COMPLETED)

### 1.1 Custom Assets Inventory

#### Fetch-Unique Sections (69 sections not in Dawn)

**Interactive Components:**
- `image-compare` - Before/after image slider
- `hotspots` - Interactive image annotations
- `countdown` - Promotional countdown timer
- `map` / `map-module` - Store locator integration
- `age-verification-popup` - Age gate modal

**Layout Enhancements:**
- `columns-1`, `columns-2`, `columns-3` - Flexible column layouts
- `blocks-in--banner` - Nested content blocks
- `promo-grid` - Promotional grid layouts
- `spacing-sec` - Custom spacing sections
- `scrolling-text` - Marquee text component

**Product Features:**
- `quick-shop-modal` - Quick view functionality
- `quick-add-modal` - Quick add to cart
- `product-recommendations` - Related products
- `recently-viewed` - Recently viewed products
- `store-availability` - Pickup availability
- `product-image-covers` - Cover image overlays

**Blog/Content:**
- `blog-sidebar` - Sidebar navigation
- `article-template` - Article layouts
- `testimonials` - Review carousel

**Marketing:**
- `newsletter-popup` - Exit intent popup
- `footer-promotions` - Footer banners
- `logo-list` - Brand/partner logos
- `hero-video` - Video hero sections

**Brand-Specific (Consider Optional):**
- `ign-*` components (9 sections) - Ignition brand
- `*-meta` sections (12 sections) - Metafield-driven content
- Event/course sections (15 sections) - Vertical-specific

#### Fetch-Unique Snippets

**Essential for Migration:**
- `color-scheme-texture` - Texture overlay system
- `collection-grid-filters` - Advanced filtering
- `quick-shop-modal` / `quick-add-modal` - Quick interactions
- `product-grid-item` - Enhanced product cards
- `variant-button` / `variant-dropdown` - Variant selectors
- `tool-tip` - Tooltip system
- `social-sharing` - Share buttons
- `breadcrumbs` - Navigation breadcrumbs
- `multi-selectors` - Multi-option pickers
- `photoswipe-template` - Lightbox gallery

**Fetch-NEW Modern Patterns:**
- `block.*` components - Modular product blocks
- `element.*` primitives - UI primitives
- `layout.*` wrappers - Layout containers
- `list.*` components - List renderers
- `overlay.*` components - Modal/drawer system
- `utility.*` helpers - CSS utilities

### 1.2 Modified Sections Analysis

Sections existing in both themes but with different implementations:

| Section | Dawn Approach | Fetch Additions |
|---------|---------------|-----------------|
| `header` | Basic nav | Mega menu, promos, search overlay |
| `footer` | Standard links | Multi-column, promotions, images |
| `main-product` | Basic PDP | Tabs, complementary, sticky add-to-cart |
| `main-collection` | Grid only | Sidebar filters, view toggles |
| `featured-collection` | Standard | Quick add, swatches |
| `slideshow` | Basic slides | Split view, video support |
| `newsletter` | Form only | Popup variants, images |
| `contact-form` | Basic | Map integration, hours |

---

## Phase 2: Core Migration

### 2.1 Global Settings & Schema Migration

**Priority: HIGH**

#### Step 2.1.1: Create Merged settings_schema.json

The merged schema will incorporate:

**From Dawn (Keep):**
- Logo settings
- Color scheme groups with roles
- Typography with font pickers and scales
- Layout (page width, spacing)
- Animations (reveal, hover effects)
- Buttons (border, radius, shadow)
- Variant pills styling
- Inputs styling
- Cards (product, collection, blog)
- Content containers
- Media styling
- Popups and drawers
- Badges
- Brand information
- Social media
- Search input
- Currency format
- Cart settings

**From Fetch (Add):**
- Texture system for color schemes
- Advanced typography (letter-spacing, line-height controls)
- Design options (edges, button styles)
- Icon customization (weight, linecaps)
- Product display options (save amount, vendor)
- Product tiles (quick shop, quick add, grid styles)
- Collection tiles (shapes, colors)
- RTL support (text direction)
- Breadcrumbs toggle
- Color swatches

**New Enhancements (Add):**
- Additional color accents
- Extended animation options
- Advanced layout controls (gutters, responsive breakpoints)
- Button icon support
- Custom texture uploads
- Section padding presets

#### Step 2.1.2: Merge settings_data.json

1. Export current Dawn settings
2. Map Fetch setting IDs to new merged IDs
3. Preserve Dawn defaults while adding Fetch values
4. Test in theme editor after merge

### 2.2 Translation Migration

**Priority: HIGH**

#### Step 2.2.1: Locale File Analysis

| Language | Dawn | Fetch | Action |
|----------|------|-------|--------|
| English | en.default.json | en.default.json | Merge |
| German | de.json | de.json | Merge |
| French | fr.json | fr.json | Merge |
| Spanish | es.json | es.json | Merge |
| Italian | it.json | it.json | Merge |
| Portuguese (BR) | pt-BR.json | pt-BR.json | Merge |
| Portuguese (PT) | pt-PT.json | pt-PT.json | Merge |
| Others | 45 files | - | Keep Dawn |

#### Step 2.2.2: Merge Strategy

1. Use Dawn's locale structure as base
2. Add Fetch-specific keys under new namespaces
3. Resolve conflicts (prefer Dawn for OS 2.0 features)
4. Add schema locale files for new settings

### 2.3 Template Migration

**Priority: HIGH**

#### Step 2.3.1: Core Templates (Keep Dawn, Enhance)

```
templates/
├── 404.json                    # Keep Dawn
├── article.json                # Keep Dawn
├── blog.json                   # Keep Dawn
├── cart.json                   # Keep Dawn, add Fetch sections
├── collection.json             # Keep Dawn, add Fetch filters
├── gift_card.liquid            # Keep Dawn
├── index.json                  # Keep Dawn
├── list-collections.json       # Keep Dawn
├── page.json                   # Keep Dawn
├── page.contact.json           # Keep Dawn, add map
├── password.json               # Keep Dawn
├── product.json                # Keep Dawn, add Fetch features
├── search.json                 # Keep Dawn
└── customers/                  # Keep Dawn (all 7 files)
```

#### Step 2.3.2: Add Fetch Template Variants

```
templates/
├── collection.landing.json         # Landing page layout
├── collection.no-sidebar.json      # No sidebar variant
├── collection.filtered.json        # Pre-filtered collection
├── page.about.json                 # About page template
├── page.faq.json                   # FAQ page template
├── page.full-width.json            # Full-width page
├── product.preorder.json           # Preorder product
├── product.bundle.json             # Bundle product
├── product.high-variant.json       # Many variants
├── product.landing.json            # Landing page style
└── search.recently-viewed.liquid   # Search with history
```

**Note:** Consolidate Fetch's 150+ product templates into ~10 variants maximum using metafields for conditional content.

---

## Phase 3: Feature Porting

### 3.1 Section Migration

**Priority: HIGH to MEDIUM**

#### Group A: Essential Sections (Port First)

| Section | Effort | Dependencies |
|---------|--------|--------------|
| `quick-shop-modal` | Medium | Modal system |
| `quick-add-modal` | Medium | Cart AJAX |
| `recently-viewed` | Low | localStorage |
| `product-recommendations` | Low | Product API |
| `countdown` | Low | JavaScript |
| `newsletter-popup` | Medium | Cookie storage |
| `testimonials` | Low | None |
| `logo-list` | Low | None |
| `image-compare` | Medium | Slider library |

#### Group B: Enhancement Sections (Port Second)

| Section | Effort | Dependencies |
|---------|--------|--------------|
| `collection-sidebar` | High | Filter system |
| `blog-sidebar` | Medium | Navigation |
| `hotspots` | Medium | Tooltip system |
| `map-module` | Medium | Map API |
| `scrolling-text` | Low | Animation CSS |
| `footer-promotions` | Low | None |
| `promo-grid` | Medium | Grid system |

#### Group C: Advanced Sections (Port Last)

| Section | Effort | Dependencies |
|---------|--------|--------------|
| `age-verification-popup` | Medium | Cookie, modal |
| `store-availability` | Medium | Inventory API |
| `hero-video` | Medium | Video player |
| `slideshow-split` | Medium | Slider |
| `advanced-content` | High | Multiple blocks |

### 3.2 Snippet Migration

**Priority: CRITICAL**

#### Step 3.2.1: Core Snippets (Required)

```
snippets/
├── color-scheme-texture.liquid     # Texture overlay system
├── breadcrumbs.liquid              # Navigation breadcrumbs
├── quick-shop-modal.liquid         # Quick view modal
├── quick-add-modal.liquid          # Quick add modal
├── product-grid-item.liquid        # Enhanced product card
├── collection-grid-item.liquid     # Collection card
├── variant-button.liquid           # Variant buttons
├── variant-dropdown.liquid         # Variant dropdowns
├── tool-tip.liquid                 # Tooltip component
├── tool-tip-trigger.liquid         # Tooltip trigger
├── social-sharing.liquid           # Share buttons
├── photoswipe-template.liquid      # Lightbox gallery
└── multi-selectors.liquid          # Multi-option UI
```

#### Step 3.2.2: Adopt Fetch-NEW Architecture

Consider restructuring snippets with prefixes:

```
snippets/
├── block.product-*.liquid          # Product blocks
├── element.*.liquid                # UI primitives
├── form.*.liquid                   # Form components
├── header.*.liquid                 # Header components
├── layout.*.liquid                 # Layout wrappers
├── list.*.liquid                   # List renderers
├── overlay.*.liquid                # Modal/drawer system
├── utility.*.liquid                # CSS utilities
└── style.*.liquid                  # Style snippets
```

### 3.3 Asset Migration

**Priority: MEDIUM**

#### Step 3.3.1: CSS Assets

1. Create `custom-fetch.css` for Fetch-specific styles
2. Add to Dawn's `theme.liquid` via `{{ 'custom-fetch.css' | asset_url | stylesheet_tag }}`
3. Scope styles with `.fetch-` prefix to avoid conflicts
4. Include:
   - Texture backgrounds
   - Quick shop/add styles
   - Tooltip styles
   - Enhanced product grid
   - Animation keyframes

#### Step 3.3.2: JavaScript Assets

1. Create `custom-fetch.js` for Fetch-specific functionality
2. Add as deferred script in `theme.liquid`
3. Include:
   - Quick shop/add handlers
   - Recently viewed storage
   - Countdown timer
   - Image compare slider
   - Hotspot interactions
   - Age verification
   - Newsletter popup

#### Step 3.3.3: Texture Images

Port from Fetch's assets:
- `texture-paper.jpg`
- `texture-marble.jpg`
- `texture-space.jpg`
- SVG patterns (swirl, dots, squiggle, wave, etc.)

---

## Phase 4: Enhancement & Polish

### 4.1 Key Feature Reimplementation

#### 4.1.1 Quick Buy / Quick View

**Approach:** Port Fetch's modal system with Dawn's cart integration

```liquid
{%- comment -%} Quick View Flow {%- endcomment -%}
1. Product grid item triggers modal
2. Modal fetches product data via AJAX
3. Render product form with variants
4. Add to cart with instant feedback
5. Update cart drawer/notification
```

#### 4.1.2 Mega Menu / Promos

**Approach:** Enhance Dawn's header with Fetch's mega menu blocks

```liquid
{%- comment -%} Mega Menu Structure {%- endcomment -%}
- Header block: menu-item (with mega menu toggle)
- Mega menu container with columns
- Column types: links, products, images, promos
- Mobile drawer integration
```

#### 4.1.3 Animations & Playful Elements

**Approach:** Combine Dawn's reveal animations with Fetch's additions

New animation options:
- Hover lift effects (vertical, 3D)
- Marquee/scrolling text
- Parallax backgrounds
- Section reveal (fade, slide, scale)
- Button hover states
- Card hover transforms

### 4.2 App Integration

**Priority: MEDIUM**

#### App Blocks Checklist

1. Review all installed apps
2. Verify app block compatibility with Dawn
3. Update app embed locations in theme.liquid
4. Test checkout extensions
5. Verify metafield access

### 4.3 Performance Optimization

**Priority: HIGH**

#### 4.3.1 Asset Optimization

- [ ] Minify all custom CSS/JS
- [ ] Implement critical CSS inline
- [ ] Defer non-critical JavaScript
- [ ] Add resource hints (preconnect, preload)
- [ ] Optimize texture images (WebP, sizing)

#### 4.3.2 Lazy Loading

- [ ] Implement native lazy loading for images
- [ ] Defer below-fold sections
- [ ] Use Intersection Observer for animations
- [ ] Lazy load quick view content

#### 4.3.3 Testing

- [ ] Run Shopify Theme Check
- [ ] Google Lighthouse audit
- [ ] Core Web Vitals testing
- [ ] Mobile performance testing

---

## Phase 5: Merged Settings Schema Specification

### 5.1 Complete Schema Structure

```json
[
  // 1. Theme Info (from Dawn)
  { "name": "theme_info", ... },

  // 2. Logo (from Dawn)
  { "name": "t:settings_schema.logo.name", ... },

  // 3. Colors (MERGED - Dawn base + Fetch textures)
  { "name": "t:settings_schema.colors.name",
    "settings": [
      // Dawn's color_scheme_group with roles
      // + Fetch's texture selectors per scheme
      // + New accent colors
    ]
  },

  // 4. Typography (MERGED - Dawn base + Fetch enhancements)
  { "name": "t:settings_schema.typography.name",
    "settings": [
      // Dawn's font pickers and scales
      // + Fetch's letter-spacing controls
      // + Fetch's line-height controls
      // + Fetch's capitalize options
    ]
  },

  // 5. Layout (MERGED)
  { "name": "t:settings_schema.layout.name",
    "settings": [
      // Dawn's page width and spacing
      // + New gutter controls
      // + New responsive options
    ]
  },

  // 6. Design (NEW from Fetch)
  { "name": "t:settings_schema.design.name",
    "settings": [
      // Fetch's edge style (square/round)
      // Fetch's button style
      // Fetch's icon customization
    ]
  },

  // 7. Animations (MERGED)
  { "name": "t:settings_schema.animations.name",
    "settings": [
      // Dawn's reveal and hover
      // + Fetch's page transitions
      // + New parallax options
    ]
  },

  // 8. Buttons (Dawn + enhancements)
  { "name": "t:settings_schema.buttons.name", ... },

  // 9. Variant Pills (Dawn)
  { "name": "t:settings_schema.variant_pills.name", ... },

  // 10. Inputs (Dawn)
  { "name": "t:settings_schema.inputs.name", ... },

  // 11. Product Cards (MERGED)
  { "name": "t:settings_schema.cards.name",
    "settings": [
      // Dawn's card styling
      // + Fetch's grid styles
      // + Fetch's image margins
    ]
  },

  // 12. Product Tiles (NEW from Fetch)
  { "name": "t:settings_schema.product_tiles.name",
    "settings": [
      // Fetch's quick shop/add
      // Fetch's image size options
      // Fetch's hover image
      // Fetch's swatches
      // Fetch's grid styles
    ]
  },

  // 13. Collection Cards (Dawn)
  { "name": "t:settings_schema.collection_cards.name", ... },

  // 14. Collection Tiles (NEW from Fetch)
  { "name": "t:settings_schema.collection_tiles.name",
    "settings": [
      // Fetch's shape options
      // Fetch's image settings
      // Fetch's color backgrounds
    ]
  },

  // 15. Blog Cards (Dawn)
  { "name": "t:settings_schema.blog_cards.name", ... },

  // 16. Content Containers (Dawn)
  { "name": "t:settings_schema.content_containers.name", ... },

  // 17. Media (Dawn)
  { "name": "t:settings_schema.media.name", ... },

  // 18. Popups (Dawn)
  { "name": "t:settings_schema.popups.name", ... },

  // 19. Drawers (Dawn)
  { "name": "t:settings_schema.drawers.name", ... },

  // 20. Badges (Dawn)
  { "name": "t:settings_schema.badges.name", ... },

  // 21. Products (NEW from Fetch)
  { "name": "t:settings_schema.products.name",
    "settings": [
      // Fetch's price formatting
      // Fetch's save amount display
      // Fetch's vendor toggle
    ]
  },

  // 22. Brand Information (Dawn)
  { "name": "t:settings_schema.brand_information.name", ... },

  // 23. Social Media (MERGED)
  { "name": "t:settings_schema.social-media.name",
    "settings": [
      // Dawn's social links
      // + Fetch's sharing options
    ]
  },

  // 24. Search Input (Dawn + Fetch)
  { "name": "t:settings_schema.search_input.name", ... },

  // 25. Extras (NEW from Fetch)
  { "name": "t:settings_schema.extras.name",
    "settings": [
      // Fetch's breadcrumbs
      // + RTL support
    ]
  },

  // 26. Currency Format (Dawn)
  { "name": "t:settings_schema.currency_format.name", ... },

  // 27. Cart (MERGED)
  { "name": "t:settings_schema.cart.name",
    "settings": [
      // Dawn's cart type
      // + Fetch's additional buttons
      // + Fetch's recommendations
      // + Fetch's terms checkbox
    ]
  },

  // 28. Favicon (Fetch location, Dawn content)
  { "name": "t:settings_schema.favicon.name", ... }
]
```

---

## Implementation Checklist

### Phase 1: Discovery (COMPLETE)
- [x] Analyze Dawn theme structure
- [x] Analyze Fetch theme structure
- [x] Analyze Fetch-NEW theme structure
- [x] Inventory unique Fetch sections
- [x] Inventory unique Fetch snippets
- [x] Document settings schema differences

### Phase 2: Core Migration
- [ ] Create backup of Dawn theme
- [ ] Create merged settings_schema.json
- [ ] Merge settings_data.json
- [ ] Merge locale files
- [ ] Add Fetch template variants
- [ ] Test in theme editor

### Phase 3: Feature Porting
- [ ] Port texture system
- [ ] Port quick shop/add modals
- [ ] Port product grid enhancements
- [ ] Port collection filters
- [ ] Port countdown section
- [ ] Port image compare section
- [ ] Port newsletter popup
- [ ] Port testimonials section
- [ ] Port hotspots section
- [ ] Port recently viewed section
- [ ] Port map integration
- [ ] Port scrolling text

### Phase 4: Enhancement
- [ ] Implement mega menu
- [ ] Add animation options
- [ ] Optimize performance
- [ ] Run Shopify Theme Check
- [ ] Test on mobile devices
- [ ] UAT testing

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Settings conflicts | High | Test each setting group individually |
| JavaScript conflicts | Medium | Namespace all custom JS |
| CSS specificity issues | Medium | Use BEM naming, scope with prefixes |
| Performance regression | High | Benchmark before/after each phase |
| App compatibility | Medium | Test all apps after each phase |
| Mobile breakage | High | Mobile-first testing |
| SEO impact | High | Preserve all meta tags, structured data |

---

## Success Criteria

1. **Functionality:** All Dawn features preserved, Fetch features added
2. **Performance:** Lighthouse score >= 90 on mobile
3. **Editor UX:** All settings functional in theme editor
4. **Compatibility:** All apps working
5. **Responsiveness:** Pixel-perfect on mobile/tablet/desktop
6. **Accessibility:** WCAG 2.1 AA compliance
7. **SEO:** No ranking drops after migration

---

## Appendix A: File Reference

### Key Files to Modify

**Config:**
- `config/settings_schema.json` - Main settings definition
- `config/settings_data.json` - Settings values

**Layout:**
- `layout/theme.liquid` - Add new assets, includes

**Sections (Modify):**
- `sections/header.liquid` - Add mega menu support
- `sections/footer.liquid` - Add promotions
- `sections/main-product.liquid` - Add Fetch features
- `sections/main-collection.liquid` - Add filters

**Sections (Add):**
- All sections from Phase 3.1

**Snippets (Add):**
- All snippets from Phase 3.2

**Assets (Add):**
- `assets/custom-fetch.css`
- `assets/custom-fetch.js`
- `assets/texture-*.{jpg,svg}`

**Templates (Add):**
- All templates from Phase 2.3.2

**Locales (Modify):**
- `locales/en.default.json` - Add Fetch keys
- `locales/en.default.schema.json` - Add setting labels

---

## Appendix B: Settings ID Mapping

| Dawn ID | Fetch ID | Merged ID | Notes |
|---------|----------|-----------|-------|
| `logo` | - | `logo` | Keep Dawn |
| `logo_width` | - | `logo_width` | Keep Dawn |
| `favicon` | `favicon` | `favicon` | Same |
| `color_schemes` | `color_scheme_*_bg/text` | `color_schemes` | Use Dawn format |
| - | `color_scheme_*_texture` | `color_scheme_*_texture` | Add to Dawn |
| `type_header_font` | `type_header_font_family` | `type_header_font` | Keep Dawn ID |
| `heading_scale` | `type_header_base_size` | `heading_scale` | Keep Dawn format |
| - | `type_header_spacing` | `type_header_spacing` | Add new |
| - | `type_header_line_height` | `type_header_line_height` | Add new |
| `page_width` | - | `page_width` | Keep Dawn |
| - | `edges` | `edges` | Add new |
| - | `button_style` | `button_style` | Add new |
| - | `cart_icon` | `cart_icon` | Add new |
| - | `icon_weight` | `icon_weight` | Add new |
| `animations_reveal_on_scroll` | `animate_page_transitions` | Both | Add Fetch |
| - | `quick_shop_enable` | `quick_shop_enable` | Add new |
| - | `quick_add_enable` | `quick_add_enable` | Add new |
| - | `product_grid_image_size` | `product_grid_image_size` | Add new |
| - | `product_hover_image` | `product_hover_image` | Add new |
| - | `enable_swatches` | `enable_swatches` | Add new |
| `cart_type` | `cart_type` | `cart_type` | Merge options |
| - | `show_breadcrumbs` | `show_breadcrumbs` | Add new |
| - | `text_direction` | `text_direction` | Add new (RTL) |

---

*Document Version: 1.0*
*Last Updated: January 2026*
