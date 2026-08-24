export { 
  app, 
  auth, 
  db, 
  testFirebaseConnection, 
  cleanForFirestore, 
  syncUserProfileInFirestore, 
  signOutFirebaseUser 
} from '../../lib/firebase';
import { app } from '../../lib/firebase';
export default app;

