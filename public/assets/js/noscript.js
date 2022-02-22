const search = document.getElementById("search").children[0];
const results = document.getElementById("results").children[0];

search.style.setProperty("display","none");
results.classList.add("error");
results.innerText = "Sorry, your browser isn't supported yet";