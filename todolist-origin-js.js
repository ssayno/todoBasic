const pushInput = document.getElementById("title");
const todoCount = document.getElementById('todocount');
const todoList = document.getElementById("todolist");
const doneCount = document.getElementById('donecount');
const doneList = document.getElementById("donelist");
//
const [todoArray, doneArray] = getData();
window.onload = function(){
  todoCount.innerHTML = todoArray.length;
  doneCount.innerHTML = doneArray.length;
  load();
}
pushInput.addEventListener('keypress', function(event){
  if(event.key === 'Enter'){
    let titleValue = this.value;
    if(titleValue.trim() === ""){
        console.log("empty input");
        return
    }
    if(doneArray.includes(titleValue)){
        alert("这个事情已经办完了");
        return
    }
    if(todoArray.includes(titleValue)){
        alert("这个已经代办了");
        return
    }
    todoArray.push(titleValue);
    this.value = "";
    load();
  }
})

function addEventListenerForTodo(){
  todoList.childNodes.forEach(
    function(node_, index_){
      let inputEle = node_.querySelector('input');
      let aElement = node_.querySelector('a');
      inputEle.addEventListener('click', function(event){
        let currentTitle = node_.querySelector('p').innerHTML;
        todoArray.splice(index_, 1)
        node_.remove();
        doneArray.push(currentTitle);
        todoCount.innerHTML = todoArray.length;
        doneCount.innerHTML = doneArray.length;
        load();
      })
      aElement.addEventListener('click', (event) => {
        let currentTitle = node_.querySelector('p').innerHTML;
        node_.remove();
        todoArray.splice(index_, 1)
        todoCount.innerHTML = todoArray.length;
        doneCount.innerHTML = doneArray.length;
        load();
      });
    }
  )
}

function addEventListenerForDone(){
  doneList.childNodes.forEach(
    function(node_, index_){
      let inputEle = node_.querySelector('input');
      let aElement = node_.querySelector('a');
      inputEle.addEventListener('click', function(event){
        let currentTitle = node_.querySelector('p').innerHTML;
        doneArray.splice(index_, 1)
        node_.remove();
        todoArray.push(currentTitle);
        todoCount.innerHTML = todoArray.length;
        doneCount.innerHTML = doneArray.length;
        load();
      })
      aElement.addEventListener('click', (event) => {
        let currentTitle = node_.querySelector('p').innerHTML;
        node_.remove();
        doneArray.splice(index_, 1)
        todoCount.innerHTML = todoArray.length;
        doneCount.innerHTML = doneArray.length;
        load();
      });
    }
  )
}


function load(){
  todoList.childNodes.forEach(function(node, index){
    node.remove();
  })
  doneList.childNodes.forEach(function(node, index){
    node.remove();
  })
  // while(todoList.firstChild){
  //   todoList.firstChild.remove();
  // }
  // while(doneList.firstChild){
  //   doneList.firstChild.remove();
  // }
  // todo
  todoArray.forEach(function(node_, index_){
    let liElement = document.createElement('li');
    let checkInput = document.createElement('input');
    let pElement = document.createElement('p');
    let delElement = document.createElement('a')
    ;
    delElement.setAttribute('href', "javascript:;")
    delElement.innerHTML = 'x';
    checkInput.setAttribute('type', 'checkbox');
    pElement.innerHTML = node_;
    liElement.appendChild(checkInput);
    liElement.appendChild(pElement);
    liElement.appendChild(delElement);
    todoList.appendChild(liElement);
    todoCount.innerHTML = todoArray.length;
  })
  doneArray.forEach(function(node_, index_){
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
    doneCount.innerHTML = doneArray.length;
  })
  addEventListenerForTodo();
  addEventListenerForDone();
  saveData();
}

function saveData(){
  let localData = {
    todo: todoArray,
    done: doneArray
  }
  let storageData = JSON.stringify(localData)
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
