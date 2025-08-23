document.body.classList.add('loading');

let homeAnimationShown = false;

function loadPage(page, updateNav = false) {
    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            const contentElement = document.getElementById('content');
            contentElement.innerHTML = html;
            
            if (page === 'home' && !homeAnimationShown) {
                homeAnimationShown = true;
                contentElement.querySelectorAll('.fade-in, .ornament').forEach(el => {
                    el.style.opacity = '0';
                });
                
                const title = contentElement.querySelector('.page-title');
                if (title) {
                    title.style.visibility = 'visible';
                    title.style.opacity = '0';
                }
                
                setTimeout(() => {
                    startHomeAnimation();
                }, 100);
            } else {
                document.body.classList.remove('loading');
                document.getElementById('content').style.opacity = 1;
                contentElement.querySelectorAll('.fade-in, .ornament').forEach(el => {
                    el.style.opacity = '1';
                });
            }
            
            window.scrollTo(0, 0);
            
            if (updateNav) {
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.toggle('active', navLink.getAttribute('data-page') === page);
                });
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

let animationInProgress = false;
let animationTimeouts = [];

function startHomeAnimation() {
  const content = document.getElementById('content');
  const title = content.querySelector('.page-title');
  const ornament = content.querySelector('.ornament');
  const fadeElements = content.querySelectorAll('.fade-in');

  if (!title) {
    console.error("Page title not found, skipping animation");
    showContentDirectly();
    return;
  }

  animationInProgress = true;

  // Remove any leftover motto from a previous run (safety)
  content.querySelectorAll('.motto').forEach(n => n.remove());

  const motto = document.createElement('div');
  motto.className = 'motto';
  motto.innerHTML = `
    <span class="motto-word">The meagre by the meagre were devour'd,</span><br>
    <span class="motto-word">Even dogs assail'd their masters, all save one,</span><br>
    <span class="motto-word">And he was </span><br>
  `;
  content.insertBefore(motto, content.firstChild);

  title.style.visibility = 'visible';
  title.style.opacity = '0';
  title.style.transition = 'opacity 1.5s ease';

  if (ornament) ornament.style.opacity = '0';
  fadeElements.forEach(el => el.style.opacity = '0');

  const mottoWords = motto.querySelectorAll('.motto-word');
  mottoWords.forEach((word, index) => {
    animationTimeouts.push(setTimeout(() => {
      word.style.opacity = '1';
    }, 800 + (index * 2250)));
  });

  animationTimeouts.push(setTimeout(() => {
    motto.style.transition = 'opacity 1.2s ease';
    motto.style.opacity = '0';

    animationTimeouts.push(setTimeout(() => {
      motto.remove();
      title.style.opacity = '1';

      animationTimeouts.push(setTimeout(() => {
        document.body.classList.remove('loading');
        if (ornament) {
          ornament.style.transition = 'opacity 1s ease';
          ornament.style.opacity = '1';
        }
        animationTimeouts.push(setTimeout(() => {
          fadeElements.forEach(el => {
            el.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            el.style.opacity = '1';
          });
        }, 0));
        animationInProgress = false;
      }, 1500));
    }, 1500));
  }, 7500));
}

function cancelAnimationAndShowContent() {
  if (!animationInProgress) return;

  // 1) Stop timers
  animationTimeouts.forEach(clearTimeout);
  animationTimeouts = [];
  animationInProgress = false;

  // 2) Hard-remove any motto(s) currently on screen
  document.querySelectorAll('#content .motto').forEach(node => {
    // cancel any running transitions by swapping with a clone, then remove
    const clone = node.cloneNode(true);
    node.replaceWith(clone);
    clone.remove();
  });

  // 3) Reveal everything normally
  showContentDirectly();
}

document.getElementById('content').addEventListener('click', cancelAnimationAndShowContent);

function showContentDirectly() {
    document.body.classList.remove('loading');
    const title = document.querySelector('.page-title');
    const ornament = document.querySelector('.ornament');
    
    if (title) {
        title.style.visibility = 'visible';
        title.style.opacity = '1';
    }
    
    if (ornament) ornament.style.opacity = '1';
    
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '1';
    });
}

function animatePageTitle() {
    const title = document.querySelector('#content .page-title');
    if (title) {
        title.style.visibility = 'visible';
        title.style.opacity = '1';
    }
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        loadPage(page, true);
    });
});

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

window.addEventListener('DOMContentLoaded', () => {
    loadPage('home', true);
});
