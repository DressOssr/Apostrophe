export default () => {
  apos.util.onReady(() => {
    const widgets = document.querySelectorAll('[data-faq-widget]');

    widgets.forEach((widget) => {
      if (widget.dataset.faqBound === 'true') {
        return;
      }

      widget.dataset.faqBound = 'true';

      widget.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-faq-trigger]');
        if (!trigger || !widget.contains(trigger)) {
          return;
        }

        const item = trigger.closest('[data-faq-item]');
        if (!item) {
          return;
        }

        const content = item.querySelector('[data-faq-content]');
        const icon = item.querySelector('[data-faq-icon]');
        if (!content) {
          return;
        }

        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Accordion behavior: close all other items first.
        widget.querySelectorAll('[data-faq-item]').forEach((otherItem) => {
          const otherTrigger = otherItem.querySelector('[data-faq-trigger]');
          const otherContent = otherItem.querySelector('[data-faq-content]');
          const otherIcon = otherItem.querySelector('[data-faq-icon]');

          if (!otherTrigger || !otherContent) {
            return;
          }

          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.classList.add('hidden');
          if (otherIcon) {
            otherIcon.classList.remove('rotate-45');
          }
        });

        // If clicked item was closed, open it. If open, keep all closed.
        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          content.classList.remove('hidden');
          if (icon) {
            icon.classList.add('rotate-45');
          }
        }
      });
    });
  });
};
