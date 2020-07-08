export default class Popup {
  constructor(element) {
    this.element = element;
    this.closeBtn = element.querySelector('.popup__close');
  }
  setEventListeners() {
    this.closeBtn.addEventListener('click', this.close.bind(this));
  }
  close() {
    this.element.classList.remove('popup_is-opened');
  }
  open() {
    this.element.classList.add('popup_is-opened');
  }
}