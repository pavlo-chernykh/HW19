function ToDoModel() {
  this.list = [];
};

ToDoModel.prototype.add = function(toDoName, toDoText) {
  const isUnique = this.checkUnique(toDoName, toDoText);
  if (isUnique) {
    const toDoModelCard = {
      toDoName,
      toDoText
    };
    this.list.push(toDoModelCard);
  };
};

ToDoModel.prototype.remove = function(id) {
  this.list = this.list.filter(({toDoName}) => toDoName !== id);

};

ToDoModel.prototype.checkUnique = function(toDoName, toDoText) {
  return !this.list.find(toDoNameNoShad => toDoNameNoShad.toDoName == toDoName || toDoNameNoShad.toDoText == toDoText);
};

// ToDoModel.prototype.edit = function(toDoName, newText) {
//   const editIndex = this.toDoEntries.findIndex(toDoEntry => toDoEntry.entryTitle === entryTitle);

//   const isUnique = this.checkUnique(newTitle, newText);

//   if (isUnique) {
//     this.list[editIndex].toDoText = newText;
//   }
// };

for (const key in ToDoModel) {
  Object.defineProperty(ToDoModel, key, {
    configurable: false
  })
};

const tdlm = new ToDoModel();

function TodoView(model) {
  this.model = model;
  this.form = document.querySelector('.create-form');
  this.list = document.querySelector('.todo-list');
  this.total = document.querySelector('.total');
  this.finished = document.querySelector('.finished');
  this.notFinished = document.querySelector('.not-finished');

  this.renderList = function() {
    this.list.innerHTML = '';
    this.notFinished.textContent = this.model.list.length;

    if(!this.model.list.length) {
      return;
    }
    const fragment = new DocumentFragment();

    for (const toDoModelCard of this.model.list) {
      
      const listItem = document.createElement('li');
      listItem.classList.add('todo-card');

      const toDoName = document.createElement('div');
      toDoName.classList.add('todo-card__name');
      toDoName.textContent = toDoModelCard.toDoName;

      const toDoText = document.createElement('div');
      toDoText.classList.add('todo-card__task');
      toDoText.textContent = toDoModelCard.toDoText;

      const removeButton = document.createElement('button');
      removeButton.classList.add('todo-card__remove');
      removeButton.textContent = 'Done';
      removeButton.dataset.id = toDoModelCard.toDoName;

      listItem.append(toDoName, toDoText, removeButton);
      fragment.append(listItem);
      
    }
    this.list.append(fragment);
  }

  this.initSubmit = function() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const name = formData.get('todoName').trim();
      const text = formData.get('todoText').trim();
  
      if(name && text) {
        this.model.add(name, text);
        this.total.textContent = this.model.list.length;
        this.renderList();
        e.target.reset();
      } 
    });
  }

  this.initRemove = function() {
    this.list.addEventListener('click', ({target: {dataset: {id}}}) => {
      if (id) {
        this.model.remove(id);  
        this.renderList();
        this.finished.textContent = this.total.textContent - this.notFinished.textContent;
        if (!this.model.list.length) {
          this.total.textContent = 0;
          this.finished.textContent = 0 ;
          this.notFinished.textContent = 0;
        }
      }
    })
  }

  this.initSubmit();
  this.initRemove();
}

const tdlv = new TodoView(tdlm);