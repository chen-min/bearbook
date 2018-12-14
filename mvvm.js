
function Wue(options={}){
    this.$options = options
    var data = this._data = this.$options.data
    observe(data);
}

function Observe(data) { 
    for(let key in data){ 
        let value = data[key]
        observe(value);
        Object.defineProperty(data, key , {
            enumerable: true,
            get(){
                return value;
            },
            set(newValue){ 
                if(newValue === value){
                    return ;
                }
                value = newValue; 
                observe(newValue)
            }
        })
    }
}


function observe(data) {
    return new Observe(data)
}

