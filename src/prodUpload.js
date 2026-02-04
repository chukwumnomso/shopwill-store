import { getSupabase } from "./supabaseClient";
const supabase = getSupabase();
// END OF SUPABASE INITILIZATION

import { prodName } from "./main";
import { price } from "./main";
import { prodId } from "./main";
import { cartbag } from "./cart";
import { modal } from "./cart";
import { addToSideCart } from "./cart";
import { updateCart } from "./cart";
import { cartCount } from "./cart";
import { click } from "./cart";
import { openSideCart } from "./cart";
import { removeFromCart } from "./cart";
// import { sizes } from "./cart";

// END OF IMPORTS

window.updateCart = updateCart;

export const base = import.meta.env.BASE_URL;
export const cartIcon = `${base}assets/cartbag.jpg`;

// PRODUCT RENDERING

const productImg = document.getElementById("product-img");
if (productImg) {
  productImg.addEventListener("change", (e) => {
    if (e.target.files.length === 0) {
      console.log("No file selected!");
    }
    const file = e.target.files[0];
    uploadproduct(file);
  });
}

export async function uploadproduct(file) {
  const avatar = "avatar";
  const filePath = `productImage/${Date.now()}-${avatar}`;
  const { data, error } = await supabase.storage
    .from("productImage")
    .upload(filePath, file, { cacheControl: "3600", upsersert: true });

  prodName();
  price();
  prodId();
  try {
    const { data: insertData } = await supabase
      .from("products")
      .upsert({
        product_name: prodName(),
        product_price: price(),
        product_image: filePath,
        id: prodId(),
      })
      .select()
      .single();
  } catch {}
}

export let currentPage = 0; // 0-based index for Supabase range
const pageSize = 8; // Items per page

export async function renderProduct(page) {
  const prodList = document.getElementById("product-lists");
  const controls = document.getElementById("pagination-controls");
  const itemShow = document.getElementById("item-show");
  if (prodList) {
    prodList.innerHTML = "";
    // Calculate start and end indices
    const from = page * pageSize;
    const to = from + pageSize - 1;
    // Fetch data + total row count
    const {
      data: cards,
      count,
      error,
    } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      // 'exact' returns total rows matching filter
      .range(from, to)
      .order("id", { ascending: true }); // Ordering prevents unexpected range behavior
    cards.forEach((card) => {
      const { data: urlData } = supabase.storage
        .from("productImage")
        .getPublicUrl(card.product_image);
      const prodImage = urlData.publicUrl;
      const prodcard = document.createElement("div");
      prodcard.classList = "h-70 sm:h-80 prodcard";
      prodcard.innerHTML = `<div
        class="rounded-xl  capitalize relative h-full grid grid-rows-2"
      >
       <div class=" flex items-center justify-center overflow-hidden row-span-3 cursor-pointer"><a href="/shopwill-store/cart.html?id=${card.id}"> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></a></div>

        <div class="flex-col items-center justify-center"> <div class="flex justify-between items-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm mb-2 mt-2 lg:text-lg">${card.product_name}</h2><button class="cart-btn" data-id="${card.id}" data-name="${card.product_name}" data-price="${card.product_price}" data-image=${prodImage}> <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer"></button></div>
        
    <div class= "w-full text-center border-b "><p class="text-[0.8rem] text-black font-semibold">₦${card.product_price}</p></div>    
         <p class="text-[0.7rem] text-pink-500  font-bold hidden">${card.id}</p>
        
      </div></div>
        `;
      prodList.appendChild(prodcard);
      return prodcard;
    });

    // 2. Display Pagination Buttons
    const totalPages = Math.ceil(count / pageSize);
    controls.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i + 1;

      const baseStyles =
        "px-4 py-2 border rounded-md transition-colors cursor-pointer ";
      const activeStyles = "bg-pink-600 text-white border-pink-600";
      const inactiveStyles =
        "bg-white text-gray-700 hover:bg-gray-100 border-gray-300";
      btn.className = baseStyles + (i === page ? activeStyles : inactiveStyles);
      btn.onclick = () => {
        currentPage = i;
        prodList.scrollIntoView({
          behavior: "smooth",
          top: 0,
          left: 0,
        });
        console.log(currentPage);
        renderProduct(currentPage)
          .then((ok) => {
            async function card() {
              const bottomCart = document.getElementById("bottom-cart");
              const productCard = document.querySelectorAll(".prodcard");
              productCard.forEach((prod) => {
                prod.addEventListener("click", async (e) => {
                  bottomCart.innerHTML = "";
                  bottomCart.classList.toggle("translate-y-full");
                  const modal = document.getElementById("bottom-modal");
                  modal.classList.toggle("hidden");

                  const btn = e.target.closest(".cart-btn");
                  console.log(btn);
                  if (btn) {
                    const { data: item, error } = await supabase
                      .from("products")
                      .select("*")
                      .eq("id", btn.dataset.id);
                    console.log(item);
                    const { data: urlData } = supabase.storage
                      .from("productImage")
                      .getPublicUrl(item[0].product_image);
                    const prodImage = urlData.publicUrl;
                    console.log(prodImage);
                    const productImage = document.createElement("div");
                    productImage.innerHTML += `<div class="w-full flex items-center justify-center md:h-full md:w-90"><img src="${prodImage}" alt="" class="size-50 md:size-80" /></div>`;
                    const productDetails = document.createElement("div");
                    productDetails.classList =
                      "md:items-center md:h-full w-full md:flex";
                    productDetails.innerHTML = `<div class=" w-full h-[80%]"><h1 class="text-2xl font-bold font-[outfit] uppercase mb-4">${item[0].product_name}</h1>
  <p class="text-lg font-semibold mb-4 ">₦${item[0].product_price}</p>

<p class="text-green-600 mb-3 ">In Stock</p>
  <div class="flex mb-4 gap-2 items-center">
  <p class="text-sm font-semibold mb-3">size:</p>
  <select name="" id="sizes" class="font-[cursive] border h-4 text-[0.7rem]">
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="2XL ">2XL</option>
  </select>
</div>
<button class="bg-black text-white font-bold w-full h-10 px-2 flex gap-3 items-center hover:text-pink-600 duration-300 cursor-pointer add-to-cart-btn " > <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer">ADD TO CART</button></div>`;

                    bottomCart.append(productImage, productDetails);
                    const addToCartBtn =
                      productDetails.querySelector(".add-to-cart-btn");
                    addToCartBtn.addEventListener("click", async (e) => {
                      const size = document.getElementById("sizes");
                      const products = {
                        product_id: btn.dataset.id,
                        product_name: item[0].product_name,
                        product_price: item[0].product_price,
                        image_url: prodImage,
                        size: size.value,
                      };
                      console.log(btn.dataset.id);
                      const { data: cards } = await supabase
                        .from("cart_items")
                        .upsert(products, { onConflict: "product_id" })
                        .select();

                      console.log(cards);
                      addToSideCart();
                    });
                  }
                });
              });
            }
            card();
          })
          .catch((err) => console.error(err));
      };
      controls.appendChild(btn);
    }
  }
}

renderProduct(currentPage)
  .then((ok) => {
    async function card() {
      const bottomCart = document.getElementById("bottom-cart");
      const productCard = document.querySelectorAll(".prodcard");
      productCard.forEach((prod) => {
        prod.addEventListener("click", async (e) => {
          bottomCart.innerHTML = "";
          bottomCart.classList.toggle("translate-y-full");
          const modal = document.getElementById("bottom-modal");
          modal.classList.toggle("hidden");

          const btn = e.target.closest(".cart-btn");
          if (btn) {
            const { data: item, error } = await supabase
              .from("products")
              .select("*")
              .eq("id", btn.dataset.id);
            const { data: urlData } = supabase.storage
              .from("productImage")
              .getPublicUrl(item[0].product_image);
            const prodImage = urlData.publicUrl;
            const productImage = document.createElement("div");
            productImage.innerHTML += `<div class="w-full flex items-center justify-center md:h-full md:w-90"><img src="${prodImage}" alt="" class="size-50 md:size-80" /></div>`;
            const productDetails = document.createElement("div");
            productDetails.classList =
              "md:items-center md:h-full w-full md:flex";
            productDetails.innerHTML = `<div class=" w-full h-[80%]"><h1 class="text-2xl font-bold font-[outfit] uppercase mb-4">${item[0].product_name}</h1>
  <p class="text-lg font-semibold mb-4 ">₦${item[0].product_price}</p>

<p class="text-green-600 mb-3 ">In Stock</p>
  <div class="flex mb-4 gap-2 items-center">
  <p class="text-sm font-semibold mb-3">size:</p>
  <select name="" id="sizes" class="font-[cursive] border h-4 text-[0.7rem]">
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="2XL ">2XL</option>
  </select>
</div>
<button class="bg-black text-white font-bold w-full h-10 px-2 flex gap-3 items-center hover:text-pink-600 duration-300 cursor-pointer add-to-cart-btn " >  <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer">ADD TO CART</button></div>`;

            bottomCart.append(productImage, productDetails);
            const addToCartBtn =
              productDetails.querySelector(".add-to-cart-btn");
            addToCartBtn.addEventListener("click", async (e) => {
              const size = document.getElementById("sizes");
              const products = {
                product_id: btn.dataset.id,
                product_name: item[0].product_name,
                product_price: item[0].product_price,
                image_url: prodImage,
                size: size.value,
              };
              const { data: cards } = await supabase
                .from("cart_items")
                .upsert(products, { onConflict: "product_id" })
                .select();
              addToSideCart();
              openSideCart();
              modal.classList.toggle("hidden");
              bottomCart.classList.toggle("translate-y-full");
            });
          }
        });
      });
    }
    card();
  })
  .catch((err) => console.error(err));

// ////////////////////////////////////////////////////////////////

export function bottomModal() {
  const modal = document.getElementById("bottom-modal");
  const cart = document.getElementById("bottom-cart");

  if (modal) {
    modal.addEventListener("click", (e) => {
      e.stopImmediatePropagation;
      modal.classList.toggle("hidden");
      cart.classList.toggle("translate-y-full");
    });
  }
}
bottomModal();
