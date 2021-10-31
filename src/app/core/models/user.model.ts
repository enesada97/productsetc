export class User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  constructor(user) {
    {
      this.id=user.id||null;
      this.lastName=user.lastName||"";
      this.password=user.password||"";
      this.username=user.username||"";
      this.firstName=user.firstName||"";
    }
  }
}
