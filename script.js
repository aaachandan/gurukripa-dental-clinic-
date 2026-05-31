document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Menu =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const closeMenu = document.getElementById('closeMenu');

  if (hamburger && mobileMenu && overlay) {
    const openMenu = () => {
      mobileMenu.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    const closeMenuFn = () => {
      mobileMenu.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
    overlay.addEventListener('click', closeMenuFn);

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenuFn);
    });
  }

  // ===== Navbar Shadow on Scroll =====
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    if (currentScroll > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    if (currentScroll < lastScroll || currentScroll < 300) {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // ===== Scroll Indicator =====
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  document.body.appendChild(scrollIndicator);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollIndicator.style.width = scrollPercent + '%';
  });

  // ===== Counter Animation =====
  const counterElements = document.querySelectorAll('.stat-num[data-count]');

  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString() + (progress >= 1 ? suffix : '');

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer for counters
  if (counterElements.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ===== Scroll Reveal Animations =====
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up');

  if (animateElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => revealObserver.observe(el));

    // Also observe service cards, testimonial cards, etc. that may not have animation classes
    document.querySelectorAll('.svc-card, .why-card, .timing-card, .test-card, .gallery-item, .step-item, .benefit-item').forEach(el => {
      if (!el.classList.contains('fade-in') && !el.classList.contains('fade-in-up')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
      }
    });
  }

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(f => f.classList.remove('active'));

        // Open clicked if it was closed
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ===== Gallery Filter =====
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryTabs.length && galleryItems.length) {
    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        galleryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => { item.style.opacity = '1'; }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== Lightbox for Gallery =====
  const createLightbox = () => {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.9);
      z-index: 99999; display: flex; align-items: center;
      justify-content: center; opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease; padding: 24px;
    `;
    lightbox.innerHTML = `
      <button class="lightbox-close" style="
        position: absolute; top: 20px; right: 28px;
        background: none; border: none; color: white;
        font-size: 40px; cursor: pointer; opacity: 0.7;
        transition: opacity 0.3s; line-height: 1;
      ">&times;</button>
      <img class="lightbox-img" src="" alt="" style="
        max-width: 90%; max-height: 90vh;
        border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        object-fit: contain;
      ">
      <p class="lightbox-caption" style="
        position: absolute; bottom: 20px; left: 50%;
        transform: translateX(-50%);
        color: white; font-size: 16px; opacity: 0.8;
        text-align: center;
      "></p>
    `;
    document.body.appendChild(lightbox);

    const img = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const openLightbox = (src, alt) => {
      img.src = src;
      img.alt = alt || '';
      caption.textContent = alt || '';
      lightbox.style.opacity = '1';
      lightbox.style.pointerEvents = 'auto';
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.style.opacity = '0';
      lightbox.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    // Attach to gallery items
    document.querySelectorAll('.gallery-item img').forEach(el => {
      el.addEventListener('click', () => {
        const parent = el.closest('.gallery-item');
        const label = parent?.querySelector('.gallery-overlay span')?.textContent || '';
        openLightbox(el.src, label);
      });
    });

    // Attach to before-after images
    document.querySelectorAll('.ba-card .ba-image img, .test-video-thumb img').forEach(el => {
      el.addEventListener('click', () => {
        openLightbox(el.src, el.alt || '');
      });
    });
  };

  if (document.querySelector('.gallery-item img')) {
    createLightbox();
  }

  // ===== Appointment Form Submission =====
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(appointmentForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.phone) {
        showToast('Please fill in name and phone number');
        return;
      }

      // Build WhatsApp message
      const message = `Hello Gurukripa Dental Clinic! I want to book an appointment.

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || 'N/A'}
Date: ${data.date || 'N/A'}
Time: ${data.time || 'N/A'}
Treatment: ${data.treatment || 'N/A'}
Message: ${data.message || 'N/A'}`;

      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917470567833?text=${encoded}`;

      showToast('Redirecting to WhatsApp...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    });
  }

  // ===== Contact Form =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      if (!data.name || !data.phone) {
        showToast('Please fill in name and phone number');
        return;
      }

      const message = `Hello Gurukripa Dental Clinic! New inquiry.

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || 'N/A'}
Message: ${data.message || 'N/A'}`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/917470567833?text=${encoded}`, '_blank');
      showToast('Opening WhatsApp...');
    });
  }

  // ===== Toast Notification =====
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Lazy Loading Images with Intersection Observer =====
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }
});