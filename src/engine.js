export const Int = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    // alias default
    'for': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10
}

export function isAlias(name, reference){    
    for (var i = 0; i<reference.name.length; i++){
      //reference.name is a list
      if (name === reference.name[i])
        return true;
    }
    return false;
  }

//gets a list of strings, checks that it's not an override
export function isCommand(manualAddCheck, currentElixir){
    var amount;
    var newValue;
    if (manualAddCheck.length !== 2)
        return -1;
    
    amount = manualAddCheck[1];

    if (isNaN(+parseInt(amount))){
        if (Int[amount] == null){
            return -1
        }
        newValue = Int[amount];
    }else{
        newValue = +parseInt(manualAddCheck[1]);
    }
    console.log(newValue);


    if (manualAddCheck[0] === '+' || manualAddCheck[0] === "plus"){
        console.log(Math.min(Math.max(0, newValue + currentElixir), 10));
       return Math.min(Math.max(0, newValue + currentElixir), 10);
      }

    else if (manualAddCheck[0] === 'override'){
        console.log(Math.min(Math.max(0, newValue ), 10));
        return Math.min(Math.max(0, newValue ), 10);
    }
        return -1;
}