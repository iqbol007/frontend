import ajax from "./http.mjs";

const apiUrl = "http://https://iqbol-express-api.herokuapp.com";

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const getButton = document.getElementById("get-btn");
const setButton = document.getElementById("btn-set");

const setContentText = document.getElementById("content-text");
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const updateBtn = document.getElementById("btn-up");
const idForUpdate = document.getElementById("post-id");
const contentForUpdate = document.getElementById("content-text-up");
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const rootel = document.getElementById("root");
updateBtn.onclick = () => {
  rootel.innerHTML = ``;
  const parsedId = parseInt(idForUpdate.value, 10);
  ajax(`${apiUrl}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: parsedId,
      content: contentForUpdate.value,
      likes: 0
    })
  });
  idForUpdate.value = "";
  contentForUpdate.value = "";
  getButton.onclick();
};

//TODO: for SET >>>>>>>>
setButton.onclick = () => {
  rootel.innerHTML = ``;
  ajax(`${apiUrl}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: 0,
      content: setContentText.value,
      likes: 0
    })
  });
  setContentText.value = "";
  getButton.onclick();
};

//TODO:for SET
getButton.onclick = () => {
  rootel.innerHTML = ``;
  ajax(
    `${apiUrl}/posts`,
    {},
    {
      onsuccess: response => {
        const parsedResponse = JSON.parse(response);
        console.log(parsedResponse);
        parsedResponse.forEach(el => {
          const id = document.createElement("span");
          const likes = document.createElement("span");
          const content = document.createElement("span");
          const delBut = document.createElement("button");
          delBut.textContent = "x";
          const likeBut = document.createElement("button");
          likeBut.textContent = "like";
          id.textContent = `id:${el.id} `;
          likes.textContent = `likes:${el.likes} `;
          content.textContent = `content:${el.content} `;
          delBut.addEventListener("click", () => {
            rootel.innerHTML = ``;
            const id = parseInt(el.id);
            ajax(`${apiUrl}/posts/${id}`, { method: "DELETE" });
            getButton.onclick();
          });
          likeBut.addEventListener("click", () => {
            rootel.innerHTML = ``;
            const id = parseInt(el.id);
            ajax(`${apiUrl}/posts/${id}/likes`, { method: "POST" });
            getButton.onclick();
          });
          const post = document.createElement("li");
          post.appendChild(id);
          post.appendChild(content);
          post.appendChild(likes);
          post.appendChild(likeBut);
          post.appendChild(delBut);
          rootel.appendChild(post);
        });
      }
    }
  );
};
