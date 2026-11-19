const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setUpTicker(viewport) {
    const track = viewport.querySelector('.ticker__track');
    const group = track.querySelector('.ticker__group');
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    track.append(copy);

    let animation;
    let visible = false;
    let distance = 0;

    function updatePlayback() {
        if (!animation) return;
        if (visible && !document.hidden) animation.play();
        else animation.pause();
    }

    function measure() {
        const width = group.getBoundingClientRect().width;
        if (reducedMotion.matches) {
            animation?.cancel();
            animation = undefined;
            copy.hidden = true;
            return;
        }
        copy.hidden = false;
        if (!width || (animation && width === distance)) return;
        const previousTime = animation?.currentTime || 0;
        animation?.cancel();
        distance = width;
        animation = track.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-' + distance + 'px)' }
        ], { duration: distance / 50 * 1000, iterations: Infinity });
        animation.currentTime = previousTime;
        updatePlayback();
    }

    new ResizeObserver(measure).observe(group);
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
    }).observe(viewport);
    document.addEventListener('visibilitychange', updatePlayback);
    reducedMotion.addEventListener('change', measure);
    measure();
}

document.querySelectorAll('[data-ticker]').forEach(setUpTicker);

const galleryDialog = document.querySelector('#gallery-lightbox');
const galleryDialogPhoto = galleryDialog.querySelector('.gallery-lightbox__image');

document.querySelectorAll('.gallery-photo').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof galleryDialog.showModal !== 'function') return;

        event.preventDefault();
        galleryDialogPhoto.src = link.href;
        galleryDialogPhoto.alt = link.querySelector('img').alt;
        galleryDialog.showModal();
    });
});

galleryDialog.addEventListener('click', () => galleryDialog.close());

const testimonialViewport = document.querySelector('.community__scroll');
const testimonialList = testimonialViewport.querySelector('.testimonial-list');
const marqueePreference = window.matchMedia('(min-width: 701px) and (prefers-reduced-motion: no-preference)');
let testimonialClone;
let frame = 0;
let isVisible = false;
let previousTime = 0;
let carriedDistance = 0;

function advanceTestimonials(time) {
    if (previousTime) {
        carriedDistance += Math.min(time - previousTime, 100) * 0.05;
        const pixels = Math.floor(carriedDistance);
        if (pixels) {
            testimonialViewport.scrollLeft = (testimonialViewport.scrollLeft + pixels) % testimonialList.offsetWidth;
            carriedDistance -= pixels;
        }
    }

    previousTime = time;
    frame = requestAnimationFrame(advanceTestimonials);
}

function updateTestimonialPlayback() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    const paused = testimonialViewport.matches(':hover, :focus-within');
    if (testimonialClone && isVisible && !document.hidden && !paused) {
        frame = requestAnimationFrame(advanceTestimonials);
    }
}

function configureTestimonials() {
    testimonialClone?.remove();
    testimonialClone = null;
    if (marqueePreference.matches) {
        testimonialClone = testimonialList.cloneNode(true);
        testimonialClone.setAttribute('aria-hidden', 'true');
        testimonialClone.inert = true;
        testimonialViewport.append(testimonialClone);
        testimonialViewport.scrollLeft = Math.max(0, (testimonialList.offsetWidth - testimonialViewport.clientWidth) / 2);
    } else {
        testimonialViewport.scrollLeft = 0;
    }

    updateTestimonialPlayback();
}

new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    updateTestimonialPlayback();
}).observe(testimonialViewport);

marqueePreference.addEventListener('change', configureTestimonials);
document.addEventListener('visibilitychange', updateTestimonialPlayback);
for (const event of ['mouseenter', 'mouseleave', 'focusin', 'focusout']) {
    testimonialViewport.addEventListener(event, () => requestAnimationFrame(updateTestimonialPlayback));
}
configureTestimonials();
