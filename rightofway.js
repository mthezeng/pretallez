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
  // document.getElementById("result").style.visibility = "visible";
  if (event.target.id === "attackleft" || event.target.id === "attackright") {
      document.getElementById("result").innerHTML += event.target.value + " ";
      attackResult("attack");
  } else if (event.target.id ===  "polleft" || event.target.id === "polright") {
      document.getElementById("result").innerHTML += event.target.value + " ";
      polResult();
  } else if (event.target.id === "simul" || event.target.id ===  "ycright" || event.target.id === "ycleft") {
      document.getElementById("result").innerHTML += event.target.value + ", "
      noTouch();
  } else if (event.target.id === "rcleft" || event.target.id ===  "rcright") {
      document.getElementById("result").innerHTML += event.target.value + ", "
      awardTouch();
  } else {
      console.log("Error: check control statements in initialUpdate")
  }
}

function attackResult(attack_type) {
  document.getElementById("userPrompt").innerHTML = "What was the result of the " + attack_type + "?"
  let b = document.getElementById("attackButtons");
  const actions = {"arrives": attack_type + " arrives", "offtarget": attack_type + " off target",
                  "misses": attack_type + " misses", "parrynoriposte": attack_type + " is parried, no riposte",
                  "parryriposte": attack_type + " is parried, riposte"};
  createButtons(actions, attackUpdate)
}

function attackUpdate(event) {
  // document.getElementById("result").style.visibility = "visible";
  if (event.target.id === "arrives") {
    document.getElementById("result").innerHTML += "arrives, ";
    awardTouch();
  } else if (event.target.id === "offtarget") {
    document.getElementById("result").innerHTML += "is off target, ";
    noTouch();
  } else if (event.target.id === "misses") {
    document.getElementById("result").innerHTML += "is no, ";
    defenderResponse();
  } else if (event.target.id === "parrynoriposte") {
    document.getElementById("result").innerHTML += "is parried, no riposte. ";
    attackContinuation();
  } else if (event.target.id === "parryriposte") {
    document.getElementById("result").innerHTML += "is parried, riposte ";
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
    document.getElementById("result").innerHTML += "counterattack ";
    attackResult("counterattack");
  } else if (event.target.id === "n") {
    attackContinuation();
  }
}

function attackContinuation() {
  document.getElementById("userPrompt").innerHTML = "Did the attacker continue their attack?";
  const actions = {"remise": "Yes, remise", "redoublement": "Yes, redoublement", "no": "No"};
  createButtons(actions, continuationUpdate);
}

function continuationUpdate(event) {
  if (event.target.id === "remise") {
    document.getElementById("result").innerHTML += "remise ";
    attackResult("remise");
  } else if (event.target.id === "redoublement") {
    document.getElementById("result").innerHTML += "redoublement ";
    attackResult("redoublement");
  } else if (event.target.id === "no") {
    document.getElementById("result").innerHTML += "action resets. ";
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
  document.getElementById("result").innerHTML += event.target.id;
  if (event.target.id === "arrives, ") {
    awardTouch();
  } else {
    initial();
  }
}

function awardTouch() {
  document.getElementById("result").innerHTML += "touch.";
  showResult();
}

function noTouch() {
  document.getElementById("result").innerHTML += "no touch.";
  showResult();
}

function showResult() {
  document.getElementById("userPrompt").style.visibility = "hidden";
  document.getElementById("buttons").style.visibility = "hidden";
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
