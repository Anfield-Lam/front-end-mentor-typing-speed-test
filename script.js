document.addEventListener("DOMContentLoaded", () => {  
	const difficulty = document.querySelector(".difficulty");
	const mode = document.querySelector(".mode");
	const difficultyList = document.querySelector(".outer-difficulty-list");
	const modeList = document.querySelector(".outer-mode-list");

	difficulty.addEventListener("click", () => {
		difficultyList.classList.toggle("hidden");
	})
	mode.addEventListener("click", () => {
		modeList.classList.toggle("hidden");
	})
});