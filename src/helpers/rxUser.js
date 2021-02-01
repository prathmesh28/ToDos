import { authState } from "rxfire/auth";
import Firebase from "../firebase";

// authState returns a rxjs Observable that contains
// the state of the user (firebase.User || null)
export default authState(Firebase.auth());
