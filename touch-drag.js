// touch-drag.js
// Requires Interact.js via CDN: https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js

interact('.draggable').draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrict({
      restriction: 'parent',
      endOnly: true,
    })
  ],
  listeners: {
    start (event) {
      event.target.classList.add('dragging');
    },
    move (event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    },
    end (event) {
      event.target.classList.remove('dragging');
    }
  }
});

interact('.drop-zone, .drop-cell').dropzone({
  accept: '.draggable',
  overlap: 0.5,
  ondragenter (event) {
    event.target.classList.add('drop-target');
  },
  ondragleave (event) {
    event.target.classList.remove('drop-target');
  },
  ondrop (event) {
    const draggable = event.relatedTarget;
    const dropzone = event.target;

    if (dropzone.children.length > 0) {
      const existing = dropzone.firstElementChild;
      const original = document.querySelector(`.drag-bank .draggable:not([data-x])`);
      if (original) original.parentElement.appendChild(existing);
    }

    dropzone.appendChild(draggable);
    draggable.style.transform = 'none';
    draggable.removeAttribute('data-x');
    draggable.removeAttribute('data-y');
  },
  ondropdeactivate (event) {
    event.target.classList.remove('drop-target');
  }
});

// Prevent scrolling while dragging on touch devices
document.body.addEventListener('touchmove', e => {
  if (document.querySelector('.dragging')) {
    e.preventDefault();
  }
}, { passive: false });
