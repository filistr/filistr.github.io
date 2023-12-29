function scrollToHome() { 
    var elem = document.getElementById("home"); 
    elem.scrollIntoView({behavior: 'smooth'}); 
} 

function scrollToProjects() { 
    var elem = document.getElementById("projects"); 
    elem.scrollIntoView({behavior: 'smooth'}); 
} 

function scrollToAboutMe() { 
    var elem = document.getElementById("aboutme"); 
    elem.scrollIntoView({behavior: 'smooth'}); 
} 

function scrollToContact() { 
    var elem = document.getElementById("contact"); 
    elem.scrollIntoView({behavior: 'smooth'}); 
} 

window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
  }, false);

  const ftdVideo = document.getElementById("ftd-video");
let videoPlayed = false;

window.addEventListener("scroll", () => {
    const rect = ftdVideo.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Check if the video is in the viewport and hasn't been played yet
    if (rect.top <= windowHeight && !videoPlayed) {
        ftdVideo.play();
        videoPlayed = true;
    } else if (rect.top > windowHeight) {
        // Pause the video if it goes out of view
        ftdVideo.pause();
    }
});


