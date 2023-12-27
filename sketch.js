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



