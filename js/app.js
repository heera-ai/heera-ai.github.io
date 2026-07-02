/**
 * Heera Lal — portfolio
 * Content is static HTML; this file handles navigation, scroll reveals,
 * and the blog (cards from data/posts.json, rendered in a reader overlay).
 */

// ---------- Mobile nav ----------

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

// ---------- Scroll reveal ----------

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.12 });

    document
        .querySelectorAll('.system-card, .project, .post-card, .role, .edu-card, .stack-row')
        .forEach((el) => {
            el.classList.add('reveal');
            observer.observe(el);
        });
}

// ---------- Blog ----------

const blogGrid = document.getElementById('blogGrid');
const reader = document.getElementById('reader');
const readerBody = document.getElementById('readerBody');
const readerClose = document.getElementById('readerClose');

let lastFocused = null;

function openPost(post) {
    lastFocused = document.activeElement;
    readerBody.innerHTML = marked.parse(post.body || '');
    reader.hidden = false;
    document.body.style.overflow = 'hidden';
    readerClose.focus();
}

function closeReader() {
    reader.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
}

readerClose.addEventListener('click', closeReader);
reader.addEventListener('click', (e) => {
    if (e.target === reader) closeReader();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !reader.hidden) closeReader();
});

function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

async function loadPosts() {
    try {
        const res = await fetch('data/posts.json');
        if (!res.ok) throw new Error(res.statusText);
        const posts = await res.json();

        posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach((post) => {
                const card = document.createElement('button');
                card.type = 'button';
                card.className = 'post-card';

                const date = document.createElement('span');
                date.className = 'post-date';
                date.textContent = `${formatDate(post.date)} · ${post.readTime || ''}`.replace(/ · $/, '');

                const title = document.createElement('h3');
                title.textContent = post.title;

                const excerpt = document.createElement('p');
                excerpt.textContent = post.excerpt;

                const read = document.createElement('span');
                read.className = 'post-read';
                read.textContent = 'Read →';

                card.append(date, title, excerpt, read);
                card.addEventListener('click', () => openPost(post));
                blogGrid.appendChild(card);
            });
    } catch {
        const section = document.getElementById('writing');
        if (section) section.style.display = 'none';
    }
}

loadPosts();

// ---------- Footer year ----------

document.getElementById('year').textContent = new Date().getFullYear();
