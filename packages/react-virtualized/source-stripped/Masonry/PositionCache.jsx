/**       */
import createIntervalTree from '../vendor/intervalTree';

                                                                         

// Position cache requirements:
//   O(log(n)) lookup of cells to render for a given viewport size
//   O(1) lookup of shortest measured column (so we know when to enter phase 1)
export default class PositionCache {
  // Tracks the height of each column
  _columnSizeMap                        = {};

  // Store tops and bottoms of each cell for fast intersection lookup.
  _intervalTree = createIntervalTree();

  // Maps cell index to x coordinates for quick lookup.
  _leftMap                            = {};

  estimateTotalHeight(
    cellCount        ,
    columnCount        ,
    defaultCellHeight        ,
  )         {
    const unmeasuredCellCount = cellCount - this.count;
    return (
      this.tallestColumnSize +
      Math.ceil(unmeasuredCellCount / columnCount) * defaultCellHeight
    );
  }

  // Render all cells visible within the viewport range defined.
  range(
    scrollTop        ,
    clientHeight        ,
    renderCallback                ,
  )       {
    this._intervalTree.queryInterval(
      scrollTop,
      scrollTop + clientHeight,
      ([top, _, index]) => renderCallback(index, this._leftMap[index], top),
    );
  }

  setPosition(index        , left        , top        , height        )       {
    this._intervalTree.insert([top, top + height, index]);
    this._leftMap[index] = left;

    const columnSizeMap = this._columnSizeMap;
    const columnHeight = columnSizeMap[left];
    if (columnHeight === undefined) {
      columnSizeMap[left] = top + height;
    } else {
      columnSizeMap[left] = Math.max(columnHeight, top + height);
    }
  }

  get count()         {
    return this._intervalTree.count;
  }

  get shortestColumnSize()         {
    const columnSizeMap = this._columnSizeMap;

    let size = 0;

    for (let i in columnSizeMap) {
      let height = columnSizeMap[(i     )];
      size = size === 0 ? height : Math.min(size, height);
    }

    return size;
  }

  get tallestColumnSize()         {
    const columnSizeMap = this._columnSizeMap;

    let size = 0;

    for (let i in columnSizeMap) {
      let height = columnSizeMap[(i     )];
      size = Math.max(size, height);
    }

    return size;
  }
}
