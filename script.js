/* =========================================================
   Portfolio — dynamic behavior + 3D
   ========================================================= */
import * as THREE from 'three';

(() => {
  'use strict';

  /* ---------- Page-load fade ---------- */
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (localStorage.getItem('theme') === 'light') root.setAttribute('data-theme', 'light');
  themeBtn?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) { root.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
    else { root.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
  });

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  burger?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  /* ---------- Nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link (home page) ---------- */
  if (document.body.dataset.page === 'home') {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
    const activateLink = () => {
      const y = window.scrollY + 120;
      let current = '';
      sections.forEach(s => {
        if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) current = s.id;
      });
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
      });
    };
    window.addEventListener('scroll', activateLink, { passive: true });
    activateLink();
  }

  /* ---------- Word rotator ---------- */
  const rotator = document.getElementById('rotator');
  if (rotator) {
    const words = ['decisions', 'AI insights', 'dashboards', 'grounded answers'];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        rotator.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1600); return; }
      } else {
        rotator.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 40 : 90);
    };
    tick();
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = el => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400, start = performance.now();
    const step = t => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.hero__inner, .hero__canvas-wrap, .page-hero__inner, .section__head, ' +
    '.about__copy, .about__card, .skill-card, .work-card, .project, ' +
    '.service, .contact, .cta'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.classList.contains('hero__inner')) counters.forEach(runCounter);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- 3D tilt on cards ---------- */
  const tilts = document.querySelectorAll('[data-tilt]');
  tilts.forEach(el => {
    const max = parseFloat(el.dataset.tiltMax || '10');
    let rafId = null;

    const onMove = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * max;
      const ry = (x - 0.5) * max;

      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      });
    };
    const onEnter = () => el.classList.add('is-hover');
    const onLeave = () => {
      el.classList.remove('is-hover');
      el.style.transform = '';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

  /* ---------- Contact form (mailto handoff) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = 'Please fill all fields.';
      note.style.color = '#ef4444';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = 'Please enter a valid email.';
      note.style.color = '#ef4444';
      return;
    }
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:guptashaswat99@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email client…';
    note.style.color = '';
    form.reset();
  });

  /* =========================================================
     Three.js hero scene — wireframe icosahedron + points
     ========================================================= */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const scene = new THREE.Scene();
    const getAccent = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7cf0c0';
      return new THREE.Color(c);
    };
    const getAccent2 = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#6aa9ff';
      return new THREE.Color(c);
    };

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialiased: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    // Wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.35, 1);
    const wireMat = new THREE.LineBasicMaterial({
      color: getAccent(), transparent: true, opacity: 0.85
    });
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), wireMat);
    group.add(wire);

    // Solid ghost shell
    const shellMat = new THREE.MeshBasicMaterial({
      color: getAccent2(), transparent: true, opacity: 0.06, side: THREE.DoubleSide
    });
    const shell = new THREE.Mesh(geo, shellMat);
    group.add(shell);

    // Inner rotating ring of points
    const pGeo = new THREE.BufferGeometry();
    const pCount = 140;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = 1.9 + Math.random() * 0.3;
      const y = (Math.random() - 0.5) * 0.4;
      positions[i * 3]     = Math.cos(t) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(t) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: getAccent(), size: 0.03, transparent: true, opacity: 0.7
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // Inner small dot core
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshBasicMaterial({ color: getAccent() })
    );
    group.add(core);

    // Resize
    const resize = () => {
      const size = canvas.clientWidth;
      if (!size) return;
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse parallax
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      ty = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    // React to theme changes (MutationObserver on <html data-theme>)
    const themeObs = new MutationObserver(() => {
      wireMat.color = getAccent();
      shellMat.color = getAccent2();
      pMat.color = getAccent();
      core.material.color = getAccent();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Animate
    const clock = new THREE.Clock();
    const loop = () => {
      const t = clock.getElapsedTime();
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;

      group.rotation.y = t * 0.2 + cx;
      group.rotation.x = Math.sin(t * 0.3) * 0.15 + cy;
      points.rotation.y = -t * 0.3;
      core.scale.setScalar(1 + Math.sin(t * 2) * 0.1);

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
  }
})();
