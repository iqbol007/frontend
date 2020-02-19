import ajax from "./http.mjs";

const apiUrl = "https://iqbol-express-api.herokuapp.com/posts";

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const getButton = document.getElementById("get-btn");
const setButton = document.getElementById("btn-set");

const setContentText = document.getElementById("content-text");
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const updateBtn = document.getElementById("btn-up");
let idForUpdate = document.getElementById("post-id");
const contentForUpdate = document.getElementById("content-text-up");
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const rootel = document.getElementById("root");
getAllPosts();

updateBtn.onclick = () => {
  const parsedId = parseInt(idForUpdate.value, 10);
  ajax(apiUrl, {
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
  getAllPosts();
};

//TODO: for SET >>>>>>>>
setButton.onclick = () => {
  rootel.innerHTML = ``;
  ajax(apiUrl, {
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
  getAllPosts();
};
 
getButton.onclick = () => {
  getAllPosts();
};
function getAllPosts( ) {
  rootel.innerHTML = ``;
  ajax(
    apiUrl,
    {},
    {
      onsuccess: response => {
        
        const parsedResponse = JSON.parse(response);
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
            ajax(`${apiUrl}/${id}`, { method: "DELETE" });
           getAllPosts();
          });
          likeBut.addEventListener("click", () => {
            likes.innerHTML=``;
            const id = parseInt(el.id);
            const url = `${apiUrl}/${id}/likes`;
            ajax(url, { method: "POST" });
           getAllPosts();
          });
          const post = document.createElement("li");
          content.addEventListener('click',()=>{
            idForUpdate.value=el.id;
            contentForUpdate.value=el.content;
          });
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
}
