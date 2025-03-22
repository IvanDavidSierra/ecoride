class Validation {
  constructor() {}

  inputValid(input, regex) {
    return regex.test(input);
  }
  validNames(cad) {
    const nameRx = /^([a-zA-ZÀ-ÖØ-öø-ÿ]{3,25})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]{0,25})$/;
    const isValid = this.inputValid(cad, nameRx);
    return isValid;
  }

  validMails(cad) {
    const mailRx = /^([\w.]+[^#$%&\/()='"!?¡]\w*-*)([@])(\w)+(\.[a-z]{2,3})$/;
    const isValid = this.inputValid(cad, mailRx);
    return isValid;
  }

  validPassword(cad) {
    const passRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.:#])[A-Za-z\d@$!%*?&.:#]{8,16}$/;
    const isValid = this.inputValid(cad, passRx);
    return isValid;
  }

  validForm = (object) => {
    const valores = Object.values(object);
    const response = valores.findIndex((e) => e === false);
    return response;
  }
}

export { Validation };
