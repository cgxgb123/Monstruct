import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
  data: {
    username: string;
    email: string;
    _id: string;
  };
}

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<TokenPayload>(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('id_token');
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/'); // Or wherever your dashboard lives
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
