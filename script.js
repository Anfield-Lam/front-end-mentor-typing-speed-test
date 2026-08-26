document.addEventListener("DOMContentLoaded", () => {  
	const difficulty = document.querySelector(".difficulty");
	const mode = document.querySelector(".mode");
	const difficultyList = document.querySelector(".outer-difficulty-list");
	const modeList = document.querySelector(".outer-mode-list");
	const options = ["easy", "medium", "hard", "timed", "passage"];
	const shortforms = {
		"easy": "Easy",
		"medium": "Medium",
    "hard": "Hard",
		"timed": "Timed (60s)",
		"passage": "Passage"
	}

	difficulty.addEventListener("click", () => {
		difficultyList.classList.toggle("hidden");
	})

	mode.addEventListener("click", () => {
		modeList.classList.toggle("hidden");
	})

	const difficultyListOptions = document.querySelector(".difficulty-list").querySelectorAll("*");
	const difficultySelected = document.querySelector(".difficulty-selected")
	const modeListOptions = document.querySelector(".mode-list").querySelectorAll("*")
	const modeListSelected = document.querySelector(".mode-selected")

	difficultyListOptions.forEach((option) => {
		option.addEventListener("click", () => {
			options.forEach(item => {
				if (option.classList.contains(item)) {
					difficultySelected.textContent = shortforms[item];
				}
			})
			difficultyList.classList.toggle("hidden");	
		})
	})

	modeListOptions.forEach((option) => {
		option.addEventListener("click", () => {
			options.forEach(item => {
				if (option.classList.contains(item)) {
					modeListSelected.textContent = shortforms[item];
				}
			})
			modeList.classList.toggle("hidden");
		})
	})
});