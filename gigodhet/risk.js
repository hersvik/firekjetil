
const roll = function(){
  return Math.floor(Math.random()*6 + 1);
}
let attackDice = [];
let defenseDice = [];

let offenseScore = 0;
let defenseScore = 0;

for (let i=0; i<999999; i++){
  attackDice[0] = roll();
  attackDice[1] = roll();
  attackDice[2] = roll();
  defenseDice[0] = roll();
  defenseDice[1] = roll();
  attackDice.sort().reverse();
  defenseDice.sort().reverse();

  // console.log(defenseDice)
  // console.log(attackDice)

  if (attackDice[0] > defenseDice[0]) {
    offenseScore++;
  }
  else {
    defenseScore++
  }

  if (attackDice[1] > defenseDice[1]) {
    offenseScore++;
  }
  else {
    defenseScore++
  }

}
console.log("defense", defenseScore)
console.log("offense", offenseScore)