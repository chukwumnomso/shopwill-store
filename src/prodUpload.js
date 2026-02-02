import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jyftjplwefbyzhaoprgb.supabase.co";
const supabaseKey = "sb_publishable_UBJCM7-3VAcTquVoWS3bog_c2uqtM2H";
export const supabase = createClient(supabaseUrl, supabaseKey);
// END OF SUPABASE INITILIZATION

import { prodName } from "./main";
import { price } from "./main";
import { prodId } from "./main";

// END OF IMPORTS

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
      prodcard.classList = "h-70 sm:h-80";
      prodcard.innerHTML = `<div
        class="rounded-xl  capitalize relative h-full grid grid-rows-2   "
      >
       <div class=" flex items-center justify-center overflow-hidden row-span-3 cursor-pointer"><a href="/shopwill-store/cart.html?id=${card.id}"> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></a></div>

        <div class="flex-col items-center justify-center"> <div class="flex justify-between items-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm mb-2 mt-2 lg:text-lg">${card.product_name}</h2><button"> <img src="${cartIcon}" alt="" class="rounded-full size-8 hover:scale-104 transition-all duration-200 cursor-pointer"> </button></div>
        
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
          .then((get) => {
            const solds = document.querySelectorAll(".sold");
            solds.forEach((sold) => {
              sold.classList.add("hidden");
            });
          })
          .catch((error) => console.error(error));
      };
      controls.appendChild(btn);
    }
  }
}

renderProduct(currentPage);
