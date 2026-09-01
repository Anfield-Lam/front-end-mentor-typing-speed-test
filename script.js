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
	let lineSkipHeight = 0;
	let curr = 0;
	let errors = 0;
	let percentage;
	let firstWord = false;
	let testIsCompleted = false;
	let wordsPerMinute;

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
			if (!testStarted) {
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
			}
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
			if (!testStarted) {
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
			}
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
	const wpm = document.querySelector(".wpm .right");
	const testScreen = document.querySelector(".test-screen")
	const header = document.querySelector(".header")

	const endScreen = document.querySelector(".end-screen")
	const completeTick = document.querySelector(".complete-tick")

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

	function updateWpm(time) {
		wordsPerMinute = ((curr + 1) / 5 - errors) / (60 - time) * 60;
		if (wordsPerMinute < 0) wordsPerMinute = 0;
		wordsPerMinute = Math.round(wordsPerMinute)
		wpm.textContent = wordsPerMinute
	}

	function startTimer() {
		const timer = setInterval(function() {
			remainingTime --;
			Mode.textContent = `0:${remainingTime}`;
			if (remainingTime <= 0 && !testIsCompleted) {
				clearInterval(timer);
				timeIsUp(); //temp
			}
			if (firstWord) updateWpm(remainingTime);
			Mode.classList.add("not-60")
		}, 1000)
	}

	function timeIsUp() {
		testScreen.classList.add("closed")
		content.classList.add("closed")
		restartTestContainer.classList.add("hidden")
		endScreen.remove("closed")
	}

	function startTyping() {
		initializePassage()
		updateCurr(curr);
		const skipLineIndexes = CheckForLineSkips();
		skipLineIndexes.splice(0, 3)
		document.addEventListener("keydown", (e) => {
			const allowed = /^[a-zA-Z]$/;
			if (
				!(allowed.test(e.key) || 
				e.key === " " || 
				e.key === "," || 
				e.key === "." ||  
				e.key === "Backspace" ||
			  e.key === "\"" ||
				e.key === "-" ||
				e.key === ":")
			) return ;
			if (e.key === "Backspace" && curr > 0) {
				curr --;
				revertKeyPress(curr);
				if (skipLineIndexes.includes(curr + 1)) passageChangePosition(-1);
			}
			else if (e.key !== "Backspace" && curr < currentTextPassage.length) {
				if (e.key === currentTextPassage[curr]) {
					correctKey(curr);
					if (e.key === " ") firstWord = true;
				}
				else wrongKey(curr);
				curr ++;
				if (skipLineIndexes.includes(curr)) passageChangePosition(1);
			}
			calculateAccuracy();
			updateCurr(curr);	
			if (curr === currentTextPassage.length) testCompleted();
		})
	}

	const testCompleteText = document.querySelector(".test-complete-text");
	const boxFirstTextBottom = document.querySelector(".box.first .text.bottom");
	const boxSecondTextBottom = document.querySelector(".box.second .text.bottom");
	const boxThirdTextBottom = document.querySelector(".box.third .text.bottom").children;

	function testCompleted() {
		testScreen.classList.add("closed")
		content.classList.add("closed")
		restartTestContainer.classList.add("hidden")
		endScreen.classList.add("active")
		completeTick.classList.add("active")
		header.classList.add("height-reduction")
		testIsCompleted = true;
		testCompleteText.classList.add("active");
		boxFirstTextBottom.textContent = wordsPerMinute;
		boxSecondTextBottom.textContent = `${Math.round(percentage)}%`;
		boxThirdTextBottom[0].textContent = `${currentTextPassage.length-errors}`;
		boxThirdTextBottom[2].textContent = `${errors}`;
	}

	const accuracy = document.querySelector(".accuracy .right")

	function calculateAccuracy() {
		if (!curr) {percentage = 100;}
		else {percentage = (curr - errors) / curr * 100;}
		accuracy.textContent = `${Math.round(percentage)}%`

		if (percentage === 100) accuracy.classList.add("flawless");
		else accuracy.classList.remove("flawless")
	}

	function passageChangePosition(num) {
		lineSkipHeight += 3.1 * num
		document.documentElement.style.setProperty("--line-skip-padding", `${lineSkipHeight}rem`);
	}

	function revertKeyPress(num) {
		let key = document.querySelector(`.num-${num}`)
		if (key.classList.contains("wrong")) errors -= 1;
		key.classList.remove("correct")	
		key.classList.remove("wrong")	
	}

	function correctKey(num) {
		let key = document.querySelector(`.num-${num}`)
		key.classList.add("correct")				
	}

	function wrongKey(num) {
		errors ++;
		let key = document.querySelector(`.num-${num}`)
		key.classList.add("wrong")				
	}


	function CheckForLineSkips() {
		const spans = document.querySelectorAll("span");
		const List = []

		spans.forEach((span, index) => {
			if (index > 0) {
				const prev = spans[index - 1];
				const currTop = span.getBoundingClientRect().top;
				const prevTop = prev.getBoundingClientRect().top;

				if (currTop > prevTop) List.push(index)
			}
		});
		return List;
	}

	function initializePassage() {
		passageShown.textContent = ""
		let pointer = 0;
		currentTextPassage.split("").forEach((letter) => {
			const span = document.createElement("span");
			span.textContent = letter;
			span.classList.add(`num-${pointer}`)
			passageShown.appendChild(span)
			pointer ++;
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