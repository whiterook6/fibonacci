class Model {
	fill(data){
		for (var i = this.$fillable.length - 1; i >= 0; i--) {
			var key = this.$fillable[i];
			if (data.hasOwnProperty(key)){
				this[key] = data[key];
			}
		}

		return this;
	}

	get $fillable(){
		return [];
	}
}

module.exports = Model;