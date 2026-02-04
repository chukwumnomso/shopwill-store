import "./style.css";
import { getSupabase } from "./supabaseClient";
import { navShop } from "./main";
import { sideBar } from "./main";
import { cartIcon } from "./prodUpload";
import { cartbag } from "./cart";
import { modal } from "./cart";
import { addToSideCart } from "./cart";
import { updateCart } from "./cart";
import { cartCount } from "./cart";
import { bottomModal } from "./prodUpload";
import { openSideCart } from "./cart";

const supabase = getSupabase();
// const allbtn = document.getElementById("all");

// ///////////////////FETCH CATEGORY LOGIC///////////////////////////////////

let currentProductPage = 0;
const productPageSize = 8;

export async function getItems(page, ...items) {
  const allProducts = document.getElementById("all-products");
  const noProducts = document.getElementById("no-products");
  const pageControls = document.getElementById("paginationed-controls");
  allProducts.innerHTML = "";
  noProducts.textContent = "";
  pageControls.innerHTML = "";
  const from = page * productPageSize;
  const to = from + productPageSize - 1;
  const {
    data: cards,
    count,
    error,
  } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category", items)
    .range(from, to)
    .order("id", { ascending: true });

  if (cards && cards.length > 0) {
    cards.forEach((d) => {
      const { data: urlData } = supabase.storage
        .from("productImage")
        .getPublicUrl(d.product_image);
      const prodImage = urlData.publicUrl;
      const productCard = document.createElement("div");
      productCard.innerHTML = "";
      productCard.classList = "h-70  sm:h-80 prodcard";
      productCard.innerHTML = `<div
        class="rounded-xl  capitalize relative h-full grid grid-rows-2   "
      >

       <div class=" flex items-center justify-center overflow-hidden row-span-3 "><a href="/shopwill-store/cart.html?id=${d.id}"> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></a></div>

        <div class="flex-col items-center justify-center"> <div class="flex justify-between items-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm mb-2 mt-2 lg:text-lg">${d.product_name}</h2><button class="cart-btn" data-id="${d.id}"
    > <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer"> </button></div>
    <div class= "w-full text-center border-b "><p class="text-[0.8rem] text-black font-semibold">₦${d.product_price}</p></div>
         <p class="text-[0.7rem] text-pink-500  font-bold hidden">${d.id}</p>
      </div></div>
        `;

      allProducts.appendChild(productCard);
    });

    const totalPages = Math.ceil(count / productPageSize);
    pageControls.innerHTML = "";

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
        currentProductPage = i;
        allProducts.scrollIntoView({
          behavior: "smooth",
          top: 0,
          left: 0,
        });
        console.log(currentProductPage);
        getItems(currentProductPage, ...items)
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
      };
      pageControls.appendChild(btn);
    }
  } else {
    noProducts.textContent = "NO PRODUTS IN THIS CATEGORY";
    noProducts.classList.add("flex");
    noProducts.classList.remove("hidden");
  }
}

// END OF FETCH CATEGORY LOGIC

// CATEGORY BOTTONS LOGIC

const activeBtn = "bg-black text-white transition-all duration-300";
const activeBtndiv = "border-2";
const productBtns = document.querySelectorAll(".btns button");
const productBtnsDiv = document.querySelectorAll(".btns div");
const btnNodesArray = [...productBtns];
const slicedProdBtn = btnNodesArray.slice(1);
const allBtn = btnNodesArray.slice(0, 1);

function categoryBtnsHandler() {
  if (productBtns) {
    slicedProdBtn.forEach((b) => {
      b.addEventListener("click", function (e) {
        e.stopImmediatePropagation();
        allBtn[0].classList.remove(...activeBtn.split(" "));
        productBtns.forEach((btn) =>
          btn.classList.remove(...activeBtn.split(" ")),
        );
        this.classList.add(...activeBtn.split(" "));
        const item = this.textContent.trim();
        productBtnsDiv.forEach((div) => div.classList.remove(activeBtndiv));
        this.parentElement.classList.add(activeBtndiv);
        getItems(currentProductPage, item)
          .then((ok) => {
            async function card() {
              const bottomCart = document.getElementById("bottom-cart");
              const productCard = document.querySelectorAll(".prodcard");

              productCard.forEach((prod) => {
                prod.addEventListener("click", async (e) => {
                  e.stopImmediatePropagation();
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
      });
    });
    if (allBtn[0]) {
      allBtn[0].addEventListener("click", function (e) {
        e.stopImmediatePropagation();
        allProduct(currentProductPage)
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
        this.classList.add(...activeBtn.split(" "));
        this.parentElement.classList.add(activeBtndiv);
        slicedProdBtn.forEach((btn) => {
          btn.classList.remove(...activeBtn.split(" "));
          btn.parentElement.classList.remove(activeBtndiv);
        });
      });
    }
  }
  return allBtn;
}
categoryBtnsHandler();

// END OF BOTTONS LOGIC

// DISPLAY ALL PRODUCTS

async function allProduct(page) {
  try {
    const allProducts = document.getElementById("all-products");
    const pageControls = document.getElementById("paginationed-controls");
    allProducts.innerHTML = "";
    pageControls.innerHTML = "";
    const from = page * productPageSize;
    const to = from + productPageSize - 1;

    const {
      data: cards,
      count,
      error,
    } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("id", { ascending: true });
    cards.forEach((d) => {
      const { data: urlData } = supabase.storage
        .from("productImage")
        .getPublicUrl(d.product_image);
      const prodImage = urlData.publicUrl;
      const productCard = document.createElement("div");
      productCard.classList = "h-70  sm:h-80 prodcard";
      productCard.innerHTML = `<div
        class="rounded-xl  capitalize relative h-full grid grid-rows-2   "
      >
       <div class=" flex items-center justify-center overflow-hidden row-span-3 "><a href="/shopwill-store/cart.html?id=${d.id}"> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></a></div>

        <div class="flex-col items-center justify-center"> <div class="flex justify-between items-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm mb-2 mt-2 lg:text-lg">${d.product_name}</h2>
     
   <button class="cart-btn" data-id="${d.id}"
    > <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer"> </button></div>

    <div class= "w-full text-center border-b "><p class="text-[0.8rem] text-black font-semibold">₦${d.product_price}</p></div>
         <p class="text-[0.7rem] text-pink-500  font-bold hidden">${d.id}</p>

      </div></div>
        `;
      allProducts.appendChild(productCard);
      const noProducts = document.getElementById("no-products");
      noProducts.classList.add("hidden");
    });

    const totalPages = Math.ceil(count / productPageSize);
    pageControls.innerHTML = "";

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
        currentProductPage = i;
        allProducts.scrollIntoView({
          behavior: "smooth",
          top: 0,
          left: 0,
        });
        allProduct(currentProductPage)
          .then((ok) => {
            async function card() {
              const bottomCart = document.getElementById("bottom-cart");
              const productCard = document.querySelectorAll(".prodcard");
              productCard.forEach((prod) => {
                prod.addEventListener("click", async (e) => {
                  e.stopImmediatePropagation();
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
      };
      pageControls.appendChild(btn);
    }
  } catch {}
}
allProduct(currentProductPage)
  .then((ok) => {
    async function card() {
      const bottomCart = document.getElementById("bottom-cart");
      const productCard = document.querySelectorAll(".prodcard");
      productCard.forEach((prod) => {
        prod.addEventListener("click", async (e) => {
          e.stopImmediatePropagation();
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

function allBtnInitialStyle() {
  if (allBtn[0]) {
    allBtn[0].classList.add(...activeBtn.split(" "));
    allBtn[0].parentElement.classList.add(activeBtndiv);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  allBtnInitialStyle(),
  cartCount(),
);

// SORTING LOGIC

let currentSearch = "";
async function fetchProducts(sortBy = "name", direction = "asc", page) {
  const noProduct = document.getElementById("no-products");
  const allProducts = document.getElementById("all-products");
  const pageControls = document.getElementById("paginationed-controls");
  noProduct.classList.add("hidden");
  const from = page * productPageSize;
  const to = from + productPageSize - 1;
  const { data, count, error } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .ilike("product_name", `%${currentSearch}%`)
    .range(from, to)
    // Pass the column (sortBy) and boolean (direction)
    .order(sortBy, { ascending: direction === "asc" });
  console.log(count);
  if (count === 0) {
    noProduct.textContent = "NO PRODUCTS FOUND";
    noProduct.classList.remove("hidden");
  }
  allProducts.innerHTML = "";
  pageControls.innerHTML = "";
  data.forEach((item) => {
    const { data: urlData } = supabase.storage
      .from("productImage")
      .getPublicUrl(item.product_image);

    const prodImage = urlData.publicUrl;
    const productCard = document.createElement("div");
    productCard.classList = "prodcard";
    productCard.innerHTML = `<div
        class="rounded-xl  capitalize relative h-full grid grid-rows-2   "
      >
       <div class=" flex items-center justify-center overflow-hidden row-span-3 "><a href="/shopwill-store/cart.html?id=${item.id}"> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></a></div>

        <div class="flex-col items-center justify-center"> <div class="flex justify-between items-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm mb-2 mt-2 lg:text-lg">${item.product_name}</h2><button class="cart-btn" data-id="${item.id}"
    > <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer"> </button></div>

    <div class= "w-full text-center border-b "><p class="text-[0.8rem] text-black font-semibold">₦${item.product_price}</p></div>
         <p class="text-[0.7rem] text-pink-500  font-bold hidden">${item.id}</p>

      </div></div>
        `;
    allProducts.appendChild(productCard);
  });

  const totalPages = Math.ceil(count / productPageSize);
  pageControls.innerHTML = "";

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
      currentProductPage = i;
      const [column, order] = document
        .getElementById("sortDropdown")
        .value.split(":");
      allProducts.scrollIntoView({
        behavior: "smooth",
        top: 0,
        left: 0,
      });
      console.log(currentProductPage);
      fetchProducts(column, order, currentProductPage)
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
    };
    pageControls.appendChild(btn);
  }
}

// SEARCH INPUT LISTENER
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    currentProductPage = 0;
    const [column, order] = document
      .getElementById("sortDropdown")
      .value.split(":");
    fetchProducts(column, order, currentProductPage)
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
  });
}

// DROPDOWN LISTENER
const sortDropdown = document.getElementById("sortDropdown");

if (sortDropdown) {
  sortDropdown.addEventListener("change", (e) => {
    const [column, order] = e.target.value.split(":");
    currentProductPage = 0;
    fetchProducts(column, order, currentProductPage)
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
  });
}

export function sideCartClose() {
  const sideCartClose = document.querySelector(".side-close");
  if (sideCartClose) {
    sideCartClose.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      console.log("yes");
      openSideCart();
      modal();
    });
  }
}

sideCartClose();
