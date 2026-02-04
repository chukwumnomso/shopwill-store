import { getSupabase } from "./supabaseClient";
const supabase = getSupabase();

import { cartIcon } from "./prodUpload";
// import { bottomModal } from "./prodUpload";
// bottomModal();
// 1. Get the ID from the URL (e.g., product.html?id=5)
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

window.updateCart = updateCart;

async function loadProductDetails() {
  if (!productId) return;
  // 2. Fetch only the item that matches the ID
  const { data: item, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId) // Filter by ID
    .single(); // Return one object, not an array

  if (error || !item) {
    document.body.innerHTML = "<h1>Product not found</h1>";
    return;
  }
  const { data: urlData } = supabase.storage
    .from("productImage")
    .getPublicUrl(item.product_image);
  const prodImage = urlData.publicUrl;
  const showItem = document.getElementById("item-show");
  showItem.innerHTML = "";
  const productImage = document.createElement("div");
  const productDetails = document.createElement("div");
  const prodName = document.getElementById("prodName");
  prodName.textContent = `${item.product_name}`;
  productImage.classList = "border-t mb-10";

  productImage.innerHTML = `<img src="${prodImage}" alt="" class="w-full" />`;
  productDetails.innerHTML = `<h1 class="text-3xl font-extrabold font-[outfit] uppercase mb-10">${item.product_name}</h1>
  <p class="text-xl font-semibold mb-7 ">₦${item.product_price}</p>

<p class="text-green-600 mb-6 ">In Stock</p>
  <div class="flex mb-8 gap-2 items-center">
  <p class="text-lg font-semibold">size:</p>
  <select name="" id="sizes" class="font-[cursive] border h-6">
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="2XL ">2XL</option>
  </select>
</div>
<button class="bg-black text-white font-bold w-full h-12 px-2 flex gap-3 items-center hover:text-pink-600 duration-300 cursor-pointer " onclick="updateCart();"> <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer">ADD TO CART</button>`;

  showItem.append(productImage, productDetails);

  const sizes = document.getElementById("sizes");
  return sizes;
}
export const sizes = loadProductDetails();

// /////////////////////////////////////////////////
export function cartbag() {
  const cartBag = document.getElementById("cart-bag");
  if (cartBag) {
    cartBag.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      addToSideCart();
      openSideCart();
    });
  }
}
cartbag();

export function click() {
  console.log("click");
}

export function modal() {
  const cartContainer = document.getElementById("cartcontainer");
  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      cartContainer.classList.toggle("translate-x-full");
      modal.classList.toggle("hidden");
      cartCount();
    });
  }
}
modal();

export async function addToSideCart() {
  const cartBag = document.getElementById("cart-bag");
  const sideCart = document.getElementById("sideCart");
  sideCart.innerHTML = "";

  const { data: items } = await supabase.from("cart_items").select("*");
  cartBag.textContent = items.length;
  items.forEach((item) => {
    const prodGrid = document.createElement("div");
    prodGrid.id = `item-${item.product_id}`;
    prodGrid.classList = "grid grid-cols-3 mb-6 pb-4 border-b";
    const itemImage = document.createElement("div");
    const productDetails = document.createElement("div");
    productDetails.classList = "w-full h-full col-span-2";
    itemImage.innerHTML = `<img src="${item.image_url}" alt="" class="w-30 h-full " />`;
    productDetails.innerHTML = `<h1 class="text-sm font-extrabold font-[outfit] uppercase mb-4">${item.product_name}</h1>
  <p class="text-[0.7rem] font-semibold mb-3 ">₦${item.product_price}</p>

<p class=" mb-2 text-[0.8rem]">SIZE: <span class="text-red-500 font-bold">${item.size}</span></p>
  <div class="flex mb-3  items-center bg-gray-300">
<button class="w-full h-5  text-white flex items-center justify-center cursor-pointer bg-black hover:text-pink-600 duration-300 ">-</button><input type="text" id="quantity"  class="w-8 h-5 text-[1rem] text-center"/><button class="w-full h-5 cursor-pointer text-white bg-black flex items-center justify-center hover:text-pink-600 duration-300 ">+</button>
  <button class="w-full h-5 bg-white text-[0.7rem] cursor-pointer hover:text-pink-600 duration-300 remove-btn " data-id=${item.product_id} >Remove</button>
</div>
<button class="bg-black text-white text-[0.6rem] font-bold w-full h-6 px-2 flex gap-3 items-center hover:text-pink-600 duration-300 cursor-pointer " onclick="addToCart()"> <img src="${cartIcon}" alt="" class="rounded-full size-3 hover:scale-104 transition-all duration-200 cursor-pointer">ADD TO CART</button>`;
    if (sideCart) {
      prodGrid.append(itemImage, productDetails);
      sideCart.append(prodGrid);
    }

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const productId = e.target.getAttribute("data-id");
        removeFromCart(productId);
        const item = document.getElementById(`item-${productId}`);
        if (item) {
          item.remove();
        }
        cartCount();
      }
    });
  });
}

export async function updateCart() {
  const sized = await sizes;

  if (!productId) return;

  const { data: cartItem, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();
  console.log(cartItem);
  const { data: urlData } = supabase.storage
    .from("productImage")
    .getPublicUrl(cartItem.product_image);
  const prodImage = urlData.publicUrl;
  const products = {
    product_id: cartItem.id,
    product_name: cartItem.product_name,
    product_price: cartItem.product_price,
    image_url: prodImage,
    size: sized.value,
  };

  const { data: carted } = await supabase
    .from("cart_items")
    .upsert(products, { onConflict: "product_id" })
    .select();

  //   console.log(carted);
  addToSideCart();
  openSideCart();
}

export async function cartCount() {
  const cartCount = document.getElementById("cartCount");
  const { data: items } = await supabase.from("cart_items").select("*");

  cartCount.textContent = items.length;
}

cartCount();

export async function removeFromCart(id) {
  const { data } = await supabase
    .from("cart_items")
    .delete()
    .eq("product_id", id)
    .select();
  //   addToSideCart();
}

export function openSideCart() {
  const modal = document.getElementById("modal");
  modal.classList.toggle("hidden");
  const cartContainer = document.getElementById("cartcontainer");
  cartContainer.classList.toggle("translate-x-full");
}
