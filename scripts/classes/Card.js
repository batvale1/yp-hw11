class Card {

  constructor(params) {
    this.name = params.name;
    this.link = params.link;
    this.likes = params.likes;
    this.id = params.id;
    this.ownerUserId = params.ownerUserId;
    this.currentUserId = params.currentUserId;
    this.template = params.templateCard;
    this.popupOpenHandler = params.openPopupCard;
    this.deleteCardHanlder = params.deleteCard;
    this.addLikeCardHandler = params.addLikeCard;
    this.removeLikeCardHandler = params.removeLikeCard;
    this.cardElem = null;
  }

  create() {
    const newCard = this.template.cloneNode(true);

    const newCardName = newCard.querySelector('.place-card__name');
    const newCardImage = newCard.querySelector('.place-card__image');
    const newCardLikeQuantity = newCard.querySelector('.place-card__like-quantity');
    newCardName.textContent = this.name;
    newCardImage.style.backgroundImage = `url(${this.link})`;
    newCardImage.setAttribute('data-set', this.link);
    newCardLikeQuantity.textContent = this.likes.length;
    newCard.setAttribute('id', this.id);
    if (this.ownerUserId !== this.currentUserId) {
      //чужая карточка
      newCard.querySelector('.place-card__delete-icon').remove();
    }

    this.cardElem = newCard;

    if (this._isLikedByCurrentUser()) {
      this.cardElem.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
    }

    this._setEventListeners();

    return newCard;
  }

  _isLikedByCurrentUser() {
    return !!this.likes.find(item => {
      return item['_id'] === this.currentUserId;
    });
  }
  _setEventListeners() {
    const likeBtn = this.cardElem.querySelector('.place-card__like-icon');
    const deleteBtn = this.cardElem.querySelector('.place-card__delete-icon');
    const newCardImage = this.cardElem.querySelector('.place-card__image');

    likeBtn.addEventListener('click', this._handleLikeBtnClick.bind(this));
    if (deleteBtn) {
      deleteBtn.addEventListener('click', this._handleDeleteBtnClick.bind(this));
    }
    newCardImage.addEventListener('click', () => this.popupOpenHandler(this.link));
  }

  _handleLikeBtnClick() {
    //посмотрим, может мы уже лайкали
    if (this._isLikedByCurrentUser()) {
      //убираем лайк
      this.removeLikeCardHandler(this.id)
        .then(({likes}) => {
          this.likes = likes;
          this.cardElem.querySelector('.place-card__like-icon').classList.remove('place-card__like-icon_liked');
          this.cardElem.querySelector('.place-card__like-quantity').textContent = likes.length;
        })
        .catch(e => console.log(e));
    } else {
      //лайкаем
      this.addLikeCardHandler(this.id)
        .then(({likes}) => {
          this.likes = likes;
          this.cardElem.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
          this.cardElem.querySelector('.place-card__like-quantity').textContent = likes.length;
        })
        .catch(e => console.log(e));
    }
  }

  _handleDeleteBtnClick(event) {
    event.stopPropagation();
    if(confirm("Удалить карточку?")) {
      this.deleteCardHanlder(this.id)
        .then(() => {
          this.cardElem.remove();
        })
        .catch(e => console.log(e));
    }
  }
}