class PopupImage extends Popup{
  constructor(element) {
    super(element);
    this.detailImage = element.querySelector('.popup__img');
    this.open = this.open.bind(this);
  }
  open(imgSrc) {
    this.detailImage.setAttribute('src', imgSrc);
    this.element.classList.add('popup_is-opened');
  }
}