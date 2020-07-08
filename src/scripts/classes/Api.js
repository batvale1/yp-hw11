export default class Api {
    constructor({baseUrl, headers}) {
        this.baseUrl = baseUrl;
        this.headers = headers;
        this.deleteCard = this.deleteCard.bind(this);
        this.addLikeCard = this.addLikeCard.bind(this);
        this.removeLikeCard = this.removeLikeCard.bind(this);
    }

    getInitialCards() {
        return fetch(`${this.baseUrl}/cards`, {
            headers: this.headers
        })
            .then(res => {
              if (res.ok) return res.json();
              return Promise.reject(`Ошибка: ${res.status}`);
            })
    }

    postNewCard(name, link) {
        return fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                name,
                link
            })
        })
            .then(res => {
                if (res.ok) return res.json();
                return Promise.reject(`Ошибка: ${res.status}`);
            })
    }

    deleteCard(id) {
        return fetch(`${this.baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this.headers
        })
            .then(res => {
              if (res.ok) return res.json();
              return Promise.reject(`Ошибка: ${res.status}`);
            })
    }

    addLikeCard(id) {
        return fetch(`${this.baseUrl}/cards/like/${id}`, {
            method: 'PUT',
            headers: this.headers
        })
            .then(res => {
              if (res.ok) return res.json();
              return Promise.reject(`Ошибка: ${res.status}`);
            })
    }

    removeLikeCard(id) {
        return fetch(`${this.baseUrl}/cards/like/${id}`, {
            method: 'DELETE',
            headers: this.headers
        })
            .then(res => {
              if (res.ok) return res.json();
              return Promise.reject(`Ошибка: ${res.status}`);
            })
    }

    getProfile() {
        return fetch(`${this.baseUrl}/users/me`, {
            headers: this.headers
        })
            .then(res => {
              if (res.ok) return res.json();
              return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    updateProfile(name, about) {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                name,
                about
            })
        })
            .then(res => {
                if (res.ok) return res.json();
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    changeProfileAvatar(avatar) {
        return fetch(`${this.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                avatar
            })
        })
            .then(res => {
              if (res.ok) return res.json();
              return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    // другие методы работы с API
}