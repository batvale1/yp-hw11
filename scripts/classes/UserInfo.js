class UserInfo {
  constructor(userNameField, userAboutField, userAvatarField) {
    this.nameElem = userNameField;
    this.aboutElem = userAboutField;
    this.avatarElem = userAvatarField;
  }
  setUserInfo({name, about, avatar, id}) {
    this.name = name;
    this.about = about;
    this.avatarUrl = avatar;
    this.id = id;
    this.updateUserInfo();
  }
  updateUserInfo() {
    this.nameElem.textContent = this.name;
    this.aboutElem.textContent = this.about;
    this.avatarElem.setAttribute('style', `background-image: url(${this.avatarUrl})`);
  }
}