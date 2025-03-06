// Add loading class to body initially
document.body.classList.add('loading');

let homeAnimationShown = false;

// Load page content dynamically
function loadPage(page, updateNav = false) {
    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            const contentElement = document.getElementById('content');
            contentElement.innerHTML = html;
            
            // Special animation for home page only
            if (page === 'home' && !homeAnimationShown) {
                homeAnimationShown = true;
                // Ensure all content is initially hidden
                contentElement.querySelectorAll('.fade-in, .ornament').forEach(el => {
                    el.style.opacity = '0';
                });
                
                // Hide title initially
                const title = contentElement.querySelector('.page-title');
                if (title) {
                    // Make title visible but transparent (important!)
                    title.style.visibility = 'visible';
                    title.style.opacity = '0';
                }
                
                // Start the animation sequence
                setTimeout(() => {
                    startHomeAnimation();
                }, 100);
            } else {
                // For other pages, just show content normally
                document.body.classList.remove('loading');
                document.getElementById('content').style.opacity = 1;
                // animatePageTitle();
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

// Complete home page animation sequence
function startHomeAnimation() {
    
    const content = document.getElementById('content');
    const title = content.querySelector('.page-title');
    const ornament = content.querySelector('.ornament');
    const fadeElements = content.querySelectorAll('.fade-in');
    
    // Make sure we have the required elements
    if (!title) {
        console.error("Page title not found, skipping animation");
        showContentDirectly();
        return;
    }
    
    
    // Step 1: Add motto to the page
    const motto = document.createElement('div');
    motto.className = 'motto';
    motto.innerHTML = `
		</span> <span class="motto-word">The meagre by the meagre were devour'd,</span> <br> 
		</span> <span class="motto-word">Even dogs assail'd their masters, all save one,</span> <br>
		</span> <span class="motto-word">And he was </span> <br>
		`; 

    // <span class="motto-word">is</span> <span class="motto-word">to</span> <span class="motto-word">remain</span>';
    content.insertBefore(motto, content.firstChild);
    
    // Step 2: Ensure everything is hidden initially but visible
    title.style.visibility = 'visible';
    title.style.opacity = '0';
    title.style.transition = 'opacity 1.5s ease';
    
    if (ornament) {
        ornament.style.opacity = '0';
    }
    
    fadeElements.forEach(el => el.style.opacity = '0');
    
    // Step 3: Animate motto words
    const mottoWords = motto.querySelectorAll('.motto-word');
    mottoWords.forEach((word, index) => {
        setTimeout(() => {
            word.style.opacity = '1';
        }, 800 + (index * 2250));
    });
    
    // Step 4: Fade out motto
    setTimeout(() => {
        // Make sure motto has a transition property
        motto.style.transition = 'opacity 1.2s ease';
        motto.style.opacity = '0';
        
        setTimeout(() => {
            // Remove motto after it's faded out
            motto.remove();
            
            // Step 5: Fade in title as a whole
            title.style.opacity = '1';
            
            // Step 6: After title appears, show nav bar and content
            setTimeout(() => {
                // Show the header
                document.body.classList.remove('loading');
                
                // Fade in ornament and content
                if (ornament) {
                    ornament.style.transition = 'opacity 1s ease';
                    ornament.style.opacity = '1';
                }
               
                setTimeout(900);
                // Fade in the rest of the content
                setTimeout(() => {
                    fadeElements.forEach(el => {
                        el.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
                        el.style.opacity = '1';
                    });
                }, 0);
                
            }, 1500); // 1.5 seconds after title appears
            
        }, 1500); // Time to allow motto to fade out completely
    }, 7500); // Time before motto starts fading out
}

// Fallback function if animation fails
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

// Standard animate page title (for non-home pages)
function animatePageTitle() {
    const title = document.querySelector('#content .page-title');
    if (title) {
        title.style.visibility = 'visible';
        title.style.opacity = '1';
    }
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

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    loadPage('home', true);
});
