import "./components/footerComponent.js";
import "./components/headerComponent.js";

const theme = localStorage.getItem("theme") || "light";
if(theme === "dark") {
  document.querySelector('html').classList.remove("light");
  document.querySelector("html").classList.add("dark");
}else if(theme === "light") {
  document.querySelector('html').classList.remove("dark");
  document.querySelector("html").classList.add("light");
}

