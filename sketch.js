function scrollToHome() {
    var elem = document.getElementById("home");
    elem.scrollIntoView({ behavior: 'smooth' });
}

function scrollToProjects() {
    var elem = document.getElementById("projects");
    elem.scrollIntoView({ behavior: 'smooth' });
}

function scrollToAboutMe() {
    var elem = document.getElementById("aboutme");
    elem.scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    var elem = document.getElementById("contact");
    elem.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);

const ftdVideo = document.getElementById("ftd-video");
let videoPlayed = false;

window.addEventListener("scroll", () => {
    const rect = ftdVideo.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && !videoPlayed) {
        ftdVideo.play();
        videoPlayed = true;
    } else if (rect.top > windowHeight) {
        ftdVideo.pause();
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

const scrollTopButton = document.getElementById("scroll-top");
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopButton.style.display = "block";
    } else {
        scrollTopButton.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const sloganText = document.getElementById("slogan-text");
    const textContent = "where coding meets creativity";

    let typingTimeouts = [];
    let isTyping = false;

    function typeEffect() {
        typingTimeouts.forEach(clearTimeout);
        typingTimeouts = [];
        isTyping = true;

        sloganText.textContent = "";
        let i = 0;

        function type() {
            if (i < textContent.length) {
                sloganText.textContent += textContent.charAt(i);
                i++;
                const timeout = setTimeout(type, 100);
                typingTimeouts.push(timeout);
            } else {
                isTyping = false;
            }
        }
        type();
    }

    typeEffect();

    const scrollTopButton = document.getElementById("scroll-top");
    scrollTopButton.addEventListener("click", () => {
        if (!isTyping) typeEffect();
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY === 0 && !isTyping) {
            typeEffect();
        }
    });
});
