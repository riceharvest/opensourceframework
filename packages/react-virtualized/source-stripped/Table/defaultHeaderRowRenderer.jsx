/**       */
import * as React from 'react';
                                                     

export default function defaultHeaderRowRenderer({
  className,
  columns,
  style,
}                         ) {
  return (
    <div className={className} role="row" style={style}>
      {columns}
    </div>
  );
}
