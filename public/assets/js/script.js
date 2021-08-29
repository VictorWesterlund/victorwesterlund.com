function toggleMenu() {
	const speed = 200;
	const menu = document.getElementsByTagName("main")[0];

	menu.style.setProperty("transition",`${speed}ms`);
	menu.classList.toggle("active");
	setTimeout(() => menu.style.removeProperty("transition"),speed + 1);
}

for(const element of document.getElementsByClassName("hamburger")) {
	element.addEventListener("click",() => toggleMenu());
}