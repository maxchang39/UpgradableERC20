// Simple Counter for block number autoincrement
module.exports = {
    i: 0,
    reset: function() {
        this.i = 0;
    },
    increment: function(){
        this.i++;
        return this.i;
    }
}