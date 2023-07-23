//slider

currentSlideID = 1;
sliderElement = document.getElementById("slider");
totalSlides = sliderElement.childElementCount;
function next() {
  if (currentSlideID < totalSlides) {
    currentSlideID++;
    showSlide();
  } else if (currentSlideID == 3) {
    currentSlideID = 1;
    showSlide();
  }
}

function prev() {
  if (currentSlideID > 1) {
    currentSlideID--;
    showSlide();
  }
}

function showSlide() {
  slides = document.getElementById("slider").getElementsByTagName("li");
  for (let index = 0; index < totalSlides; index++) {
    const element = slides[index];
    if (currentSlideID === index + 1) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }
}

setInterval(next, 3000);

//menubar
menu = document.querySelector("#menu-bar");
const backDrop = document.querySelector(".back-drop");

const openmenubar = () => {
  menu.classList.add("right-0");
  menu.classList.remove("right-full");
  backDrop.classList.remove("hidden");
};
const closemenubar = () => {
  menu.classList.add("right-full");
  menu.classList.remove("right-0");
  backDrop.classList.add("hidden");
};

//darkMode and lightMode

//icons
const sunIcon = document.querySelector(".sun");
const moonIcon = document.querySelector(".moon");

//Theme Vars
const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

//Icon Toggling
const iconToggle = () => {
  sunIcon.classList.toggle("hidden");
  moonIcon.classList.toggle("hidden");
};

//Initial Theme Check
const themeCheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moonIcon.classList.add("hidden");
    return;
  }
  sunIcon.classList.add("hidden");
};

//Manual Theme Switch
const themeSwitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    iconToggle();
    return;
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    iconToggle();
  }
};

//call theme swtich on clicking button
sunIcon.addEventListener("click", () => {
  themeSwitch();
});
moonIcon.addEventListener("click", () => {
  themeSwitch();
});

//invoke theme check on initial load
themeCheck();
