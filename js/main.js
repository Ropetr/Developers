/**
 * PLANAC Distribuidora - JavaScript Principal
 * Vanilla JS | Performance Optimized | HTML5.2 Compliant
 */

(function() {
  'use strict';

  // ==========================================================================
  // Configurações
  // ==========================================================================
  
  const CONFIG = {
    carousel: {
      autoplay: true,
      interval: 5000, // 5 segundos
      transitionDuration: 500
    },
    header: {
      hideOnScroll: true,
      hideThreshold: 100
    },
    whatsapp: {
      number: '5543984182582',
      message: 'Olá! Vim pelo site da PLANAC e gostaria de mais informações.'
    },
    phone: '5543984182582',
    location: {
      lat: -23.3045,
      lng: -51.1696,
      address: 'Londrina, PR'
    }
  };

  // ==========================================================================
  // Utilitários
  // ==========================================================================
  
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ==========================================================================
  // Menu Mobile
  // ==========================================================================
  
  class MobileMenu {
    constructor() {
      this.toggle = $('.menu-toggle');
      this.nav = $('.mobile-nav');
      this.isOpen = false;
      
      if (!this.toggle || !this.nav) return;
      
      this.init();
    }
    
    init() {
      // Toggle button click
      this.toggle.addEventListener('click', () => this.toggleMenu());
      
      // Close on link click
      $$('.mobile-nav__link', this.nav).forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeMenu();
        }
      });
      
      // Handle submenu toggles
      $$('.mobile-nav__item--has-submenu', this.nav).forEach(item => {
        const link = item.querySelector('.mobile-nav__link');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          item.classList.toggle('mobile-nav__item--open');
        });
      });
    }
    
    toggleMenu() {
      this.isOpen ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
      this.isOpen = true;
      this.toggle.classList.add('menu-toggle--active');
      this.nav.classList.add('mobile-nav--open');
      document.body.style.overflow = 'hidden';
      this.toggle.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
      this.isOpen = false;
      this.toggle.classList.remove('menu-toggle--active');
      this.nav.classList.remove('mobile-nav--open');
      document.body.style.overflow = '';
      this.toggle.setAttribute('aria-expanded', 'false');
    }
  }

  // ==========================================================================
  // Header Scroll Behavior
  // ==========================================================================
  
  class Header {
    constructor() {
      this.header = $('.header');
      this.lastScrollY = 0;
      this.ticking = false;
      
      if (!this.header) return;
      
      this.init();
    }
    
    init() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
    
    onScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }
    
    update() {
      const scrollY = window.scrollY;
      
      // Hide/show on scroll
      if (CONFIG.header.hideOnScroll) {
        if (scrollY > this.lastScrollY && scrollY > CONFIG.header.hideThreshold) {
          this.header.classList.add('header--hidden');
        } else {
          this.header.classList.remove('header--hidden');
        }
      }
      
      // Transparent on top
      if (scrollY > 50) {
        this.header.classList.remove('header--transparent');
      } else {
        this.header.classList.add('header--transparent');
      }
      
      this.lastScrollY = scrollY;
    }
  }

  // ==========================================================================
  // Carrossel Hero
  // ==========================================================================
  
  class Carousel {
    constructor(element) {
      this.carousel = element;
      this.slides = $('.hero__slides', this.carousel);
      this.slideItems = $$('.hero__slide', this.carousel);
      this.dots = $$('.hero__dot', this.carousel);
      this.prevBtn = $('.hero__arrow--prev', this.carousel);
      this.nextBtn = $('.hero__arrow--next', this.carousel);
      
      this.currentIndex = 0;
      this.totalSlides = this.slideItems.length;
      this.autoplayInterval = null;
      this.isTransitioning = false;
      
      if (this.totalSlides <= 1) return;
      
      this.init();
    }
    
    init() {
      // Dot controls
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });
      
      // Arrow controls
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prev());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.next());
      }
      
      // Touch/swipe support
      this.initTouch();
      
      // Keyboard navigation
      this.carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
      
      // Pause on hover/focus
      this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
      this.carousel.addEventListener('focusin', () => this.stopAutoplay());
      this.carousel.addEventListener('focusout', () => this.startAutoplay());
      
      // Start autoplay
      if (CONFIG.carousel.autoplay) {
        this.startAutoplay();
      }
      
      // Update on visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAutoplay();
        } else {
          this.startAutoplay();
        }
      });
    }
    
    initTouch() {
      let touchStartX = 0;
      let touchEndX = 0;
      
      this.carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      this.carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
      const threshold = 50;
      const diff = startX - endX;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }
    
    goToSlide(index) {
      if (this.isTransitioning || index === this.currentIndex) return;
      
      this.isTransitioning = true;
      this.currentIndex = index;
      
      // Update slides position
      this.slides.style.transform = `translateX(-${index * 100}%)`;
      
      // Update dots
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('hero__dot--active', i === index);
        dot.setAttribute('aria-selected', i === index);
      });
      
      // Update ARIA
      this.slideItems.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== index);
      });
      
      // Reset transition lock
      setTimeout(() => {
        this.isTransitioning = false;
      }, CONFIG.carousel.transitionDuration);
    }
    
    next() {
      const nextIndex = (this.currentIndex + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
    }
    
    prev() {
      const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
      if (!CONFIG.carousel.autoplay || this.autoplayInterval) return;
      
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, CONFIG.carousel.interval);
    }
    
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  }

  // ==========================================================================
  // Formulário de Contato (WhatsApp)
  // ==========================================================================
  
  class ContactForm {
    constructor(form) {
      this.form = form;
      
      if (!this.form) return;
      
      this.init();
    }
    
    init() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Phone mask
      const phoneInput = this.form.querySelector('input[type="tel"]');
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => this.maskPhone(e));
      }
    }
    
    handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);
      
      // Build WhatsApp message
      let message = `Olá! Vim pelo site da PLANAC.\n\n`;
      
      if (data.nome) message += `*Nome:* ${data.nome}\n`;
      if (data.telefone) message += `*Telefone:* ${data.telefone}\n`;
      if (data.email) message += `*E-mail:* ${data.email}\n`;
      if (data.mensagem) message += `\n*Mensagem:*\n${data.mensagem}`;
      
      // Open WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${CONFIG.whatsapp.number}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      this.form.reset();
      
      // Show success feedback
      this.showFeedback('Você será redirecionado para o WhatsApp!');
    }
    
    maskPhone(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)/, '($1');
      }
      
      e.target.value = value;
    }
    
    showFeedback(message) {
      // Simple alert for now, can be enhanced with toast notification
      alert(message);
    }
  }

  // ==========================================================================
  // Footer Mobile Actions
  // ==========================================================================
  
  class FooterMobile {
    constructor() {
      this.phoneBtn = $('.footer-mobile__btn--phone');
      this.locationBtn = $('.footer-mobile__btn--location');
      this.whatsappBtn = $('.footer-mobile__btn--whatsapp');
      
      this.init();
    }
    
    init() {
      if (this.phoneBtn) {
        this.phoneBtn.addEventListener('click', () => this.makeCall());
      }
      
      if (this.locationBtn) {
        this.locationBtn.addEventListener('click', () => this.openLocation());
      }
      
      if (this.whatsappBtn) {
        this.whatsappBtn.addEventListener('click', () => this.openWhatsApp());
      }
    }
    
    makeCall() {
      window.location.href = `tel:+${CONFIG.phone}`;
    }
    
    openLocation() {
      // Google Maps URL
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.location.address)}`;
      window.open(mapsUrl, '_blank');
    }
    
    openWhatsApp() {
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${CONFIG.whatsapp.number}&text=${encodeURIComponent(CONFIG.whatsapp.message)}`;
      window.open(whatsappUrl, '_blank');
    }
  }

  // ==========================================================================
  // Scroll Suave para Âncoras
  // ==========================================================================
  
  class SmoothScroll {
    constructor() {
      this.init();
    }
    
    init() {
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          
          if (href === '#') return;
          
          const target = $(href);
          if (target) {
            e.preventDefault();
            this.scrollTo(target);
          }
        });
      });
    }
    
    scrollTo(element) {
      const headerHeight = $('.header')?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // ==========================================================================
  // Lazy Loading de Imagens (fallback para navegadores antigos)
  // ==========================================================================
  
  class LazyImages {
    constructor() {
      // Verificar se o navegador suporta native lazy loading
      if ('loading' in HTMLImageElement.prototype) {
        return; // Navegador suporta, não precisa de fallback
      }
      
      this.init();
    }
    
    init() {
      const images = $$('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px'
        });
        
        images.forEach(img => observer.observe(img));
      } else {
        // Fallback: carregar todas as imagens
        images.forEach(img => {
          img.src = img.dataset.src || img.src;
        });
      }
    }
  }

  // ==========================================================================
  // Animações ao Scroll
  // ==========================================================================
  
  class ScrollAnimations {
    constructor() {
      this.elements = $$('[data-animate]');
      
      if (!this.elements.length) return;
      
      this.init();
    }
    
    init() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => {
          el.style.opacity = '0';
          observer.observe(el);
        });
      } else {
        // Fallback: mostrar tudo
        this.elements.forEach(el => {
          el.style.opacity = '1';
        });
      }
    }
  }

  // ==========================================================================
  // Inicialização
  // ==========================================================================
  
  function init() {
    // Componentes principais
    new MobileMenu();
    new Header();
    new FooterMobile();
    new SmoothScroll();
    new LazyImages();
    new ScrollAnimations();
    
    // Carrossel
    const heroCarousel = $('.hero__carousel');
    if (heroCarousel) {
      new Carousel(heroCarousel);
    }
    
    // Formulário de contato
    const contactForm = $('#contact-form');
    if (contactForm) {
      new ContactForm(contactForm);
    }
    
    // Log de inicialização (remover em produção)
    console.log('🚀 PLANAC Site initialized');
  }

  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
