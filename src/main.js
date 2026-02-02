import "./style.css";
import axios from "axios";
import "./prodUpload";
import { supabase } from "./prodUpload";
import { cartbag } from "./cart";
import { modal } from "./cart";
import { addToSideCart } from "./cart";
import { updateCart } from "./cart";
import { cartCount } from "./cart";
// ///////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////

export function price() {
  const price = document.getElementById("price").value;
  return price;
}
export function prodName() {
  const prodName = document.getElementById("productname").value;
  return prodName;
}
export function prodId() {
  const prodId = document.getElementById("prodId").value;
  return prodId;
}
export const productImg = document.getElementById("product-img");

// HERO IMAGE SLIDE LOGIC //

const wrapper = document.getElementById("slider-wrapper");
let slides = document.querySelectorAll(".slide");

if (slides === true) {
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
} else {
}
if (wrapper === true) {
  wrapper.appendChild(firstClone);
  wrapper.insertBefore(lastClone, slides[0]);
}

let index = 1;
const transitionTime = 500;
if (wrapper) {
  wrapper.style.transform = `translateX(${-index * 100}%)`;
}

function moveSlide(step) {
  index += step;
  if (wrapper) {
    wrapper.style.transition = `transform ${transitionTime}ms ease-in-out`;
    wrapper.style.transform = `translateX(${-index * 100}%)`;
  }
}
if (wrapper) {
  wrapper.addEventListener("transitionend", () => {
    if (index >= wrapper.children.length - 1) {
      wrapper.style.transition = "none";
      index = 1;
      wrapper.style.transform = `translateX(${-index * 100}%)`;
    }
    if (index <= 0) {
      wrapper.style.transition = "none";
      index = wrapper.children.length - 2;
      wrapper.style.transform = `translateX(${-index * 100}%)`;
    }
  });
}

const slide = setInterval(() => {
  moveSlide(1);
}, 5000);

// FOOTER DATE//

const date = new Date();
const year = date.getFullYear();
const footerDate = document.querySelector(".footer-date");
if (footerDate) {
  footerDate.textContent = year;
}

// SIDEBAR LOGIC

export function sideBar() {
  const navBar = document.getElementById("navbar");
  const sideBar = document.getElementById("side-bar");
  const closeNavBar = document.getElementById("close-nav");
  const transition = "transition-transform duration-700 ease-in-out";
  if (navBar) {
    navBar.addEventListener("click", () => {
      sideBar.classList.remove("-translate-x-full");
      sideBar.classList.add(...transition.split(" "));
    });
    closeNavBar.addEventListener("click", () => {
      sideBar.classList.add("-translate-x-full");
    });
  }
}

sideBar();
export function navShop() {
  const navCategory = document.getElementById("nav-category");
  const shop = document.getElementById("shop");
  if (shop) {
    shop.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      navCategory.classList.toggle("h-0");
      navCategory.classList.toggle("mb-4");
      console.log(navCategory);
    });
  }
}

navShop();

// ////////////////////////////////////////////////////////////////////////
