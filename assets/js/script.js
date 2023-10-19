const directory = [];

document.addEventListener("DOMContentLoaded", () => {
  function value() {
    const title = document.getElementById("judul").value;
    const author = document.getElementById("penulis").value;
    const year = document.getElementById("tahun").value;
    let checkbox = document.getElementById("completed");
    let isCompleted = null;
    if (checkbox.checked) {
      isCompleted = checkbox.checked;
    } else {
      isCompleted = checkbox.checked;
    }

    const id = +new Date();
    const valueObject = generateValueObject(
      id,
      title,
      author,
      year,
      isCompleted
    );
    directory.push(valueObject);
    isRead();
    save();
  }

  function generateValueObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }

  const getForm = document.getElementById("input-book");
  getForm.addEventListener("submit", (e) => {
    e.preventDefault();
    value();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const STORAGE_KEY = "MY_BOOK";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function save() {
  if (isStorageExist()) {
    const parse = JSON.stringify(directory);
    localStorage.setItem(STORAGE_KEY, parse);
  }
}

function makeCard(directorys) {
  // console.log(directorys);
  const container = document.createElement("div");
  container.style.width = "135px";
  container.style.padding = ".6rem";
  container.style.margin = ".5rem";
  container.style.display = "inline-block";
  container.style.borderRadius = "10px";
  container.style.backgroundColor = "#FDE5D4";

  const textTitle = document.createElement("h1");
  textTitle.innerText = directorys.title;
  textTitle.style.fontSize = "1.5rem";
  textTitle.style.fontWeight = "600";
  textTitle.style.paddingBottom = ".3rem";

  const penulis = document.createElement("p");
  penulis.innerText = directorys.author;
  penulis.style.fontWeight = "500";

  const tahun = document.createElement("p");
  tahun.innerText = directorys.year;
  tahun.style.fontWeight = "500";
  tahun.style.paddingBottom = ".5rem";

  const btnContainer = document.createElement("div");

  const isDone = document.createElement("span");
  directorys.isCompleted
    ? (isDone.innerHTML =
        '<span class="material-symbols-outlined">remove_done</span>')
    : (isDone.innerHTML =
        '<span class="material-symbols-outlined">done</span>');

  const cardDelete = document.createElement("span");
  cardDelete.innerHTML =
    '<span class="material-symbols-outlined">delete</span>';

  container.setAttribute("id", `card-${directorys.id}`);
  btnContainer.append(isDone, cardDelete);
  container.append(textTitle, penulis, tahun, btnContainer);

  isDone.addEventListener("click", () => {
    if (!directorys.isCompleted) {
      done(directorys.id);
    } else {
      notYet(directorys.id);
    }
  });

  cardDelete.addEventListener("click", () => {
    trash(directorys.id);
  });

  const search = document.getElementById("search");
  const items = directorys.title;
  search.addEventListener("input", (e) => filterData(e.target.value));
  function filterData(search) {
    if (items.toLowerCase().includes(search.toLowerCase())) {
      container.classList.remove("d-none");
    } else {
      container.classList.add("d-none");
    }
  }

  return container;
}

function done(id) {
  const target = findId(id);

  if (target == null) return;
  target.isCompleted = true;
  isRead();
  save();
}

function notYet(id) {
  const target = findId(id);

  if (target == null) return;

  target.isCompleted = false;
  isRead();
  save();
}

function trash(id) {
  const target = findIndexId(id);

  if (target === -1) return;
  directory.splice(target, 1);
  isRead();
  save();
}

function findId(id) {
  for (const directorys of directory) {
    if (directorys.id === id) {
      return directorys;
    }
  }
}

function findIndexId(id) {
  for (const index in directory) {
    if (directory[index].id === id) {
      return index;
    }
  }
}

function isRead() {
  const notYet = document.getElementById("body-notYet");
  notYet.innerHTML = "";
  const done = document.getElementById("body-done");
  done.innerHTML = "";

  for (const directorys of directory) {
    const card = makeCard(directorys);
    if (directorys.isCompleted) {
      done.append(card);
    } else {
      notYet.append(card);
    }
  }
}

function loadDataFromStorage() {
  const getData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getData);

  if (data !== null) {
    for (const dataSheet of data) {
      directory.push(dataSheet);
    }
  }
  isRead();
}
