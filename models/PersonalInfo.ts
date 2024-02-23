export class PersonalInfo {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
