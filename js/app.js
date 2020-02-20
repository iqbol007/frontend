const url = "https://i-back-api.herokuapp.com/posts";

const rootEl = document.querySelector("#root");

rootEl.innerHTML = `
    <form action="" method="post">
        
        <input type="text" placeholder="Описание" data-id="post-desc">
        <button class="post-add" type="submit">Добавить</button>
        <button class="post-change btnHidden" type="submit">Изменить</button>
        <div class="front-error"></div>
    </form>
    <img src="./img/loadimag.gif" alt="loader" data-loader='loader'>
    <ul class="item-list"></ul>
`;

const postAdd = document.querySelector(".post-add");
const postChange = document.querySelector(".post-change");
const itemList = rootEl.querySelector(".item-list");
const frontError = rootEl.querySelector(".front-error");
const loader = rootEl.querySelector("[data-loader=loader]");
const postDesc = document.querySelector("[data-id=post-desc]");

let posts = [];

const language = "ru";

const translations = {
  ru: {
    "error.not_found": "Объект не найден",
    "error.bad_request": "Произошла ошибка, введите айди поста",
    "error.unknown": "Произошла ошибка",
    "error.network": "Проверьте своё соединение"
  },
  en: {
    "error.not_found": "Object not found",
    "error.bad_request": "Error occured",
    "error.unknown": "Error occured",
    "error.network": "Check internet connection"
  }
};

function translateError(code) {
  return (
    translations[language][code] || translations[language]["error.unknown"]
  );
}
loader.style.display = "block";
getAllPosts();

function getAllPosts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${url}`);

  xhr.addEventListener("load", e => {
    loader.style.display = "block";
    itemList.innerHTML = "";
    const response = xhr.responseText;
    posts = JSON.parse(response);

    if (xhr.status >= 200 && xhr.status < 300) {
      posts.forEach(o => {
        let postEl = document.createElement("li");
        postEl.innerHTML = `<li>id: ${o.id}  content: ${o.content} likes: ${o.likes}
                <b data-action="likebtnp">❤️</b>
                <button  data-action="deletebtn">X</button>
                <button data-action="edit-post">Изменить</button></li> `;
        itemList.appendChild(postEl);
        const deletePostById = postEl.querySelector(
          '[data-action="deletebtn"]'
        );
        const editPost = postEl.querySelector('[data-action="edit-post"]');
        const likePostp = postEl
          .querySelector('[data-action="likebtnp"]')
          .addEventListener("click", () => {
            likePostP(o.id);
          });
        editPost.onclick = function(e) {
          postDesc.value = o.content;

          postChange.onclick = function(e) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${url}`);
            xhr.setRequestHeader("Content-Type", "application/json");
            e.preventDefault();

            let post = {
              id: o.id,
              content: postDesc.value,
              likes: o.likes
            };
            xhr.addEventListener("load", e => {
              const response = xhr.responseText;
              if (xhr.status >= 200 && xhr.status < 300) {
                getAllPosts();
                return;
              }
              const { error } = JSON.parse(response);
              errorEl.innerText = translateError(error);
            });
            xhr.addEventListener("error", evt => {
              errorEl.innerText = translateError("error.network");
            });

            postDesc.value = "";

            xhr.send(JSON.stringify(post));
          };
        };
        deletePostById.addEventListener("click", () => {
          itemList.innerHTML = "";
          deletePost(o.id);
        });
      });
    } else {
      const { error } = JSON.parse(response);
      frontError.innerHTML = translateError(error);
    }
  });
  xhr.addEventListener("error", e => {
    frontError.innerHTML = translateError("error.network");
  });
  xhr.addEventListener("loadend", e => {
    loader.style.display = "none";
  });
  xhr.send();
}

function deletePost(id) {
  const xhr = new XMLHttpRequest();

  xhr.open("DELETE", `${url}/${id}`);

  xhr.addEventListener("load", e => {
    const response = xhr.responseText;

    if (xhr.status >= 200 && xhr.status < 300) {
      getAllPosts();
      return;
    }

    const { error } = JSON.parse(response);
    frontError.innerHTML = translateError(error);
  });

  xhr.addEventListener("error", e => {
    frontError.innerHTML = translateError("error.bad_request");
  });

  xhr.send();
}

postAdd.addEventListener("click", e => {
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${url}`);
  xhr.setRequestHeader("Content-Type", "application/json");

  let post = {
    id: 0,
    content: postDesc.value,
    likes: 0
  };

  xhr.addEventListener("load", e => {
    const response = xhr.responseText;
    if (xhr.status >= 200 && xhr.status < 300) {
      itemList.innerHTML = " ";
      getAllPosts();
      return;
    }
    const { error } = JSON.parse(response);
    frontError.innerHTML = translateError(error);
  });

  xhr.addEventListener("error", e => {
    frontError.innerHTML = translateError("error.network");
  });
  postDesc.value=``;
  xhr.send(JSON.stringify(post));
});
function likePostP(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${url}/${id}/likes`);
  xhr.addEventListener("load", e => {
    const response = xhr.responseText;

    if (xhr.status >= 200 && xhr.status < 300) {
      getAllPosts();
      return;
    }

    const { error } = JSON.parse(response);
    frontError.innerHTML = translateError(error);
  });

  xhr.addEventListener("error", e => {
    frontError.innerHTML = translateError("error.bad_request");
  });

  xhr.send();
} 