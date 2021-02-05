import * as React from "react";
import rxUser from "../helpers/rxUser";


export default function useUser() {
  const [userState, setUserState] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const $user = rxUser.subscribe((user) => {
      setUserState(user);
      setLoaded(true);
    });
    return () => {
      $user.unsubscribe();
    };
  }, []);

  const isLoggedIn = () => {
    return loaded && userState !== null;
  };

  return { userState, loaded, isLoggedIn };
}
