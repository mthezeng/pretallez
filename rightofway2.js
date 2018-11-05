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
  const actions = {
    "attackleft": "Attack left",
    "attackright": "Attack right",
    "polleft": "Point-in-line left",
    "polright": "Point-in-line right",
    "simul": "Simultaneous attacks",
    "ycleft": "Yellow card left",
    "ycright": "Yellow card right",
    "rcleft": "Red card left",
    "rcright": "Red card right"
  };
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
      updateResult(event.target.value + ", ");
      updatePriority("left");
      awardTouch();
  } else if (event.target.id === "polright") {
      updateResult(event.target.value + ", ");
      updatePriority("right");
      awardTouch();
  } else if (event.target.id === "simul" || event.target.id ===  "ycright" || event.target.id === "ycleft") {
      updateResult(event.target.value + ", ");
      noTouch();
  } else if (event.target.id === "rcleft") {
      updateResult(event.target.value + ", ");
      updatePriority("right");
      awardTouch();
  } else if (event.target.id ===  "rcright") {
      updateResult(event.target.value + ", ");
      updatePriority("left");
      awardTouch();
  } else {
      console.log("Error: check if statements in initialUpdate");
  }
}

function Action(name) {
  this.name = name;
  this.userPrompt = document.getElementById("userPrompt");
}

function Attack(attack_type) {
  Action.call(this, attack_type);
}

Attack.prototype.result = function() {
  this.userPrompt.innerHTML = "What was the result of the " + this.name + "?"
  let b = document.getElementById("attackButtons");
  let actions = {
      "arrives": this.name + " arrives",
      "offtarget": this.name + " off target",
      "misses": this.name + " misses",
      "parried": this.name + " is parried"
    };
  }
  createButtons(actions, this.update);
}

Attack.prototype.update = function(event) {
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
  } else if (event.target.id === "parried") {
    updateResult("is parried, ");
    switchPriority();
    riposte();
  } else if (event.target.id === "counterparried") {
    updateResult("is counterparried, ");
    switchPriority();
    riposte();
  } else {
    console.log("Error: check if statements in attack update");
  }
}

function Riposte() {
  Attack.call("riposte");
}

Riposte.prototype.result = function() {
  this.userPrompt.innerHTML = "What was the result of the " + this.name + "?"
  let b = document.getElementById("attackButtons");
  let actions = {
    "arrives": this.name + " arrives",
    "offtarget": this.name + " off target",
    "misses": this.name + " misses",
    "counterparried": this.name + " is counterparried"
  };
  createButtons(actions, this.update);
}

function riposte() {
  document.getElementById("userPrompt").innerHTML = "Was there a riposte after the parry?";
  const actions = {
    "y": "Yes, riposte",
    "n": "No riposte"
  };
  createButtons(actions, riposteUpdate);
}

function riposteUpdate(event) {
  if (event.target.id === "y") {
    updateResult("riposte ");
    attackResult("riposte");
  } else if (event.target.id === "n") {
    updateResult("no riposte, ");
    switchPriority();
    attackContinuation();
  }
}

function defenderResponse() {
  document.getElementById("userPrompt").innerHTML = "Did the defender respond with a counterattack?"
  const response = {
    "y": "Counterattack",
    "n": "No counterattack"
  };
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
  const actions = {
    "remise": "Yes, remise",
    "no": "No"
  };
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
  /* parameters:
      actions: a dictionary with the keys as ids for button elements to be created
                and values as the values of the buttons, i.e. the text of the buttons
      resultFunc: a function to be called when the buttons are clicked
   */
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
    console.log("Error: switchPriority requires a currentPriority left or right to switch");
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
    console.log("Error: Check control statements in currentPriority.");
  }
}

function updateResult(action) {
  document.getElementById("result").innerHTML += action;
}
