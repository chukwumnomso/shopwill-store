import "./style.css";

import { uploadproduct } from "./prodUpload";

import { renderProduct } from "./prodUpload";

const closeBtn = document.getElementById("close");

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    const admin = document.getElementById("admin");
    renderProduct();
    admin.style.display = "none";
  });
}

// const skip = document.getElementById("skip");
// if (skip) {
//   skip.addEventListener("click", () => {
//     const admin = document.getElementById("admin");

//     admin.style.display = "block";
//   });
// }

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
