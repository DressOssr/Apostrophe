export default () => {
  apos.util.onReady(() => {
    const trigger = document.querySelector('[data-mobile-trigger]');
    const nav = document.querySelector('[data-mobile-nav]');
    const closeTrigger = document.querySelector('[data-mobile-close-trigger]');

    if (!trigger) {
      return;
    }

    trigger.addEventListener('click', toggleMenu);
    closeTrigger.addEventListener('click', handleClose);

    function toggleMenu() {
      const state = nav.dataset.mobileNav;
      if (state === 'hidden') {
        nav.dataset.mobileNav = 'visible';
        nav.classList.remove('hidden');
        nav.classList.add('flex');
        document.body.addEventListener('keydown', handleClose);
      } else {
        nav.dataset.mobileNav = 'hidden';
        nav.classList.remove('flex');
        nav.classList.add('hidden');
        document.body.removeEventListener('keydown', handleClose);
      }
      nav.setAttribute(
        'aria-hidden',
        nav.getAttribute('aria-hidden') === 'true' ? 'false' : 'true',
      );
      nav.classList.toggle('active');
    }

    function handleClose(e) {
      if (!e.key || e.key === 'Escape') {
        nav.classList.remove('active');
        nav.classList.remove('flex');
        nav.classList.add('hidden');
        nav.dataset.mobileNav = 'hidden';
        nav.setAttribute('aria-hidden', 'true');
        document.body.removeEventListener('keydown', handleClose);
      }
    }
  });
};
