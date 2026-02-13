import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
  data: {
    username: string;
    email: string;
    _id: string;
  };
}

