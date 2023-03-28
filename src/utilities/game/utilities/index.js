export const shuffle = (array) => {

  if (array.length == 1) return array;
  
  // Create a copy of the input array
  const shuffledArray = [...array];

  // Loop through the array from the end to the beginning
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Choose a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap the elements at index i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Return the shuffled array
  return shuffledArray;
};

export const updateHealthBar = (player, max_energy, bar) => {
  //handle energy bar
  if (bar) {
    //update energy bar width
    bar.current.style.width = `${
      (player.energy / max_energy).toFixed(1) * 100
    }%`;
    bar.current.style.background = "rgb(54, 166, 206)";
    //change its color to yellow if below 50%
    if (
      (player.energy / max_energy).toFixed(1) * 100 <
      50
    )
      bar.current.style.background = "rgb(209, 168, 92)";
    //change its color to yellow if below 20%
    if (
      (player.energy / max_energy).toFixed(1) * 100 <
      20
    )
      bar.current.style.background = "rgb(196, 39, 81)";
  }
}
