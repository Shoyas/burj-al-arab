import React, { useContext } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';


const Login = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();

    const { from } = location.state || { from: { pathname: "/" } };

    const handleGoogleSignIn = () => {
        
        if(firebase.apps.length === 0){
            firebase.initializeApp(firebaseConfig);
        }
        const GoogleProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(GoogleProvider)
        .then(function(result) {
            const {displayName, email} = result.user;
            const signedInUser = {Name: displayName, email};
            setLoggedInUser(signedInUser);
            storeAuthToken();
            //console.log(signedInUser);

          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
    }

    const storeAuthToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(function(idToken) {
            sessionStorage.setItem('token', idToken);
            history.replace(from);
        })
        .catch(function(error) {
            // Handle error
        });
    }

    return (
        <div>
            <h1>This is Login</h1>
            <button onClick={handleGoogleSignIn}>Google Sign In</button>
        </div>
    );
};

export default Login;