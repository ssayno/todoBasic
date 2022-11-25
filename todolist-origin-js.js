const addInput = document.getElementById("title");
const todoList = document.getElementById("todolist");
const todoCount = document.getElementById('todocount');
const doneCount = document.getElementById('donecount');
const doneList = document.getElementById("donelist");
//
const [todoArray, doneArray] = getData();
const todoSet = new Set();
const doneSet = new Set();
for(let value of todoArray){
  todoSet.add(value);
}
for(let value of doneArray){
  doneSet.add(value);
}
load();
addInput.addEventListener('keypress', function(event){
  if(event.key === 'Enter'){
    let titleValue = this.value;
    if(titleValue.trim() === ""){
        console.log("empty input");
        return
    }
    if(doneSet.has(titleValue)){
        alert("这个事情已经办完了");
        return
    }
    if(todoSet.has(titleValue)){
        alert("这个已经代办了");
        return
    }
    todoSet.add(titleValue);
    this.value = "";
    console.log(todoSet);
    load();
  }
})

function addEventListenerForTodo(){
  todoList.childNodes.forEach(
    function(node_, values){
      let inputEle = node_.querySelector('input');
      let aElement = node_.querySelector('a');
      inputEle.addEventListener('click', function(event){
        let currentTitle = node_.querySelector('p').innerHTML;
        todoSet.delete(currentTitle);
        node_.remove();
        doneSet.add(currentTitle);
        todoCount.innerHTML = todoSet.size;
        doneCount.innerHTML = doneSet.size;
        load();
      })
      aElement.addEventListener('click', (event) => {
        let currentTitle = node_.querySelector('p').innerHTML;
        node_.remove();
        todoSet.delete(currentTitle);
        todoCount.innerHTML = todoSet.size;
        doneCount.innerHTML = doneSet.size;
        load();
      });
    }
  )
}

function addEventListenerForDone(){
  doneList.childNodes.forEach(
    function(node_, values){
      let inputEle = node_.querySelector('input');
      let aElement = node_.querySelector('a');
      inputEle.addEventListener('click', function(event){
        let currentTitle = node_.querySelector('p').innerHTML;
        doneSet.delete(currentTitle);
        node_.remove();
        todoSet.add(currentTitle);
        todoCount.innerHTML = todoSet.size;
        doneCount.innerHTML = doneSet.size;
        load();
      })
      aElement.addEventListener('click', (event) => {
        let currentTitle = node_.querySelector('p').innerHTML;
        node_.remove();
        doneSet.delete(currentTitle);
        todoCount.innerHTML = todoSet.size;
        doneCount.innerHTML = doneSet.size;
        load();
      });
    }
  )
}


function load(){
  todoList.childNodes.forEach(
    function(node, index_){
      node.remove();
    }
  )
  doneList.childNodes.forEach(
    function(node, index_){
      node.remove();
    }
  )
  // todo
  todoSet.forEach(function(index_, node_){
    let liElement = document.createElement('li');
    let checkInput = document.createElement('input');
    let pElement = document.createElement('p');
    let delElement = document.createElement('a');
    delElement.setAttribute('href', "javascript:;")
    delElement.innerHTML = 'x';
    checkInput.setAttribute('type', 'checkbox');
    pElement.innerHTML = node_;
    liElement.appendChild(checkInput);
    liElement.appendChild(pElement);
    liElement.appendChild(delElement);
    todoList.appendChild(liElement);
    todoCount.innerHTML = todoSet.size;
  })
  doneSet.forEach(function(index_, node_){
    let liElement = document.createElement('li');
    let checkInput = document.createElement('input');
    let pElement = document.createElement('p');
    let delElement = document.createElement('a');
    delElement.setAttribute('href', "javascript:;")
    delElement.innerHTML = 'x';
    checkInput.setAttribute('type', 'checkbox');
    checkInput.setAttribute('checked', 'checked');
    pElement.innerHTML = node_;
    liElement.appendChild(checkInput);
    liElement.appendChild(pElement);
    liElement.appendChild(delElement);
    doneList.appendChild(liElement);
    doneCount.innerHTML = doneSet.size;
  })
  addEventListenerForTodo();
  addEventListenerForDone();
  saveData();
}

function saveData(){
  let localData = {
    todo: [],
    done: []
  }
  for(let value of todoSet.values()){
    localData.todo.push(value);
  }
  for(let value of doneSet.values()){
    localData.done.push(value);
  }
  let storageData = JSON.stringify(localData)
  console.log(storageData);
  localStorage.setItem('todoApp', storageData)
}

function getData(){
  let storageData = JSON.parse(
    localStorage.getItem('todoApp')
  )
  if(storageData != null){
    console.log("not null");
    return [storageData.todo, storageData.done]
  }else{
    console.log("null");
    return [[], []]
  }
}
