export class CreditCard {
  readonly cardNumber: string;
  readonly expireDate: string;
  readonly cvc: string;

  constructor(cardNumber: string, expireDate: string, cvc: string) {
    this.cardNumber = cardNumber;
    this.expireDate = expireDate;
    this.cvc = cvc;
  }
}
