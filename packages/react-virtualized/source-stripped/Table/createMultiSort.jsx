/**       */

                                    

                   
                                      
                    
                 
  

                                                  

                         
                                
                                          
  

                        
     
                                                         
                                                               
     
                                     

     
                                                                 
                            
     
                        

     
                                                                 
     
                                  
  

export default function createMultiSort(
  sortCallback          ,
  {defaultSortBy, defaultSortDirection = {}}                   = {},
)                  {
  if (!sortCallback) {
    throw Error(`Required parameter "sortCallback" not specified`);
  }

  const sortBy = defaultSortBy || [];
  const sortDirection = {};

  sortBy.forEach(dataKey => {
    sortDirection[dataKey] =
      defaultSortDirection[dataKey] !== undefined
        ? defaultSortDirection[dataKey]
        : 'ASC';
  });

  function sort({
    defaultSortDirection,
    event,
    sortBy: dataKey,
  }            )       {
    if (event.shiftKey) {
      // Shift + click appends a column to existing criteria
      if (sortDirection[dataKey] !== undefined) {
        sortDirection[dataKey] =
          sortDirection[dataKey] === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortDirection[dataKey] = defaultSortDirection;
        sortBy.push(dataKey);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Control + click removes column from sort (if pressent)
      const index = sortBy.indexOf(dataKey);
      if (index >= 0) {
        sortBy.splice(index, 1);
        delete sortDirection[dataKey];
      }
    } else {
      // Clear sortBy array of all non-selected keys
      sortBy.length = 0;
      sortBy.push(dataKey);

      // Clear sortDirection object of all non-selected keys
      const sortDirectionKeys = Object.keys(sortDirection);
      sortDirectionKeys.forEach(key => {
        if (key !== dataKey) delete sortDirection[key];
      });

      // If key is already selected, reverse sort direction.
      // Else, set sort direction to default direction.
      if (sortDirection[dataKey] !== undefined) {
        sortDirection[dataKey] =
          sortDirection[dataKey] === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortDirection[dataKey] = defaultSortDirection;
      }
    }

    // Notify application code
    sortCallback({
      sortBy,
      sortDirection,
    });
  }

  return {
    sort,
    sortBy,
    sortDirection,
  };
}
