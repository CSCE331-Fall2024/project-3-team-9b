import { GoogleLogin } from '@react-oauth/google'

const clientId = "32164770538-vg436on3johb97cfdlcpm35nm083s85r.apps.googleusercontent.com"

function Logout() {

    const onSuccess = (res) => {
        console.log('Logged out');
    }


    return (
        <div id="signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onSuccess={onSuccess}
            />
        </div>
    );
}

export default Logout;
