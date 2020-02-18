const apiUrl = 'http://localhost:9999';
// css-class: primary
const rootEl = document.getElementById('root');
let posts = [];

getAllPosts();
getPostById('XPost');
createPost({id: 0, name: 'Last Post'});

const language = 'ru';

const translations = {
    ru: {
        'error.not_found': 'Объект не найден',
        'error.bad_request': 'Произошла ошибка', // нужно писать пользователю, что делать дальше
        'error.unknown': 'Произошла ошибка',
        'error.network': 'Проверьте своё соединение',
    },
    en: {
        'error.not_found': 'Object not found',
        'error.bad_request': 'Error occured',
        'error.unknown': 'Error occured',
        'error.network': 'Check internet connection',
    },
};

function translateError(code) {
    // если первое вернёт undefined, то || вернёт второе (fallback значение)
    return translations[language][code] || translations[language]['error.unknown'];
}

function getAllPosts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}/posts`);

    xhr.addEventListener('load', evt => {
        const response = xhr.responseText;
        posts = JSON.parse(response);
        console.log(posts);
    });
    xhr.addEventListener('error', evt => {
        console.error(xhr.error);
    });
    // завершился успешно, либо с ошибкой
    xhr.addEventListener('loadend', evt => {

    });
    xhr.send();
}

function getPostById(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}/posts/${id}`);

    // если ответ пришёл - мы попадём сюда
    xhr.addEventListener('load', evt => {
        const response = xhr.responseText; // ответ в виде текста
        // xhr.status === 200 - неправильно
        if (xhr.status >= 200 && xhr.status < 300) {
            const post = JSON.parse(response);
            console.log(post);
            return;
        }

        // облегчённый вариант (несмотря на то, что сервер ответил ошибкой, он в теле может прислать ответ)
        const { error } = JSON.parse(response);
        console.log(translateError(error));
        // obj.property
        // obj['property']
    });
    // технические проблемы (не попадаете 40x, 50x!)
    xhr.addEventListener('error', evt => {
        console.error(translateError('error.network'));
    });
    // завершился успешно, либо с ошибкой
    xhr.addEventListener('loadend', evt => {

    });
    xhr.send();
}

function createPost(post) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiUrl}/posts`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // если ответ пришёл - мы попадём сюда
    xhr.addEventListener('load', evt => {
        const response = xhr.responseText;
        // xhr.status === 200 - неправильно
        if (xhr.status >= 200 && xhr.status < 300) {
            // после того, как добавили -> getAll()
            getAllPosts();
            return;
        }
            console.log('hello');
            
        // облегчённый вариант (несмотря на то, что сервер ответил ошибкой, он в теле может прислать ответ)
        const { error } = JSON.parse(response);
        console.log(translateError(error));
        // obj.property
        // obj['property']
    });
    // технические проблемы (не попадаете 40x, 50x!)
    xhr.addEventListener('error', evt => {
        console.error(translateError('error.network'));
    });
    // завершился успешно, либо с ошибкой
    xhr.addEventListener('loadend', evt => {

    });
    xhr.send(JSON.stringify(post));
}