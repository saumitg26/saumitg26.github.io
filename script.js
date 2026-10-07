/**
 * Saumit Guduguntla — Portfolio Interactions
 * Features:
 * - Interactive Menu Drawer (Plutonicsauce style with numbered sections)
 * - Dynamic Section Tracker & Scroll Spy (01 Projects, 02 Awards, 03 Skills, 04 Contact)
 * - Fluid Project Category Filter (All / Applied AI / Cloud / Security / Mobile)
 * - Interactive Awards Timeline & Technical Jump Links
 * - Interactive Tech Arsenal & Live System Linkage Inspector
 * - Cross-Section Jump with Visual Flash Highlight
 * - 1-Click Clipboard Email Copy (write2saumitg@gmail.com) with Toast
 * - Dynamic Copyright Year
 * - Subtle Navbar Scroll Elevation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Menu Drawer
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const menuWord = document.getElementById('menuWord');
  const mainEl = document.querySelector('main');
  const footerEl = document.querySelector('footer');

  function setMenu(open) {
    if (!menuToggle || !navDrawer) return;

    menuToggle.setAttribute('aria-expanded', String(open));
    navDrawer.classList.toggle('open', open);

    if (open) {
      navDrawer.removeAttribute('inert');
      if (mainEl) mainEl.setAttribute('inert', '');
      if (footerEl) footerEl.setAttribute('inert', '');
      document.body.style.overflow = 'hidden';
      if (menuWord) menuWord.textContent = 'CLOSE';
      const firstLink = navDrawer.querySelector('.drawer-link');
      if (firstLink) firstLink.focus();
    } else {
      navDrawer.setAttribute('inert', '');
      if (mainEl) mainEl.removeAttribute('inert');
      if (footerEl) footerEl.removeAttribute('inert');
      document.body.style.overflow = '';
      if (menuWord) menuWord.textContent = 'MENU';
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isExpanded);
    });
  }

  // Close drawer when any link inside drawer is clicked
  if (navDrawer) {
    const drawerLinks = navDrawer.querySelectorAll('.drawer-link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenu(false);
      });
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // 2. Dynamic Section Tracker & Scroll Spy
  const sections = [
    { id: 'home', num: '00', title: 'HOME', next: 'projects' },
    { id: 'projects', num: '01', title: 'PROJECTS', next: 'awards' },
    { id: 'awards', num: '02', title: 'AWARDS', next: 'skills' },
    { id: 'skills', num: '03', title: 'ARSENAL', next: 'contact' },
    { id: 'contact', num: '04', title: 'CONNECT', next: 'home' }
  ];

  const trackerNum = document.getElementById('trackerNum');
  const trackerTitle = document.getElementById('trackerTitle');
  const headerTracker = document.getElementById('headerTracker');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveSection() {
    const scrollPos = window.scrollY + 140;
    let currentSection = sections[0];

    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = sec;
        } else if (scrollPos >= top) {
          currentSection = sec;
        }
      }
    });

    // Update Header Tracker
    if (trackerNum && trackerTitle && headerTracker) {
      trackerNum.textContent = currentSection.num;
      trackerTitle.textContent = currentSection.title;
      headerTracker.setAttribute('href', `#${currentSection.next}`);
    }

    // Update Desktop Nav Active Links
    desktopNavLinks.forEach(link => {
      const targetSec = link.getAttribute('data-section');
      if (targetSec === currentSection.id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // 3. Fluid Project Category Filter
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectEntries = document.querySelectorAll('.project-entry');

  function applyProjectFilter(filterValue) {
    filterTabs.forEach(t => {
      if (t.getAttribute('data-filter') === filterValue) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    projectEntries.forEach(entry => {
      const category = entry.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
        entry.classList.remove('hidden-project');
        entry.style.opacity = '0';
        setTimeout(() => {
          entry.style.opacity = '1';
        }, 30);
      } else {
        entry.classList.add('hidden-project');
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');
      applyProjectFilter(filterValue);
    });
  });

  // 4. Interactive Tech Category Filter
  const techTabs = document.querySelectorAll('.tech-tab');
  const techChips = document.querySelectorAll('.tech-chip');

  techTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      techTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-tech-filter');

      techChips.forEach(chip => {
        const cat = chip.getAttribute('data-tech-cat');
        if (filter === 'all' || cat === filter) {
          chip.classList.remove('hidden-chip');
        } else {
          chip.classList.add('hidden-chip');
        }
      });
    });
  });

  // 5. Interactive Live System Linkage Inspector
  const techInspector = document.getElementById('techInspector');
  const inspectorName = document.getElementById('inspectorName');
  const inspectorTag = document.getElementById('inspectorTag');
  const inspectorDesc = document.getElementById('inspectorDesc');
  const inspectorAction = document.getElementById('inspectorAction');
  const inspectorJumpBtn = document.getElementById('inspectorJumpBtn');
  const inspectorJumpText = document.getElementById('inspectorJumpText');

  const defaultInspectorState = {
    name: 'Select a technology above',
    tag: '',
    desc: 'Hover over or tap any technology above to see where Saumit applied it across hackathon-winning architectures, production systems, and security tooling.',
    target: ''
  };

  function updateInspector(name, tag, desc, target) {
    if (!techInspector || !inspectorName || !inspectorDesc) return;

    inspectorName.textContent = name;
    inspectorDesc.textContent = desc;

    if (tag && inspectorTag) {
      inspectorTag.textContent = tag;
      inspectorTag.style.display = 'inline-block';
    } else if (inspectorTag) {
      inspectorTag.style.display = 'none';
    }

    if (target && inspectorAction && inspectorJumpBtn) {
      inspectorAction.style.display = 'block';
      inspectorJumpBtn.setAttribute('href', `#${target}`);
      inspectorJumpBtn.setAttribute('data-target-id', target);
      if (inspectorJumpText) {
        inspectorJumpText.textContent = `Jump to ${name} in Projects`;
      }
    } else if (inspectorAction) {
      inspectorAction.style.display = 'none';
    }

    techInspector.classList.add('highlight');
  }

  techChips.forEach(chip => {
    const name = chip.getAttribute('data-name');
    const tag = chip.getAttribute('data-tag');
    const desc = chip.getAttribute('data-desc');
    const target = chip.getAttribute('data-target');

    function activateChip() {
      techChips.forEach(c => c.classList.remove('active-chip'));
      chip.classList.add('active-chip');
      updateInspector(name, tag, desc, target);
    }

    chip.addEventListener('mouseenter', activateChip);
    chip.addEventListener('focus', activateChip);

    // Clicking a tech chip jumps directly to the project if target exists
    chip.addEventListener('click', () => {
      activateChip();
      if (target) {
        jumpAndHighlight(target);
      }
    });
  });

  // 6. Cross-Section Jump with Visual Flash Highlight
  function jumpAndHighlight(targetId) {
    if (!targetId) return;

    // Ensure target project is visible if it was filtered out
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // If target is inside projects, reset filter to 'all' so it's not hidden
    if (targetEl.classList.contains('project-entry')) {
      applyProjectFilter('all');
    }

    // Scroll smoothly to target
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Trigger visual pulse highlight
    document.querySelectorAll('.highlight-pulse').forEach(el => el.classList.remove('highlight-pulse'));
    setTimeout(() => {
      targetEl.classList.add('highlight-pulse');
    }, 200);

    setTimeout(() => {
      targetEl.classList.remove('highlight-pulse');
    }, 2700);
  }

  // Bind all timeline jump buttons
  document.querySelectorAll('.timeline-jump-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-project-target');
      if (target) {
        e.preventDefault();
        jumpAndHighlight(target);
      }
    });
  });

  // Bind inspector jump button
  if (inspectorJumpBtn) {
    inspectorJumpBtn.addEventListener('click', (e) => {
      const target = inspectorJumpBtn.getAttribute('data-target-id');
      if (target) {
        e.preventDefault();
        jumpAndHighlight(target);
      }
    });
  }

  // 7. 1-Click Clipboard Email Copy (write2saumitg@gmail.com)
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast');
  const emailToCopy = 'write2saumitg@gmail.com';
  let toastTimer = null;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        showToast(`Copied ${emailToCopy} to clipboard!`);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${emailToCopy} to clipboard!`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;

    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 8. Dynamic Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 9. Navbar Elevation on Scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
      navbar.style.background = 'rgba(6, 8, 9, 0.95)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      navbar.style.background = 'rgba(6, 8, 9, 0.88)';
    }
  }, { passive: true });
});
