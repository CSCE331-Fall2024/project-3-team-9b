import { GoogleLogin } from '@react-oauth/google'

const clientId = "32164770538-vg436on3johb97cfdlcpm35nm083s85r.apps.googleusercontent.com"

function Login() {

    const onSuccess = (res) => {
        console.log('Login Success:', res.profileObj);
    }

    const onFailure = (error) => {
        console.log('Login Failed:', error);
    }


    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;
