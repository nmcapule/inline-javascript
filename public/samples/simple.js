// debug.enabled = false;

const watch = new Date();

const arr = Array.from({ length: 10 })
  .map(Math.random)
  .map((x) => parseInt(x * 100));

for (let i = 0; i < arr.length - 1; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    await debug.wait(100);

    if (arr[i] > arr[j]) {
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;

      console.clear();
      console.log(arr);
    }
  }
}

return `executed for ${new Date() - watch} ms`;
