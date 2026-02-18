import "./style.css";

import { getSupabase } from "./supabaseClient";
import { sideBar } from "./main";
import { subTotal } from "./viewProduct";
import { showSubTotal } from "./viewProduct";
import { cartCount } from "./viewProduct";
import { removeFromCart } from "./viewProduct";
import { addQuantity } from "./viewProduct";
import { addSize } from "./viewProduct";

const supabase = getSupabase();

async function cartSummary() {
  const cartSummary = document.getElementById("cart-summary");
  if (cartSummary) cartSummary.innerHTML = "";
  const { data: items } = await supabase.from("cart_items").select("*");

  items.forEach((item) => {
    const orderedItem = document.createElement("div");
    orderedItem.innerHTML = "";
    orderedItem.classList = " grid grid-cols-4 gap-4 py-4  border-t";
    orderedItem.id = `item-${item.product_id}`;
    orderedItem.innerHTML += `
   <div><img src="${item.image_url}" alt="" class="w-30 h-full " /></div>
    <div class=" col-span-3 grid grid-rows-2  ">
    <div class=" grid grid-cols-4">
    <h1 class="text-lg  font-[montserrat] uppercase mb-4 col-span-3">${item.product_name}</h1>
  <p class="text-lg font-semibold mb-3 font-[montserrat] " data-price="${item.product_id}">₦${item.product_price.toLocaleString()}</p></div>
<div class=" flex justify-between items-center">

  <div class="flex    items-center  ">
<button class="w-10 h-5  text-black flex items-center justify-center cursor-pointer bg-gray-200 hover:text-pink-600  duration-300 sub-btn" data-Q="${item.product_id}">-</button>
<input type="text" value="${item.quantity}" id="quantity" data-Q="${item.product_id}" class="w-8 h-5 text-[1rem] text-center"/><button class="w-10 h-5 cursor-pointer text-black bg-gray-200 flex items-center justify-center hover:text-pink-600 duration-300 add-btn " data-Q="${item.product_id}" >+</button>
 
</div>
 <div class="flex items-center gap-2">
  <p class="text-sm font-semibold font-[montserrat]">size:</p>
  <select name="" class="sizes border" class="font-[montserrat] text-sm border h-4" data-size="${item.product_id}">
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="2XL ">2XL</option>
  </select>
</div>
 <button class=" bg-white text-[0.8rem] cursor-pointer hover:text-pink-600 duration-300 font-[montserrat]  underline remove-btn " data-id=${item.product_id} >Remove</button>
</div>
`;
    cartSummary.appendChild(orderedItem);
  });

  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("sizes")) {
      const productId = e.target.getAttribute("data-size");
      const size = document.querySelector(`select[data-size="${productId}"]`);
      addSize(productId, size.value);
      setTimeout(() => {
        orderSummary();
      }, 1000);
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const productId = e.target.getAttribute("data-id");
      removeFromCart(productId)
        .then((ok) => subTotal())
        .then((ok) => showSubTotal())
        .then((ok) => cartCount())
        .then((ok) => orderSummary());
      const item = document.getElementById(`item-${productId}`);
      if (item) {
        item.remove();
      }
      orderSummary();
    }
  });
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-btn")) {
      const productId = e.target.getAttribute("data-Q");
      const quantityInput = document.querySelector(
        `input[data-Q="${productId}"]`,
      );
      const prodPrice = document.querySelector(`p[data-price="${productId}"]`);
      if (quantityInput) {
        const newQuantity = parseInt(quantityInput.value) + 1;
        quantityInput.value = newQuantity;
        const { data: priceData } = await supabase
          .from("products")
          .select("product_price")
          .eq("id", productId)
          .single();

        if (priceData) {
          const incrementAmount = priceData.product_price;
          const updatedPrice = incrementAmount * newQuantity;
          prodPrice.textContent = updatedPrice.toLocaleString();
          addQuantity(newQuantity, productId, updatedPrice).then((ok) => {
            subTotal();
          });
        }
      }
      cartCount();
      orderSummary();
    }
  });
  document.addEventListener("click", async (e) => {
    e.stopImmediatePropagation();
    if (e.target.classList.contains("sub-btn")) {
      const productId = e.target.getAttribute("data-Q");
      const quantityInput = document.querySelector(
        `input[data-Q="${productId}"]`,
      );
      const prodPrice = document.querySelector(`p[data-price="${productId}"]`);
      if (quantityInput.value > 1) {
        const newQuantity = parseInt(quantityInput.value) - 1;
        quantityInput.value = newQuantity;
        const { data: priceData } = await supabase
          .from("products")
          .select("product_price")
          .eq("id", productId)
          .single();
        if (priceData) {
          const decrementAmount = priceData.product_price;
          const updatedPrice = decrementAmount * newQuantity;
          prodPrice.textContent = updatedPrice.toLocaleString();
          addQuantity(newQuantity, productId, updatedPrice).then((ok) => {
            subTotal();
          });
        }
      }
      cartCount();
      orderSummary();
    }
  });
}
cartSummary();

async function orderSummary() {
  const orderSummary = document.getElementById("order-summary");
  //   orderSummary.innerHTML = "";
  orderSummary.innerHTML = "";
  const { data: orders } = await supabase.from("cart_items").select("*");
  orders.forEach((order) => {
    const orderCard = document.createElement("div");
    orderCard.innerHTML = "";
    orderCard.classList = "mt-4";
    orderCard.innerHTML += `<div class="bg-gray-50 grid grid-cols-3 items-center px-4 py-4 gap-4"><div class="col-span-2 grid grid-rows-3 gap-4"><h1 class="font-bold text-lg font[playfar] capitalize">${order.product_name}</h1> <p class="text-gray-600 font-[montserrat] text-sm">Size: ${order.size}</p><p class="text-gray-600 font-[montserrat] text-sm">Quantity: ${order.quantity}</p></div><div class="font-[montserrat] font-bold text-sm text-end">₦${order.product_price.toLocaleString()}</div></div>`;
    orderCard.innerHTML += `<div class="bg-gray-50 grid grid-cols-3 items-center px-4 py-4 gap-4"><div class="col-span-2 grid grid-rows-3 gap-4"><h1 class="font-bold text-lg font[playfar] capitalize">${order.product_name}</h1> <p class="text-gray-600 font-[montserrat] text-sm">Size: ${order.size}</p><p class="text-gray-600 font-[montserrat] text-sm">Quantity: ${order.quantity}</p></div><div class="font-[montserrat] font-bold text-sm text-end">₦${order.product_price}</div></div>`;

    orderSummary.appendChild(orderCard);
  });
}
orderSummary();
