console.log("You are in the middle of the forest...");

await debug.wait(1000);

while (true) {
  await debug.wait(1000);
  const dice = Math.random() * 6;
  if (dice < 1) {
    break;
  }
  if (dice < 3) {
    console.log("You turned to left");
    continue;
  }
  if (dice < 5) {
    console.log("You turned to right");
    continue;
  }
  console.log("A monster is waiting in the corner! What will you do?");
  await debug.wait(2000);
  const fight = confirm("Fight?");
  if (fight) {
    console.error("dumbass. you don't fight monsters. you dead.");
    return;
  }
}

console.log("You exited the forest!!!");
