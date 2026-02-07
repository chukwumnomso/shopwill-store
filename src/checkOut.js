import "./style.css";
import { getSupabase } from "./supabaseClient";

import { sideBar } from "./main";
import { subTotal } from "./viewProduct";
import { showSubTotal } from "./viewProduct";
import { cartCount } from "./viewProduct";
import { navModal } from "./main";
import { navShop } from "./main";
import { toFormData } from "axios";

const supabase = getSupabase();

export async function checkoutSummary() {
  const orderSummary = document.getElementById("order-summary");
  //   orderSummary.innerHTML = "";
  orderSummary.innerHTML = "";
  const { data: orders } = await supabase.from("cart_items").select("*");
  orders.forEach((order) => {
    const orderCard = document.createElement("div");
    orderCard.classList = " mt-4";
    orderCard.innerHTML += `<div class="bg-gray-50 grid grid-cols-3 items-center px-4 py-4 gap-4"><div class="col-span-2 grid grid-rows-3 gap-4"><h1 class="font-bold text-lg font[playfar] capitalize">${order.product_name}</h1> <p class="text-gray-600 font-[montserrat] text-sm"> (${order.size})<span class="text-green-500">X</span> ${order.quantity} </p></div>
    
    
    
    
    <div class="font-[montserrat] font-bold text-sm text-end">₦${order.product_price}</div></div>`;
    orderSummary.appendChild(orderCard);
  });
}
checkoutSummary();

const checkedOut = document.getElementById("checkedout");
console.log(checkedOut);

// if (checkedOut) {
//   checkedOut.addEventListener("click", () => {
//     constant
//     initiatePayment();
//   });
// }

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("email").value;
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  if (emailInput === "" || firstName === "" || lastName === "") {
    alert("please fill the required fields");
    return;
  }
  const subTotal = document.getElementById("sub-total").textContent;
  const amount = subTotal.replace(/[^0-9.\-]/g, "");
  const total = parseInt(amount) * 100;
  if (total === 0) {
    alert("your cart is empty");
    return;
  }
  const data = {
    first: firstName,
    last: lastName,
    total: total,
  };
  localStorage.setItem("datas", JSON.stringify(data));

  payNow(emailInput, total);
});

function payNow(emailInput, total) {
  try {
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: "pk_test_5beaff3772f67712d864102467e6a7518fcea296",
      email: emailInput,
      amount: total,
      currency: "NGN",

      onSuccess: (transaction) => {
        alert("Transaction Successful! Ref: " + transaction.reference);
        confirm();
      },
      onCancel: () => {
        alert("You cancelled the payment.");
      },
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function confirm() {
  const { data: del } = await supabase
    .from("cart_items")
    .delete()
    .neq("product_id", 0);

  const paymentSection = document.getElementById("paymentSection");
  paymentSection.innerHTML = "";
  const confirmPage = document.getElementById("confirm-page");
  confirmPage.innerHTML = "";
  confirmPage.classList.toggle("hidden");
  const data = JSON.parse(localStorage.getItem("datas"));
  console.log(data);
  const total = parseInt(data.total) / 100;
  const confirmDiv = document.createElement("div");
  confirmDiv.classList = "w-full";
  confirmDiv.innerHTML = `  
      <div class="w-full bg-white shadow-lg shadow-black py-5 md:w-[70%]">
        <div
          class="text-center capitalize text-3xl text-green-600 font-[playfair] font-extrabold"
        >
          <h1>payment successful</h1>
          <p class="text-sm font-medium text-black mt-2">
            thank you for your order,
            <span class="text-sm text-black font-extrabold">${data.first}</span>
            <span class="text-sm text-black font-extrabold">${data.last}</span>
          </p>
          <div class="text-sm font-medium text-black mt-2">
            <div class="w-full flex items-center justify-center">
              <img src="./public/assets/green mark.png" alt="" />
            </div>

            <p class="text-lg">
              total paid:
              <span class="text-lg font-[playfair] font-extrabold">${total.toLocaleString()}</span>
            </p>
            <p class="text-[0.8rem] text-gray-400 mt-2">
              payment method paystack
            </p>
          </div>
          <button
            class="bg-black text-white font-[montserrat]font-bold text-sm h-10 w-40 hover:text-pink-600 transition-all duration-300 cursor-pointer mt-4"
          >
           <a href="./index.html"> countinue shopping</a>
          </button>
        </div>
      </div>

  `;
  confirmPage.appendChild(confirmDiv);
  localStorage.clear();
}
