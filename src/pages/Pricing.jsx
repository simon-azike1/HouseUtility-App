import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Footer from '../components/Footer'
import Navbar from "../components/Navbar";


const plans = [
  {
    name: "Starter",
    price: "$9",
    features: ["Basic task tracking", "Up to 5 projects", "Community support"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    features: ["Unlimited projects", "Team collaboration", "Priority support", "Custom branding"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Advanced analytics", "Dedicated manager", "Onboarding & training", "24/7 support"],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
  
    <div className=" bg-white">
    <Navbar/> 
    {/* Hero Section */}
<section className="relative text-white h-[400px] sm:h-[500px] md:h-[550px]">
  {/* Background Image + Overlay */}
  <div className="absolute inset-0">
    <img
      src="https://plus.unsplash.com/premium_photo-1661693427490-c0ace26ca588?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI2fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500"
      alt="Pricing Hero"
      className="w-full h-full object-cover max-h-[550px]"
    />
    <div className="absolute inset-0 bg-black/70"></div> {/* Black overlay */}
  </div>

  {/* Hero Content */}
  <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center">
    <motion.h1
      className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      Simple & Flexible Pricing
    </motion.h1>

    <motion.p
      className="text-md sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      Choose the plan that fits your team best. Upgrade anytime as you grow and enjoy transparent pricing with no surprises.
    </motion.p>
  </div>
</section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-2xl shadow-md p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-blue-600 text-white scale-105 shadow-xl"
                  : "bg-white"
              }`}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                {plan.price}
                <span className="text-lg font-normal">
                  {plan.price !== "Custom" && "/month"}
                </span>
              </p>

              <ul className="mb-8 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check
                      className={`w-5 h-5 ${
                        plan.highlighted ? "text-white" : "text-green-500"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 font-semibold rounded-xl transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
}
