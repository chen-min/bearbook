
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
    new Compile(options.el, this)

}
function Compile(el, vm){
    vm.$el = document.querySelector(el)
    let fragment = document.createDocumentFragment();
    while(child = vm.$el.firstChild){
        fragment.appendChild(child);
    }
    replaceText(fragment)

    function replaceText(fragment){
        Array.from(fragment.childNodes).forEach(function(node){
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/
            if(node.nodeType === 3 && reg.test(text)){
                let arrs = RegExp.$1.split('.')
                let val = vm;
                arrs.forEach(function(k){ 
                    val = val[k]
                })
                new Watcher(vm, RegExp.$1, function(newVal){ 
                    node.textContent = text.replace(/\{\{(.*)\}\}/, newVal)
                })
                node.textContent = text.replace(/\{\{(.*)\}\}/, val)
            }
            if(node.childNodes){
                replaceText(node)
            }
        })
    
    }
    vm.$el.appendChild(fragment);

}


//观察对象, 给对象增加ObjectDefineProperty
function Observe(data) { //这里写主要逻辑
    let dep = new Dep()
    for(let key in data){ //把data属性通过objectdefineproperty方式定义属性
        let value = data[key]
        observe(value);
        Object.defineProperty(data, key , {
            enumerable: true,
            get(){
                Dep.target&&dep.addSub(Dep.target);//[watcher]
                return value;
            },
            set(newValue){ 
                if(newValue === value){
                     return ;
                }
                value = newValue; 
                observe(newValue)
                dep.notify();
            }
        })
    }
}

function observe(data) {
    if(typeof data !== 'object') return
    return new Observe(data)
}


function Dep(){
    this.subs = [];
}

//订阅
Dep.prototype.addSub = function(sub){
    console.log('addsub', sub)
    this.subs.push(sub)
}
Dep.prototype.notify = function(){
    this.subs.forEach(item => item.update())
}

//watcher
function Watcher(vm, exp, fn){ 
    this.fn = fn; 
    this.vm = vm;
    this.exp = exp;
    //添加到订阅中
    Dep.target = this;
    let val = vm;
    let arr = exp.split('.');
    arr.forEach(function(k){ 
        val = val[k];
    })
    Dep.target = null
}
Watcher.prototype.update = function(){
    console.log('执行update方法')
    let val = this.vm;
    let arr = this.exp.split('.');
    arr.forEach(function(k){
        val = val[k]
    })
    this.fn(val) 

}



