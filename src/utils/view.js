setTimeout(function() {
  console.log(1);
}, 100);
setTimeout(function () {
  console.log(2);
}, 0)
Promise.resolve(console.log(3)).then(() => { 
  console.log(4)
})
async function async1 () {
  console.log(5)
  await async2()
  console.log(6)
}
async function async2 () {
  console.log(7)
}
async1()
console.log(8)