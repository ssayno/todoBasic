const pushInput = document.getElementById("title");
const todoCount = document.getElementById('todocount');
const todoList = document.getElementById("todolist");
const doneCount = document.getElementById('donecount');
const doneList = document.getElementById("donelist");
//
const socket = io();
socket.on('connect', function(data){
  // empty array also can be iterator
  if(data !== undefined){
    for(let array_ of data){
      let title = array_[0];
      let status = array_[1];
      addListElement(title, status);
    }
  }
})
socket.on('addtodo', function(eventData){
  // const jsonData = JSON.parse(eventData);
  const jsonData = eventData;
  const title = eventData.title;
  const status = eventData.status;
  const type = jsonData.type;
  if(type === 'add'){
    addListElement(title, status);
  }else if(type === 'warn'){
    layer.open({
      type: 1,
      content: "已经存在了"
    })
  }
})

pushInput.addEventListener('keypress', function(event){
  if(event.key === 'Enter'){
    let titleValue = this.value;
    if(titleValue.trim() === ""){
        console.log("empty input");
        return
    }
    socket.emit('addtodo', {
      title: titleValue,
      status: false,
      type: 'add'
    })
    this.value = "";
   }
})


// update count label
function updateCount(status, number){
  let needUpdateElement = doneCount;
  if(!status){
    needUpdateElement = todoCount;
  }
  const originCount = parseInt(needUpdateElement.innerHTML);
  const newCount = originCount + number;
  needUpdateElement.innerHTML = newCount;
}

function addListElement(title, status){
  const liElement = document.createElement('li');
  const inputBox = document.createElement('input');
  const pElement = document.createElement('p');
  const aElement = document.createElement('a');
  inputBox.setAttribute('type', 'checkbox');
  if(status){
    inputBox.setAttribute('checked', 'checked');
  }
  pElement.innerHTML = title;
  aElement.innerHTML = 'x';
  aElement.setAttribute('href', 'javascript:void(0);');
  aElement.addEventListener('click', function(event){
    liElement.remove();
    updateCount(status, -1);
    socket.emit('addtodo', {
      title: title,
      status: !status,
      type: 'delete'
    })
  })
  inputBox.addEventListener('click', function(event){
    liElement.remove();
    updateCount(status, -1);
    socket.emit('addtodo', {
      title: title,
      status: !status,
      type: 'modify'
    })
  });
  //
  liElement.appendChild(inputBox);
  liElement.appendChild(pElement);
  liElement.append(aElement);
  updateCount(status, 1);
  if(status){
    doneList.appendChild(liElement);
  }else{
    todoList.appendChild(liElement);
  }
}
