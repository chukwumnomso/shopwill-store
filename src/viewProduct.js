import { getSupabase } from "./supabaseClient";
const supabase = getSupabase();
import { cartIcon } from "./renderProducts";

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
    document.body.innerHTML = `<h1 class="mt-10 ml-4" >Product not found</h1>`;
    return;
  }
  const { data: urlData } = supabase.storage
    .from("productImage")
    .getPublicUrl(item.product_image);
  const prodImage = urlData.publicUrl;
  const showItem = document.getElementById("item-show");
  if (showItem) {
    showItem.innerHTML = "";

    const productImage = document.createElement("div");
    const productDetails = document.createElement("div");
    const prodName = document.getElementById("prodName");
    prodName.textContent = `${item.product_name}`;
    productImage.classList = "border-t mb-10";

    productImage.innerHTML = `<img src="${prodImage}" alt="" class="w-full" />`;
    productDetails.innerHTML = `<h1 class="text-3xl font-extrabold font-[outfit] uppercase mb-10">${item.product_name}</h1>
  <p class="text-xl font-semibold mb-7 ">₦${item.product_price.toLocaleString()}</p>

  <div class="flex mb-8 gap-2 items-center">
  <p class="text-lg font-semibold">size:</p>
  <select name="" id="sizes" class="font-[montserrat] border h-6">
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="2XL ">2XL</option>
  </select>
</div>
<button class="bg-black text-white font-bold w-full h-12 px-2 flex gap-3 items-center justify-center hover:text-pink-600 duration-300 cursor-pointer " onclick="updateCart();"> <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer">ADD TO CART</button>

<h1 class="text-3xl font-extrabold font-[outfit] uppercase mt-15 mb-5">description</h1>

<p class="text-lg font-[outfit]"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur vitae deserunt velit provident veniam ut voluptatem, quasi hic? Amet officia, ullam nostrum repellat tempore unde, cumque corrupti itaque dolor excepturi, vel inventore labore suscipit consectetur at nobis ipsam similique? Illo ea aspernatur nemo libero accusantium repellendus necessitatibus minima expedita at.</p>`;

    showItem.append(productImage, productDetails);
    youMayLike(item.category, productId);
    const sizes = document.getElementById("sizes");
    return sizes;
  }
}
export const sizes = loadProductDetails();

// /////////////////////////////////////////////////
export function cartbag() {
  const cartBag = document.getElementById("cart-bag");
  if (cartBag) {
    cartBag.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      removeCartText();
      addToSideCart();
      openSideCart();
      showSubTotal();
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
  if (sideCart) sideCart.innerHTML = "";

<<<<<<< HEAD
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
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
=======
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
>>>>>>> 8116c5f (first)
  <p class="text-[0.7rem] font-semibold mb-3 " data-price="${item.product_id}">₦${item.product_price.toLocaleString()}</p>

<p class=" mb-2 text-[0.8rem]">SIZE: <span class="text-red-500 font-bold">${item.size}</span></p>
  <div class="flex mb-3  items-center ">
<button class="w-10 h-5  text-white flex items-center justify-center cursor-pointer bg-black hover:text-pink-600  duration-300 sub-btn" data-Q="${item.product_id}">-</button>
<input type="text" value="${item.quantity}" id="quantity" data-Q="${item.product_id}" class="w-8 h-5 text-[1rem] text-center"/><button class="w-10 h-5 cursor-pointer text-white bg-black flex items-center justify-center hover:text-pink-600 duration-300 add-btn " data-Q="${item.product_id}" >+</button>
  <button class="w-20 h-5 bg-white text-[0.7rem] cursor-pointer hover:text-pink-600 duration-300 remove-btn underline " data-id=${item.product_id} >Remove</button>
</div>
<div class="w-full h-8"><button class=""></button></div>

`;
<<<<<<< HEAD
      if (sideCart) {
        prodGrid.append(itemImage, productDetails);

        sideCart.append(prodGrid);
      }

      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
          const productId = e.target.getAttribute("data-id");
          removeFromCart(productId)
            .then((ok) => subTotal())
            .then((ok) => showSubTotal());
          const item = document.getElementById(`item-${productId}`);
          if (item) {
            item.remove();
          }
          cartCount();
        }
      });
      document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("add-btn")) {
          const productId = e.target.getAttribute("data-Q");
          const quantityInput = document.querySelector(
            `input[data-Q="${productId}"]`,
          );
          const prodPrice = document.querySelector(
            `p[data-price="${productId}"]`,
          );
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
        }
      });
      document.addEventListener("click", async (e) => {
        e.stopImmediatePropagation();
        if (e.target.classList.contains("sub-btn")) {
          const productId = e.target.getAttribute("data-Q");
          const quantityInput = document.querySelector(
            `input[data-Q="${productId}"]`,
          );
          const prodPrice = document.querySelector(
            `p[data-price="${productId}"]`,
          );
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
        }
      });
    });
  }
=======
    if (sideCart) {
      prodGrid.append(itemImage, productDetails);

      sideCart.append(prodGrid);
    }

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const productId = e.target.getAttribute("data-id");
        removeFromCart(productId)
          .then((ok) => subTotal())
          .then((ok) => showSubTotal());
        const item = document.getElementById(`item-${productId}`);
        if (item) {
          item.remove();
        }
        cartCount();
      }
    });
    document.addEventListener("click", async (e) => {
      if (e.target.classList.contains("add-btn")) {
        const productId = e.target.getAttribute("data-Q");
        const quantityInput = document.querySelector(
          `input[data-Q="${productId}"]`,
        );
        const prodPrice = document.querySelector(
          `p[data-price="${productId}"]`,
        );
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
      }
    });
    document.addEventListener("click", async (e) => {
      e.stopImmediatePropagation();
      if (e.target.classList.contains("sub-btn")) {
        const productId = e.target.getAttribute("data-Q");
        const quantityInput = document.querySelector(
          `input[data-Q="${productId}"]`,
        );
        const prodPrice = document.querySelector(
          `p[data-price="${productId}"]`,
        );
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
      }
    });
  });
>>>>>>> 8116c5f (first)
}

export async function updateCart() {
  const sized = await sizes;

  if (!productId) return;

  const { data: cartItem, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();
  const { data: urlData } = supabase.storage
    .from("productImage")
    .getPublicUrl(cartItem.product_image);
  const prodImage = urlData.publicUrl;
<<<<<<< HEAD
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
=======
>>>>>>> 8116c5f (first)
  const products = {
    product_id: cartItem.id,
    product_name: cartItem.product_name,
    product_price: cartItem.product_price,
    image_url: prodImage,
    size: sized.value,
<<<<<<< HEAD
    user_id: user.id,
=======
>>>>>>> 8116c5f (first)
  };

  const { data: carted } = await supabase
    .from("cart_items")
    .upsert(products, { onConflict: "product_id" })
    .select();

  //   console.log(carted);
  removeCartText();
  addToSideCart();
  subTotal();
  openSideCart();
}

export async function cartCount() {
<<<<<<< HEAD
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: items } = await supabase.from("cart_items").select("*");
    const cartCount = document.getElementById("cartCount");
    if (cartCount && items.length > 0) {
      cartCount.textContent = items.length;
    } else if (cartCount && items.length === 0) {
      cartCount.textContent = items.length;
    }
=======
  const { data: items } = await supabase.from("cart_items").select("*");
  const cartCount = document.getElementById("cartCount");
  console.log(items.length);
  if (cartCount && items.length > 0) {
    cartCount.textContent = items.length;
  } else if (cartCount && items.length === 0) {
    console.log("here");
    cartCount.textContent = items.length;
    console.log(items.length);
>>>>>>> 8116c5f (first)
  }
}

cartCount();

export async function removeFromCart(id) {
<<<<<<< HEAD
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data } = await supabase
      .from("cart_items")
      .delete()
      .eq("product_id", id)
      .select();
  }

=======
  const { data } = await supabase
    .from("cart_items")
    .delete()
    .eq("product_id", id)
    .select();
>>>>>>> 8116c5f (first)
  //   addToSideCart();
}

export function openSideCart() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.toggle("hidden");
  }

  const cartContainer = document.getElementById("cartcontainer");
  cartContainer.classList.toggle("translate-x-full");
  subTotal();
  showSubTotal();
}

export async function addQuantity(value, id, price) {
<<<<<<< HEAD
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: Q } = await supabase
      .from("cart_items")
      .update({ quantity: value, product_price: price })
      .eq("product_id", id)
      .select();
  }
}

export async function addSize(id, size) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: Q } = await supabase
      .from("cart_items")
      .update({ size: size })
      .eq("product_id", id)
      .select();
  }
}

export async function subTotal() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: totals } = await supabase
      .from("cart_items")
      .select("product_price");
    const subtotal = [];
    if (totals.length < 1) {
      const subTotal = document.getElementById("sub-total");
      if (subTotal) subTotal.textContent = 0;
      return;
    }
    totals.forEach((total) => {
      subtotal.push(total.product_price);
      const totaled = subtotal.reduce((a, b) => a + b, 0);
      const subTotal = document.getElementById("sub-total");
      if (subTotal) {
        subTotal.textContent = totaled.toLocaleString();
      }
    });
  }
=======
  const { data: Q } = await supabase
    .from("cart_items")
    .update({ quantity: value, product_price: price })
    .eq("product_id", id)
    .select();
}

export async function addSize(id, size) {
  const { data: Q } = await supabase
    .from("cart_items")
    .update({ size: size })
    .eq("product_id", id)
    .select();
}

export async function subTotal() {
  const { data: totals } = await supabase
    .from("cart_items")
    .select("product_price");
  const subtotal = [];
  if (totals.length < 1) {
    const subTotal = document.getElementById("sub-total");
    if (subTotal) subTotal.textContent = 0;
    return;
  }
  totals.forEach((total) => {
    subtotal.push(total.product_price);
    const totaled = subtotal.reduce((a, b) => a + b, 0);
    const subTotal = document.getElementById("sub-total");
    if (subTotal) {
      subTotal.textContent = totaled.toLocaleString();
    }
  });
>>>>>>> 8116c5f (first)
}
subTotal();

export function showSubTotal() {
  setTimeout(() => {
    const sideCart = document.getElementById("sideCart");
    const checkOut = document.getElementById("checkoutDiv");
    const cartMessage = document.querySelector(".cart-text");
    if (sideCart && sideCart.innerHTML !== "") {
      checkOut.classList.remove("opacity-0");
      cartMessage.classList.add("hidden");
    } else if (sideCart && sideCart.innerHTML === "") {
      checkOut.classList.add("opacity-0");
      cartMessage.classList.remove("hidden");
    }
  }, 1000);
}

showSubTotal();

async function youMayLike(cat) {
  const { data: items } = await supabase
    .from("products")
    .select("*")
    .eq("category", cat)
    .order("random_id")
    .limit(3);
  const youLiked = document.getElementById("you-may-like");
  youLiked.innerHTML = "";
  items.forEach((item) => {
    const { data: urlData } = supabase.storage
      .from("productImage")
      .getPublicUrl(item.product_image);
    const prodImage = urlData.publicUrl;

    const youMayAlsoLike = document.createElement("div");

    const currentPagePath = window.location.pathname.split("?")[0];
    const productLink = `${currentPagePath}?id=${item.id}`;
    youMayAlsoLike.innerHTML += `<div
        class="capitalize h-full grid grid-rows-2 mt-10"
      >
       <div class=" flex items-center justify-center  overflow-hidden row-span-3 cursor-pointer"><a href="${productLink}"> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></a></div>

        <div class="flex-col items-center justify-center"> <div class="text-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm md:text-lg lg:text-xl mb-2 mt-2 ">${item.product_name}</h2></div>
        
    <div class= "w-full text-center border-b "><p class="text-[0.8rem] text-black font-semibold md:text-lg lg:text-xl">₦${item.product_price.toLocaleString()}</p></div>    
         <p class="text-[0.7rem] text-pink-500  font-bold hidden">${item.id}</p>
      
        
      </div></div>`;
    youLiked.appendChild(youMayAlsoLike);
  });
}

export function removeCartText() {
  const cartMessage = document.querySelector(".cart-text");
  if (cartMessage) {
    cartMessage.classList.add("hidden");
  }
}
<<<<<<< HEAD

// async function hhh() {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   console.log(user);
// }

// hhh();
=======
>>>>>>> 8116c5f (first)
