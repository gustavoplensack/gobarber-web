import { createContext } from 'react';
/**
 * A context is used for sharing information between screens and
 * react components.  This is an aunthentication component.
 */

interface AuthContextData {
  name: string;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;
