await context("console.log", "You are in the middle of the forest...");

await context("debug.wait", 1000);

while (true) {
  await context("debug.wait", 1000);
  const dice = Math.random() * 6;
  if (dice < 1) {
    break;
  }
  if (dice < 3) {
    await context("console.log", "You turned to left");
    continue;
  }
  if (dice < 5) {
    await context("console.log", "You turned to right");
    continue;
  }
  await context(
    "console.log",
    "A monster is waiting in the corner! What will you do?"
  );
  await context("debug.wait", 2000);
  const fight = confirm("Fight?");
  if (fight) {
    await context(
      "console.error",
      "dumbass. you don't fight monsters. you dead."
    );
    return;
  }
}

await context("console.log", "You exited the forest!!!");
