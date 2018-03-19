function reset() {
  document.getElementById("userPrompt").style.visibility = "visible";
  document.getElementById("buttons").style.visibility = "visible";
  document.getElementById("priority").style.visibility = "visible"
  document.getElementById("result").style.visibility = "hidden";
  document.getElementById("result").innerHTML = "<strong>Referee calls:</strong> ";
  updatePriority("none");
  initial();
}

function initial() {
  document.getElementById("userPrompt").innerHTML = "What was the action?";
  const actions = {"attackleft": "Attack left", "attackright": "Attack right",
                    "polleft": "Point-in-line left", "polright": "Point-in-line right",
                     "simul": "Simultaneous attacks", "ycleft": "Yellow card left",
                     "ycright": "Yellow card right", "rcleft": "Red card left",
                     "rcright": "Red card right"};
  createButtons(actions, initialUpdate);
}

function initialUpdate(event) {
  document.getElementById("result").style.visibility = "visible";
  if (event.target.id === "attackleft") {
      updateResult(event.target.value + " ");
      updatePriority("left");
      attackResult("attack");
  } else if (event.target.id === "attackright") {
      updateResult(event.target.value + " ");
      updatePriority("right");
      attackResult("attack");
  } else if (event.target.id ===  "polleft") {
      updateResult(event.target.value + " ");
      updatePriority("left");
      polResult();
  } else if (event.target.id === "polright") {
      updateResult(event.target.value + " ");
      updatePriority("right");
      polResult();
  } else if (event.target.id === "simul" || event.target.id ===  "ycright" || event.target.id === "ycleft") {
      updateResult(event.target.value + ", ");
      noTouch();
  } else if (event.target.id === "rcleft" || event.target.id ===  "rcright") {
      updateResult(event.target.value + ", ");
      awardTouch();
  } else {
      console.log("Error: check control statements in initialUpdate")
  }
}

function attackResult(attack_type) {
  document.getElementById("userPrompt").innerHTML = "What was the result of the " + attack_type + "?"
  let b = document.getElementById("attackButtons");
  let actions
  if (attack_type === "riposte") {
    actions = {"arrives": attack_type + " arrives", "offtarget": attack_type + " off target",
                    "misses": attack_type + " misses", "nocounterriposte": attack_type + " is counterparried, no counterriposte",
                    "counterriposte": attack_type + " is counterparried, counterriposte"};
  } else {
    actions = {"arrives": attack_type + " arrives", "offtarget": attack_type + " off target",
                    "misses": attack_type + " misses", "parrynoriposte": attack_type + " is parried, no riposte",
                    "parryriposte": attack_type + " is parried, riposte"};
  }
  createButtons(actions, attackUpdate)
}

function attackUpdate(event) {
  // document.getElementById("result").style.visibility = "visible";
  if (event.target.id === "arrives") {
    updateResult("arrives, ");
    awardTouch();
  } else if (event.target.id === "offtarget") {
    updateResult("is off target, ");
    noTouch();
  } else if (event.target.id === "misses") {
    updateResult("is no, ");
    switchPriority();
    defenderResponse();
  } else if (event.target.id === "parrynoriposte") {
    updateResult("is parried, no riposte. ");
    attackContinuation();
  } else if (event.target.id === "parryriposte") {
    updateResult("is parried, riposte ");
    switchPriority();
    attackResult("riposte");
  } else if (event.target.id === "nocounterriposte") {
    updateResult("is counterparried, no counterriposte. ");
    attackContinuation();
  } else if (event.target.id === "counterriposte") {
    updateResult("is counterparried, counterriposte ");
    switchPriority();
    attackResult("riposte");
  } else {
      console.log("Error: check control statements in initialUpdate")
  }
}

function defenderResponse() {
  document.getElementById("userPrompt").innerHTML = "Did the defender respond with a counterattack?"
  const response = {"y": "Yes", "n": "No"};
  createButtons(response, defenderUpdate);
}

function defenderUpdate(event) {
  if (event.target.id === "y") {
    updateResult("counterattack ");
    attackResult("counterattack");
  } else if (event.target.id === "n") {
    switchPriority();
    attackContinuation();
  }
}

function attackContinuation() {
  document.getElementById("userPrompt").innerHTML = "Did the attacker continue their attack?";
  const actions = {"remise": "Yes, remise", "no": "No"};
  createButtons(actions, continuationUpdate);
}

function continuationUpdate(event) {
  if (event.target.id === "remise") {
    updateResult("remise ");
    attackResult("remise");
  } else if (event.target.id === "no") {
    updateResult("action resets. ");
    updatePriority("none");
    initial();
  }
}

function polResult() {
  document.getElementById("userPrompt").innerHTML = "What was the result of the point-in-line?";
  const actions = {"arrives, ": "Point-in-line arrives",
                    "is broken. ": "Point-in-line broken",
                    "is no. ": "Point-in-line misses",
                    "is beaten. ": "Opponent beats the blade"};
  createButtons(actions, polUpdate);
}

function polUpdate(event) {
  updateResult(event.target.id);
  if (event.target.id === "arrives, ") {
    awardTouch();
  } else {
    updatePriority("none");
    initial();
  }
}

function awardTouch() {
  updateResult("touch " + currentPriority() + ".");
  showResult();
}

function noTouch() {
  updateResult("no touch.");
  showResult();
}

function showResult() {
  document.getElementById("userPrompt").style.visibility = "hidden";
  document.getElementById("buttons").style.visibility = "hidden";
  document.getElementById("priority").style.visibility = "hidden";
  document.getElementById("result").style.visibility = "visible";
}

function createButtons(actions, resultFunc) {
  const element = document.getElementById("buttons");

  // remove all previous buttons
  while(element.hasChildNodes()) {
      element.removeChild(element.lastChild);
  }

  // add new buttons
  for (let i of Object.keys(actions)) {
    let button = document.createElement("input");
    button.type = "button";
    button.id = i;
    button.value = actions[i];
    button.addEventListener("click", resultFunc);
    element.appendChild(button);
  }
}

function createResetButtion() {
  let resetElement = document.getElementById("resetbutton");
  let resetButton = document.createElement("input");
  resetButton.type = "button";
  resetButton.id = "reset";
  resetButton.value = "Reset"
  resetButton.addEventListener("click", reset);
  resetElement.appendChild(resetButton)
}

function updatePriority(fencer) {
  if (fencer === "none") {
    document.getElementById("priority").innerHTML = "<strong>Current priority:</strong> None";
  } else if (fencer === "right") {
    document.getElementById("priority").innerHTML = "<strong>Current priority:</strong> Right";
  } else if (fencer === "left") {
    document.getElementById("priority").innerHTML = "<strong>Current priority:</strong> Left";
  }
}

function switchPriority() {
  if (currentPriority() === "right") {
    updatePriority("left");
  } else if (currentPriority() === "left") {
    updatePriority("right");
  } else {
    console.log("Error: switchPriority requires a currentPriority left or right to switch")
  }
}

function currentPriority() {
  if (document.getElementById("priority").innerHTML === "<strong>Current priority:</strong> Right") {
    return "right";
  } else if (document.getElementById("priority").innerHTML === "<strong>Current priority:</strong> Left") {
    return "left";
  } else if (document.getElementById("priority").innerHTML === "<strong>Current priority:</strong> None") {
    return "none";
  } else {
    console.log("Error: Check control statements in currentPriority.")
  }
}

function updateResult(action) {
  document.getElementById("result").innerHTML += action;
}
