function setup() {
  document.getElementById("userPrompt").innerHTML = "What was the first action?";
  document.getElementById("result").style.visibility = "hidden";
  document.getElementById("result").innerHTML = "<strong>Referee calls: </strong>";

  const actions = {"attackleft": "Attack left", "attackright": "Attack right",
                    "polleft": "Point-in-line left", "polright": "Point-in-line right",
                     "simul": "Simultaneous attacks", "ycleft": "Yellow card left",
                     "ycright": "Yellow card right", "rcleft": "Red card left",
                     "rcright": "Red card right"};
  let x = document.getElementById("initialButtons");
  for (let i of Object.keys(actions)) {
    let button = document.createElement("input");
    button.type = "button";
    button.class = "firstaction";
    button.id = i;
    button.value = actions[i];
    button.addEventListener("click", initialUpdate);
    x.appendChild(button);
  }
}

function initialUpdate(event) {
  document.getElementById("initialButtons").style.visibility = "hidden";
  // document.getElementById("result").style.visibility = "visible";
  document.getElementById("result").innerHTML += event.target.value + " ";
  switch (event.target.id) {
    case "attackleft" || "attackright":
      attackResult("attack")
      break;
    case "polleft" || "polright":
      polResult();
      break;
    case "simul" || "ycright" || "ycleft":
      noTouch();
      break;
    case "rcleft" || "rcright":
      awardTouch();
      break;
    default:
      console.log("Error: check switch statement in initialUpdate")
  }
}

function attackResult(attack_type) {
  let b = document.getElementById("attackButtons");
  const actions = {"arrives": "arrives, ", "offtarget": "is off target, ",
                  "misses": "is no, ", "parrynoriposte": "is parried, no riposte. ",
                  "parryriposte": "is parried, riposte "};
  for (let i of Object.keys(actions)) {
    let button = document.createElement("input");
    button.type = "button";
    button.class = "attackresult";
    button.id = i;
    button.value = actions[i];
    button.addEventListener("click", attackUpdate);
    b.appendChild(button);
  }
}

function attackUpdate(event) {
  document.getElementById("attackButtons").style.visibility = "hidden";
  document.getElementById("result").innerHTML += event.target.value;
  // document.getElementById("result").style.visibility = "visible";

}
