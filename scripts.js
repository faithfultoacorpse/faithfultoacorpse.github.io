// Load page content dynamically
function loadPage(page, updateNav = false) {
    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('content').innerHTML = html;
            console.log('Content loaded for: ', page);
            animatePageTitle();
            window.scrollTo(0, 0);
            handleScrollAnimation();
            if (updateNav) {
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.toggle('active', navLink.getAttribute('data-page') === page);
                });
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

// Handle navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        loadPage(page, true);
    });
});

// Event delegation for links within content
document.getElementById('content').addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('writing-link')) {
        e.preventDefault();
        const article = target.getAttribute('data-article');
        loadPage(article, false);
    } else if (target.classList.contains('page-link')) {
        e.preventDefault();
        const page = target.getAttribute('data-page');
        loadPage(page, true);
    }
});

// Animate page title
function animatePageTitle() {
    const title = document.querySelector('#content .page-title');
    if (title) {
        title.style.visibility = 'visible';
        title.innerHTML = title.textContent.split('').map(char =>
            char === ' ' ? '<span class="char">&nbsp;</span>' : `<span class="char">${char}</span>`
        ).join('');
        const chars = title.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.style.animationName = 'fadeInChar';
            char.style.animationDuration = '0.6s';
            char.style.animationDelay = `${index * 50}ms`;
            char.style.animationTimingFunction = 'ease-out';
        });
    }
}

// Handle scroll animations
function handleScrollAnimation() {
    const fadeElements = document.querySelectorAll('#content .fade-in');
    const windowHeight = window.innerHeight;
    fadeElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const offset = 100;
        element.classList.toggle('visible', elementPosition < windowHeight - offset);
    });
}

// Initial load and event listeners
window.addEventListener('load', () => {
    loadPage('home', true);
    handleScrollAnimation();
});
window.addEventListener('scroll', handleScrollAnimation);
