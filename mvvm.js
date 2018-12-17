
function Wue(options={}){
    this.$options = options
    var data = this._data = this.$options.data
    observe(data);

    for(let  key in data){
        Object.defineProperty(this, key,{
            enumerable: true,
            get(){
                return this._data[key];
            },
            set(newVal){
                this._data[key] = newVal
            }
        })
    }

}

function Observe(data) { //这里写主要逻辑
    for(let key in data){ //把data属性通过objectdefineproperty方式定义属性
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

