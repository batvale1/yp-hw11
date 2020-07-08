(function () {
  //куда рендерим карточки
  const placesList = document.querySelector('.places-list');
  //кнопки открытия popup'ов
  const editingCardElementBtn = document.querySelector('.user-info__button');
  const editingProfileElementBtn = document.querySelector('.user-info__edit');
  const editingAvatarElement = document.querySelector('.user-info__photo');
  //формы
  const editingCardsForm = document.forms.new;
  const editingProfileForm = document.forms.edit;
  const editingAvatarForm = document.forms.avatar;
  //данные пользователя
  const userName = document.querySelector('.user-info__name');
  const userAbout = document.querySelector('.user-info__job');
  const userAvatar = document.querySelector('.user-info__photo');
  //темплейт карточки
  const templateCard = document.getElementById('card-template').content.querySelector('.place-card');

  //экземпляры классов
  //api
  const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort11',
    headers: {
      authorization: '20e46ea9-04bb-478c-80c8-fe605e519d0c',
      'Content-Type': 'application/json'
    }
  });
  //профиль
  const profile = new UserInfo(userName, userAbout, userAvatar);
  //попап картинки
  const popupImage = new PopupImage(document.querySelector('.popup_show-image'));
  popupImage.setEventListeners();
  //попап карточки
  const popupAddCart = new PopupForm(document.querySelector('.popup_add-card'));
  popupAddCart.setEventListeners();
  //попап профиля
  const popupEditProfile = new PopupForm(document.querySelector('.popup_edit-profile'));
  popupEditProfile.setEventListeners();
  //попап редактирования аватара
  const popupEditAvatar = new PopupForm(document.querySelector('.popup_edit-avatar'));
  popupEditAvatar.setEventListeners();
  //изначальные карточки
  const cardList = new CardList(placesList, []);
  //валидация форм
  const editingProfileFormValidation = new FormValidator(editingProfileForm);
  editingProfileFormValidation.setFormValidationListeners();
  const editingCardFormValidation = new FormValidator(editingCardsForm);
  editingCardFormValidation.setFormValidationListeners();
  const editingAvatarFormValidation = new FormValidator(editingAvatarForm);
  editingAvatarFormValidation.setFormValidationListeners();

  //функции-колбэки для отдельной карточки
  function deleteCard(id) {
    return api.deleteCard(id);
  }

  function addLikeCard(id) {
    return api.addLikeCard(id);
  }

  function removeLikeCard(id) {
    return api.removeLikeCard(id);
  }

  function openPopupCard(link) {
    return popupImage.open(link);
  }

  //установка глобальных обработчиков
  function setGlobalEventListeners() {
    //работа с попапами
    editingCardElementBtn.addEventListener('click', () => {
      popupAddCart.open();
    });

    editingProfileElementBtn.addEventListener('click', () => {
      /**
       * (DONE, раз метод не зависит от экземпляра класса, то сделал его статичным)
       * Андрей (8-ой спринт, 2-ая итерация): Неплохая идея, по-моему.
       */
      PopupForm.updateFormField(editingProfileForm.elements.editname, userName.textContent);
      PopupForm.updateFormField(editingProfileForm.elements.about, userAbout.textContent);
      editingProfileFormValidation.setSubmitButtonState();
      popupEditProfile.open();
    });

    editingAvatarElement.addEventListener('click', () => {
      popupEditAvatar.open();
    });

    //обработчики форм
    editingCardsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = editingCardsForm.elements.placename.value;
      const link = editingCardsForm.elements.link.value;
      const btn = editingCardsForm.querySelector('.button');
      const initialValueBtn = btn.textContent;
      btn.innerHTML = 'Загрузка...';
      api.postNewCard(name, link)
        .then((card) => {
          cardList.addCard(new Card(
            {
              name: card.name,
              link: card.link,
              likes: card.likes,
              id: card._id,
              ownerUserId: card.owner['_id'],
              currentUserId: card.owner['_id'],
              deleteCard,
              addLikeCard,
              removeLikeCard,
              templateCard,
              openPopupCard
            }).create());
          btn.innerHTML = initialValueBtn;
          popupAddCart.close();
        })
        .catch(e => {
          btn.innerHTML = initialValueBtn;
          console.log(e);
        });
    });

    editingProfileForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = editingProfileForm.elements.editname.value;
      const about = editingProfileForm.elements.about.value;
      const btn = editingProfileForm.querySelector('.button');
      const initialValueBtn = btn.textContent;
      btn.innerHTML = 'Загрузка...';
      api.updateProfile(name, about)
        .then(({name, about, avatar, _id}) => {
          profile.setUserInfo({name, about, avatar, _id});
          btn.innerHTML = initialValueBtn;
          popupEditProfile.close();
        })
        .catch(e => {
          btn.innerHTML = initialValueBtn;
          console.log(e)
        });
    });

    editingAvatarForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const link = editingAvatarForm.elements.link.value;
      api.changeProfileAvatar(link)
        .then((res) => {
          editingAvatarElement.setAttribute('style', `background-image: url(${res.avatar})`);
          popupEditAvatar.close();
        })
        .catch(e => console.log(e));
    });
  }

  //сначала профиль, потом карточки. Без id пользователя невозможно понять лайкал ли текущий пользователь карточки
  api.getProfile()
    .then((res) => {
      profile.setUserInfo({
        name: res.name,
        about: res.about,
        avatar: res.avatar,
        id: res._id
      })
      return res._id;
    })
    /**
     * Можно лучше:
     * Сделать цепочку then'ов плоской.
     * Тогда не придется держать два блока catch.
     * Прокинуть currentUserId можно, например, так:
     * https://qna.habr.com/q/251436
     */
    .then(currentUserId => {
      api.getInitialCards()
        .then(cardsFromApi => {
          cardList.cards = cardsFromApi.map(card => {
            return new Card(
              {
                name: card.name,
                link: card.link,
                likes: card.likes,
                id: card._id,
                ownerUserId: card.owner['_id'],
                currentUserId,
                deleteCard,
                addLikeCard,
                removeLikeCard,
                templateCard,
                openPopupCard
              }).create()
          });
          cardList.render();
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  setGlobalEventListeners();
})();

/**
 * Отличная работа: помимо обязательных заданий реализованы все дополнительные.
 * Функционал работает без ошибок: информация обновляется только после ответа сервера.
 * Работа с API выполнена верно - вся работа организована с помощью класса Api. Токен и адрес сервера передаются один
 * раз в конструктор - код не дублируется. Ошибки сервера обрабатываются - catch расположен в верном месте.
 */