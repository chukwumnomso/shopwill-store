import "./style.css";
import { uploadproduct } from "./prodUpload";
import { renderProduct } from "./prodUpload";
import { currentPage } from "./prodUpload";

const closeBtn = document.getElementById("close");

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    const admin = document.getElementById("admin");
    renderProduct(currentPage);
    admin.style.display = "none";
  });
}

const nav = document.getElementById("navbar");
if (nav) {
  nav.addEventListener("click", () => {
    const admin = document.getElementById("admin");
    admin.style.display = "block";
  });
}

export function price() {
  const price = document.getElementById("price").value;

  return price;
}

export function prodName() {
  const prodName = document.getElementById("productname").value;
  return prodName;
}
// console.log(prodName());
export function prodId() {
  const prodId = document.getElementById("prodId").value;
  return prodId;
}

export const productImg = document.getElementById("product-img");

// HERO IMAGE SLIDE LOGIC //

const wrapper = document.getElementById("slider-wrapper");
let slides = document.querySelectorAll(".slide");

console.log(slides);

// 1. Clone first and last slides
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

// 2. Add clones to the DOM
wrapper.appendChild(firstClone);
wrapper.insertBefore(lastClone, slides[0]);

// 3. Variables for tracking
let index = 1; // Start at 1 because slide 0 is now the clone of the last image
const transitionTime = 500; // Match this to your CSS transition speed

// Initialize position to show the real first slide (index 1)
wrapper.style.transform = `translateX(${-index * 100}%)`;

function moveSlide(step) {
  index += step;
  wrapper.style.transition = `transform ${transitionTime}ms ease-in-out`;
  wrapper.style.transform = `translateX(${-index * 100}%)`;
}

// 4. The "Seamless" Jump Logic
wrapper.addEventListener("transitionend", () => {
  // If we just slid into the "First Image Clone" at the very end
  if (index >= wrapper.children.length - 1) {
    wrapper.style.transition = "none"; // Turn off animation
    index = 1; // Teleport back to real first slide
    wrapper.style.transform = `translateX(${-index * 100}%)`;
  }

  // If we just slid into the "Last Image Clone" at the very beginning
  if (index <= 0) {
    wrapper.style.transition = "none";
    index = wrapper.children.length - 2; // Teleport to real last slide
    wrapper.style.transform = `translateX(${-index * 100}%)`;
  }
});

const slide = setInterval(() => {
  moveSlide(1);
}, 5000);

// REVIEW SLIDE //
