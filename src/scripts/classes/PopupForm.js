import Popup from './Popup';
export default class PopupForm extends Popup{
  constructor(element) {
    super(element);
    this.form = element.querySelector('form');
  }
  _resetForm() {
    if (this.form) {
      this.form.reset();
      const errors = this.form.querySelectorAll('.popup__error');
      for (const error of errors) {
        error.textContent = '';
      }
    }
  }
  close() {
    this._resetForm();
    this.element.classList.remove('popup_is-opened');
  }
  static updateFormField(field, value) {
    field.value = value;
  }
}