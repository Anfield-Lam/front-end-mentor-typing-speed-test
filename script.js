document.addEventListener("DOMContentLoaded", () => {  
	const difficulty = document.querySelector(".difficulty");
	const mode = document.querySelector(".mode");
	const OuterDifficultyList = document.querySelector(".outer-difficulty-list");
	const OuterModeList = document.querySelector(".outer-mode-list");
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
	let currentTextPassage;
	let testStarted = false;

	difficulty.addEventListener("click", () => {
		OuterDifficultyList.classList.toggle("hidden");
	})

	mode.addEventListener("click", () => {
		OuterModeList.classList.toggle("hidden");
	})

	const difficultyList = document.querySelector(".difficulty-list").querySelectorAll("*");
	const difficultySelected = document.querySelector(".difficulty-selected")
	const modeList = document.querySelector(".mode-list").querySelectorAll("*");
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

	difficultyList.forEach((option) => {
		option.addEventListener("click", () => {
			difficultyList.forEach((item) => {
				item.classList.remove("active")
			})
			option.classList.add("active")
			options.forEach(item => {
				if (option.classList.contains(item)) {
					difficultySelected.textContent = shortforms[item];
          generatePassage(item);
				}
			})
			OuterDifficultyList.classList.toggle("hidden");	
		})
	})

	function generatePassage(item) {
		randomInt = getRandomInt(0, 9);
		currentTextPassage = data[item][randomInt]["text"];
		passageShown.textContent = currentTextPassage;
	}

	modeList.forEach((option) => {
		option.addEventListener("click", () => {
			modeList.forEach((item) => {
				item.classList.remove("active")
			})
			option.classList.add("active")
			options.forEach(item => {
				if (option.classList.contains(item)) {
					modeListSelected.textContent = shortforms[item];
					changeMode(item);
				}
			})
			OuterModeList.classList.toggle("hidden");
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
	const timed = document.querySelector(".timed");

	content.addEventListener("click", () => {
		if (testStarted === true) return
		testStarted = true;
		startScreen.classList.add("closed")
		passageContainer.classList.remove("blurred")
		OuterDifficultyList.classList.add("hidden");
		OuterModeList.classList.add("hidden");
		restartTestContainer.classList.remove("hidden");
		paddingOnTopOfRestartButton.classList.add(".active")
		content.classList.add("clicked")
		if (timed.classList.contains("active")) startTimer();
		startTyping();
	})

	function startTimer() {
		const timer = setInterval(function() {
			remainingTime --;
			Mode.textContent = `0:${remainingTime}`;
			if (remainingTime <= 0) {
				clearInterval(timer);
				location.reload(); //temp
			}
		}, 1000)
	}

	function startTyping() {
		initializePassage()
		let curr = 0;
		updateCurr(curr);
		document.addEventListener("keydown", (e) => {
			curr ++;
			updateCurr(curr);
		})
	}

	function initializePassage() {
		passageShown.textContent = ""
		currentTextPassage.split("").forEach((letter) => {
			const span = document.createElement("span");
			span.textContent = letter;
			passageShown.appendChild(span)
		})
	}

	function updateCurr(curr) {
		const spans = document.querySelectorAll("span")
		spans.forEach((item, index) => {
			item.classList.remove("curr")
			if (curr == index) item.classList.add("curr")
		})
	}

	const restartButton = document.querySelector(".restart-button");
	restartButton.addEventListener("click", () => {
		location.reload();
	})

});