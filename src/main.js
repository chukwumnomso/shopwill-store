import "./style.css";
import axios from "axios";
import "./renderProducts";
import { getSupabase } from "./supabaseClient";
import { cartbag } from "./viewProduct";
import { modal } from "./viewProduct";
import { addToSideCart } from "./viewProduct";
import { updateCart } from "./viewProduct";
import { cartCount } from "./viewProduct";
import { removeCartText } from "./viewProduct";
import { openSideCart } from "./viewProduct";
import { subTotal } from "./viewProduct";
import { showSubTotal } from "./viewProduct";

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
  const modal = document.getElementById("nav-modal");
  const navBar = document.getElementById("navbar");
  const sideBar = document.getElementById("side-bar");
  const closeNavBar = document.getElementById("close-nav");
  const transition = "transition-transform duration-700 ease-in-out";
  if (navBar) {
    navBar.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (navBar) {
        modal.classList.toggle("hidden");
        sideBar.classList.toggle("-translate-x-full");
        sideBar.classList.add(...transition.split(" "));
      }
    });
    closeNavBar.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      sideBar.classList.add("-translate-x-full");
      modal.classList.toggle("hidden");
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
    });
  }
}

navShop();

cartCount();
// ////////////////////////////////////////////////////////////////////////

export function navModal() {
  const modal = document.getElementById("nav-modal");
  const sideBar = document.getElementById("side-bar");
  const transition = "transition-transform duration-700 ease-in-out";
  if (modal) {
    modal.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      modal.classList.toggle("hidden");
      sideBar.classList.toggle("-translate-x-full");
      sideBar.classList.add(...transition.split(" "));
    });
  }
}
navModal();

// //////////////////////////////////////////////////////////////

export function bottomModal() {
  const modal = document.getElementById("bottom-modal");
  const cart = document.getElementById("bottom-cart");
  const cartDiv = document.getElementById("bottom-cart-div");

  if (modal) {
    modal.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      modal.classList.toggle("hidden");
      cart.classList.toggle("translate-y-full");
      cartDiv.classList.toggle("translate-y-full");
    });
  }
}
bottomModal();

export function sideCartClose() {
  const sideCartClose = document.querySelector(".side-close");
  if (sideCartClose) {
    sideCartClose.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      removeCartText();
      openSideCart();
      modal();
      subTotal();
      showSubTotal();
    });
  }
}

sideCartClose();
