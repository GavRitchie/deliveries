In the `deliveries.js` file, you will find a collection of functions, the primary function being `scheduleDeliveries`. 

This function will take a list of deliveries that need to be made and schedule them while attempting to minimize the makespan (i.e. the total time to complete all deliveries).

There are a few pieces missing. The most obvious piece, which I did not finish due to time constraints, I have commented in the code. 

Other things I would implement with more time and/or information: 
- Once I know where the data for deliveries comes from, I would likely change a few things about how the inputs are structured. Right now I'm assuming it to be an array of "Delivery" types,
  but in the real world that data would most likely live in a database, so we'd want to instead query from the database
- I would refactor to allow for other vehicles in addition to planes and trucks
- Write unit tests
- I would spend some more time on the algorithm for prioritizing jobs, to ensure I'm properly accounting for the order of trucks/planes

Hopefully much of this code is self-documenting from the naming of functions, etc, but I have left various comments throughout to clarify some things.