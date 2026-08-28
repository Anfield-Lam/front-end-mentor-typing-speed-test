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
	let randomInt;
	let remainingTime = 60;

	difficulty.addEventListener("click", () => {
		difficultyList.classList.toggle("hidden");
	})

	mode.addEventListener("click", () => {
		modeList.classList.toggle("hidden");
	})

	const difficultyListOptions = document.querySelector(".difficulty-list").querySelectorAll("*");
	const difficultySelected = document.querySelector(".difficulty-selected")
	const modeListOptions = document.querySelector(".mode-list").querySelectorAll("*");
	const modeListSelected = document.querySelector(".mode-selected")
	let data;

	fetch('./data.json')   
		.then(response => {
			if (!response.ok) {
				throw new Error("HTTP error " + response.status);
			}
			return response.json();
		})
		.then(jsonData => {
			data = jsonData;
			generatePassage("easy")
		})
		.catch(err => console.error("Error loading JSON:", err));

	const passageShown = document.querySelector(".passage-shown");

	difficultyListOptions.forEach((option) => {
		option.addEventListener("click", () => {
			options.forEach(item => {
				if (option.classList.contains(item)) {
					difficultySelected.textContent = shortforms[item];
          generatePassage(item);
				}
			})
			difficultyList.classList.toggle("hidden");	
		})
	})

	function generatePassage(item) {
		randomInt = getRandomInt(0, 9);
		passageShown.textContent = data[item][randomInt]["text"];
	}

	modeListOptions.forEach((option) => {
		option.addEventListener("click", () => {
			options.forEach(item => {
				if (option.classList.contains(item)) {
					modeListSelected.textContent = shortforms[item];
					changeMode(item);
				}
			})
			modeList.classList.toggle("hidden");
		})
	})

	const Mode = document.querySelector(".time .right")

	function changeMode(item) {
		if (item === "timed") Mode.textContent = `0:${remainingTime}`;
		else Mode.textContent = "-";
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const content = document.querySelector(".content:not(.clicked)")
	const startScreen = document.querySelector(".start-screen")
	const passageContainer = document.querySelector(".passage-container")
	const restartTestContainer = document.querySelector(".restart-test-container")
	const paddingOnTopOfRestartButton = document.querySelector(".padding-on-top-of-restart-button")

	content.addEventListener("click", () => {
		startScreen.classList.add("closed")
		passageContainer.classList.remove("blurred")
		difficultyList.classList.add("hidden");
		modeList.classList.add("hidden");
		restartTestContainer.classList.remove("hidden");
		paddingOnTopOfRestartButton.classList.add(".active")
		content.classList.add("clicked")
	})	


});