export class RegisterDto {
    email: string;
    password: string;
    roles: string;
  
    constructor(email: string, password: string, roles: string) {
      this.email = email;
      this.password = password;
      this.roles = roles;
    }
  }
  