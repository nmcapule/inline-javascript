// debug.enabled = false;

const DEFAULT_ARRAY_LENGTH = 10;
const DEFAULT_ARRAY_SORTER = "in";
const DISABLE_PROMPT = true;

async function shellsort(arr) {
  const gaps = [701, 301, 132, 57, 23, 10, 4, 1];
  for (const gap of gaps) {
    for (let i = gap; i < arr.length; i++) {
      temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];

        await debug.wait(10);
        console.clear();
        console.log(JSON.stringify(arr, null, 2));
      }
      arr[j] = temp;

      await debug.wait(10);
      console.clear();
      console.log(JSON.stringify(arr, null, 2));
    }
  }
}

async function bubblesort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      await debug.wait(100);

      if (arr[i] > arr[j]) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;

        console.clear();
        console.log(JSON.stringify(arr, null, 2));
      }
    }
  }
}

async function insertionsort(arr) {
  console.log("asd");
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      await debug.wait(100);

      if (arr[j + 1] < arr[j]) {
        const tmp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = tmp;

        console.clear();
        console.log(JSON.stringify(arr, null, 2));
      }
    }
  }
}

prompt = (msg, defaultValue) =>
  DISABLE_PROMPT ? defaultValue : window.prompt(msg, defaultValue);

const length = parseInt(prompt("array length:", DEFAULT_ARRAY_LENGTH));
const arr = Array.from({ length })
  .map(Math.random)
  .map((x) => parseInt(x * 30))
  .map((x) => Array.from({ length: x }).fill("|").join(""));

const sorter = prompt(
  "`bubblesort` or `shellsort` or `insertionsort`?",
  DEFAULT_ARRAY_SORTER
);
const watch = new Date();
switch (sorter.slice(0, 2)) {
  case "bu":
    await bubblesort(arr);
    break;
  case "sh":
    await shellsort(arr);
    break;
  case "in":
    await insertionsort(arr);
    break;
}

return `executed for ${new Date() - watch} ms`;
