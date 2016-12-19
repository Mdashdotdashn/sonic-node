// save references to array functions to make lookup faster
var push = Array.prototype.push,
splice = Array.prototype.splice,
clone = Array.prototype.clone,
slice = Array.prototype.slice;

Array.prototype.clone = function()
  {
    return slice.call(this, 0);
  };

Array.prototype.rotate = function(count)
 {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len)
        count = ((count % len) + len) % len;

        var copy = this.clone(this);
        // use splice.call() instead of this.splice() to make function generic
        push.apply(copy, splice.call(copy, 0, count));
        return copy;
  };

lo = function(o)
{
  console.log(JSON.stringify(o, null,2));
}
