import "./style.css";
import axios from "axios";
import "./prodUpload";
import { supabase } from "./prodUpload";
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

async function cartCount() {
  const { data: items } = await supabase.from("cart_items").select("*");
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = items.length;
  }
  console.log(cartCount);
}

cartCount();

const cartContainer = document.getElementById("cartcontainer");

const sideCart = document.getElementById("sideCart");
const modal = document.getElementById("modal");

const cartBag = document.getElementById("cart-bag");

if (cartBag) {
  cartBag.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    addToSideCart();
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    cartContainer.classList.toggle("translate-x-full");
    modal.classList.toggle("hidden");
    cartCount();
  });
}

async function addToSideCart() {
  modal.classList.toggle("hidden");
  console.log(modal);
  sideCart.innerHTML = "";
  cartContainer.classList.toggle("translate-x-full");

  const { data: items } = await supabase.from("cart_items").select("*");
  console.log(items);
  cartBag.textContent = items.length;

  items.forEach((item) => {
    const itemImage = document.createElement("div");
    const productDetails = document.createElement("div");

    itemImage.innerHTML = `<img src="${item.image_url}" alt="" class="w-full" />`;
    productDetails.innerHTML = `<h1 class="text-sm font-extrabold font-[outfit] uppercase mb-4">${item.product_name}</h1>
  <p class="text-[0.7rem] font-semibold mb-3 ">₦${item.product_price}</p>

<p class="text-green-600 mb-2 text-[0.6rem]">In Stock</p>
  <div class="flex mb-3 gap-2 items-center">
  <p class="text-[0.8rem] font-semibold">size:</p>
  <select name="" id="" class="font-[cursive] border text-[0.6rem] h-4">
    <option value="">S</option>
    <option value="">M</option>
    <option value="">L</option>
    <option value="">XL</option>
    <option value="">2XL</option>
  </select>
</div>
<button class="bg-black text-white text-[0.6rem] font-bold w-full h-6 px-2 flex gap-3 items-center hover:text-pink-600 duration-300 cursor-pointer " onclick="addToCart()"> <img src="/src/assets/cartbag.jpg" alt="" class="rounded-full size-3 hover:scale-104 transition-all duration-200 cursor-pointer">ADD TO CART</button>`;
    if (sideCart) {
      cartContainer.appendChild(sideCart);
      sideCart.append(itemImage, productDetails);
    }
  });
}
