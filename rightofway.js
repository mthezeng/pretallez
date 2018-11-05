/** Object containing array of Actions, representing the call made by the ref. */
let Call = {
  actions : [],
  result : "none",
  toString : function() {
    let result = "";
    let i;
    for (i = 0; i < actions.length - 1; i++) {
      result += actions[i].toString() + ", ";
    }
    result += actions[i].toString() + ".";
    return result;
  }
};

/** Object representing a single fencing action.
 * @param {string} name - the name of the action, e.g. "attack", "parry",
                          "riposte", etc.
 * @param {string} fencer - either "left" or "right": the fencer that performed
                            this action
 * @param {string} result - optional (should be defined later, though).
                            the result of the action, e.g. "arrives", "is no",
                            "off target", etc.
 */
function Action(type, fencer, result) {
  this.type = type;
  this.fencer = fencer;
  this.result = result || "none";
}

Action.prototype.toString = function() {
  return this.type + " " + this.fencer + " " + this.result;
}

/** Resets the buttons to the initial state. */
function reset() {
  document.getElementById("userPrompt").style.visibility = "visible";
  document.getElementById("buttons").style.visibility = "visible";
  document.getElementById("priority").style.visibility = "visible"
  document.getElementById("result").style.visibility = "hidden";
  document.getElementById("result").innerHTML = "<strong>Referee calls:</strong> ";
  Call.actions = [];
  Call.result = "none";
  updatePriority("none");
  initial();
}

/** Creates the first buttons that the user will choose from. */
function initial() {
  document.getElementById("userPrompt").innerHTML = "What was the action?";
  const actions = {
    "attackleft": "Attack left",
    "attackright": "Attack right",
    "polleft": "Point-in-line left",
    "polright": "Point-in-line right",
    "simul": "Simultaneous attacks"
  };
  createButtons(actions, initialUpdate);
}

/** Determines what happens after one of the initial buttons is chosen.
 * @param {Object} event - contains attributes of the button that called this function
 */
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
  } else if (event.target.id === "simul") {
      updateResult(event.target.value + ", ");
      noTouch();
  } else {
      console.log("Error: check if statements in initialUpdate");
  }
}

/** Creates the buttons that will ask the user what happened after a kind of attack.
 * @param {string} attackType - the kind of aggressive action, e.g. "attack",
                                "counterattack", "riposte"
 */
function attackResult(attackType) {
  Call.actions.push(new Action(attackType, currentPriority()));
  document.getElementById("userPrompt").innerHTML = "What was the result of the " + attackType + "?";
  let b = document.getElementById("attackButtons");
  let actions;
  if (attackType === "attack") {
    actions = {
      "arrives": attackType + " arrives",
       "offtarget": attackType + " off target",
       "misses": attackType + " misses",
       "parried": attackType + " is parried"};
  } else if (attackType === "counterattack") {
     actions = {
       "arrives": attackType + " arrives",
       "offtarget": attackType + " off target",
       "misses2nd": attackType + " misses",
       "parried": attackType + " is parried",
     };
  } else {
    actions = {
      "arrives": attackType + " arrives",
      "offtarget": attackType + " off target",
      "misses2nd": attackType + " misses",
      "counterparried": attackType + " is counterparried"
    };
  }
  createButtons(actions, attackUpdate);
}

/** Determines what happens after one of the buttons from attackResult is chosen.
 * @param {Object} event - contains attributes of the button that called this function
 */
function attackUpdate(event) {
  // document.getElementById("result").style.visibility = "visible";
  let currentAction = Call.actions[Call.actions.length - 1];
  if (event.target.id === "arrives") {
    updateResult("arrives, ");
    currentAction.result = "arrives";
    awardTouch();
  } else if (event.target.id === "offtarget") {
    updateResult("is off target, ");
    currentAction.result = "off target";
    noTouch();
  } else if (event.target.id === "misses") {
    updateResult("is no, ");
    currentAction.result = "is no";
    switchPriority();
    defenderResponse();
  } else if (event.target.id === "misses2nd") {
    updateResult("is no, ");
    currentAction.result = "is no";
    switchPriority();
    attackContinuation();
  } else if (event.target.id === "parried") {
    updateResult("is parried, ");
    currentAction.result = "parried";
    switchPriority();
    riposte();
  } else if (event.target.id === "counterparried") {
    updateResult("is counterparried, ");
    switchPriority();
    riposte();
  } else {
      console.log("Error: check if statements in initialUpdate");
  }
}

/** Creates the buttons that will ask the user whether a riposte occurred after a parry. */
function riposte() {
  document.getElementById("userPrompt").innerHTML = "Was there a riposte attempt after the parry?";
  const actions = {"y": "Yes, riposte", "n": "No riposte"};
  createButtons(actions, riposteUpdate);
}

/** Determines what happens after one of the buttons from riposte() is chosen.
 * @param {Object} event - contains attributes of the button that called this function
 */
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

/** Creates the buttons that ask the user whether a counterattack was performed by the defender. */
function defenderResponse() {
  document.getElementById("userPrompt").innerHTML = "Did the fencer on the " + currentPriority() + " respond with a counterattack?"
  const response = {"y": "Counterattack", "n": "No counterattack"};
  createButtons(response, defenderUpdate);
}

/** Determines what happens after one of the buttons from defenderResponse is chosen.
 * @param {Object} event - contains attributes of the button that called this function
 */
function defenderUpdate(event) {
  if (event.target.id === "y") {
    updateResult("counterattack ");
    attackResult("counterattack");
  } else if (event.target.id === "n") {
    switchPriority();
    attackContinuation();
  }
}

/** Creates the buttons that ask whether a remise/attack continuation was performed.
 * NOTE: Currenly supports only remises. Maybe add reprises or redoublements in future,
 * depending on demand.
 */
function attackContinuation() {
  document.getElementById("userPrompt").innerHTML = "Did the fencer on the " + currentPriority() + " continue their action?";
  const actions = {"remise": "Yes, remise", "no": "No"};
  createButtons(actions, continuationUpdate);
}

/** Determines what happens after one of the buttons from attackContinuation is chosen.
 * @param {Object} event - contains attributes of the button that called this function
 */
function continuationUpdate(event) {
  if (event.target.id === "remise") {
    updateResult("remise ");
    attackResult("remise");
  } else if (event.target.id === "no") {
    updatePriority("none");
    noTouch();
  }
}

/** Ends the current fencing phrase with a touch to the fencer with priority. */
function awardTouch() {
  updateResult("touch " + currentPriority() + ".");
  Call.result = currentPriority();
  showResult();
}

/** Ends the current fencing phrase with no touch to either fencer. */
function noTouch() {
  updateResult("no touch.");
  showResult();
}

/** Hides all buttons and user prompt messages,
 * shows the final result, if it is not already visible. */
function showResult() {
  document.getElementById("userPrompt").style.visibility = "hidden";
  document.getElementById("buttons").style.visibility = "hidden";
  document.getElementById("priority").style.visibility = "hidden";
  document.getElementById("result").style.visibility = "visible";
}

 /**
 * Creates the buttons given a set of actions and results.
 * @param {Object} actions - a set of possible actions in the current fencing phrase,
                            keys are ids for button elements, values are text of buttons
 * @param {function} resultFunc - a function to be called when the buttons are clicked
 */
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

/** Creates the reset button that allows the user to cancel their input and
  * return to the start. Called directly within index.html. */
function createResetButtion() {
  let resetElement = document.getElementById("resetbutton");
  let resetButton = document.createElement("input");
  resetButton.type = "button";
  resetButton.id = "reset";
  resetButton.value = "Reset";
  resetButton.addEventListener("click", reset);
  resetElement.appendChild(resetButton);
}

/** Sets the fencer that currently has the priority, based on user input. */
function updatePriority(fencer) {
  if (fencer === "none") {
    document.getElementById("priority").innerHTML = "<strong>Current priority:</strong> None";
  } else if (fencer === "right") {
    document.getElementById("priority").innerHTML = "<strong>Current priority:</strong> Right";
  } else if (fencer === "left") {
    document.getElementById("priority").innerHTML = "<strong>Current priority:</strong> Left";
  }
}

/** Switches the current priority from left to right or left to right. */
function switchPriority() {
  if (currentPriority() === "right") {
    updatePriority("left");
  } else if (currentPriority() === "left") {
    updatePriority("right");
  } else {
    console.log("Error: switchPriority requires a currentPriority left or right to switch");
  }
}

/** Gets the current priority set by updatePriority and switchPriority */
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

/** Updates the result displayed in the "result" element.
 * NOTE: Possibly could be superceded by the Call object's toString method.
 */
function updateResult(action) {
  document.getElementById("result").innerHTML += action;
}
