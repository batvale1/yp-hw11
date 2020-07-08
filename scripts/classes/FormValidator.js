class FormValidator {
  constructor(form) {
    this.form = form;
  }
  setFormValidationListeners() {
    //выставляем ошибки и статус сабмита при инпутах
    this.form.addEventListener('input', this._checkInputValidity.bind(this));
    //выставляем изначальное состояние формы при открытии
    this.setSubmitButtonState();
  }

  _checkInputValidity(event) {
    const curItem = event.target;
    const errorItem = curItem.nextElementSibling;
    if (curItem.validity.valueMissing) {
      errorItem.textContent = 'Это обязательное поле';
    } else if (curItem.validity.tooLong || curItem.validity.tooShort) {
      const minValue = curItem.getAttribute('minlength');
      const maxValue = curItem.getAttribute('maxlength');
      errorItem.textContent = `Должно быть от ${minValue} до ${maxValue} символов`;
    } else if (curItem.validity.typeMismatch) {
      errorItem.textContent = 'Здесь должна быть ссылка';
    } else {
      errorItem.textContent = '';
    }

    this.setSubmitButtonState(event.currentTarget);
  }

  setSubmitButtonState() {
    const submitBtn = this.form.querySelector('.popup__button');
    if (this.form.checkValidity()) {
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.setAttribute('disabled', 'true');
    }
  }
}