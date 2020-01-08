import React, {Component} from "react";
import {getJwt, getUserStored} from "../helpers/jwt";
import { logout } from '../utils/APICalls';
import {AuthProvider} from "../authContext";

class Auth extends Component{
    
    state = {
        authenticated: false,
        user: {
          userType: "visitor"
        },
        accessToken: ""
      };
    
      constructor(props){
        super(props);
        const jwt = getJwt();
        const user = getUserStored();
        if(!jwt){
          this.state = {
            authenticated: false,
            user: {
              role: "visitor"
            },
            accessToken: ""
          };
        }
        else{
            this.state ={
              authenticated: true,
              accessToken: jwt,
              user: user
            };
            console.log("constructorrr + then",this.state.authenticated);
         
        }
      }
      initiateLogin = (data) => {
        this.setSession(data);
      };
    
      logout = () => {
        console.log("logging outss");
        logout(this.state.accessToken,this.state.user).then(res => {
            localStorage.removeItem('token');
            localStorage.removeItem('colab-user');
            this.setState({
                authenticated: false,
                user: {
                  role: "visitor"
                },
                accessToken: ""
            });
        }).catch(err=> {
          console.log(err);
          if(err.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('colab-user');
            this.setState({
                authenticated: false,
                user: {
                  role: "visitor"
                },
                accessToken: ""
            });
          }
        })
        
        
       
      };
    
      handleAuthentication = () => {
      };
    
      setSession(data) {
          localStorage.setItem('token',data.token);
          localStorage.setItem('colab-user',JSON.stringify(data.user));
          const user = data.user;
          this.setState({
            authenticated: true,
            accessToken: data.token,
            user
          });
      }

    // logout(){
    //     const jwt = getJwt();
    //     logout(jwt,this.state.user).then(res => {
    //         this.setState({user: undefined});
    //         localStorage.removeItem('token');
    //         this.props.history.push('/login');
    //     })
    // }

    componentDidMount(){
        const jwt = getJwt();
        const user = getUserStored();
        if(!jwt || !user){
          console.log("did mount auth msh tamam");
          this.setState({
            authenticated: false,
            user: {
              role: "visitor"
            },
            accessToken: ""
          });
        }
        else{
          console.log("did mount auth tamam");
            this.setState({
              authenticated: true,
              accessToken: jwt,
              user
            });

        }
        
        
    }


    // render(){
    //     const childrenWithProps = React.Children.map(this.props.children, child =>
    //         React.cloneElement(child, { user: this.state.user })
    //       );
    //     if(this.state.user === undefined){
    //         return(
    //         <div><h1>loading...</h1></div>
    //         );
    //     }
    //     return(
    //         <div>
    //             <Navbar logout={this.logout}
    //                     user = {this.state.user}/>
    //             <div>
    //                 {/* {this.props.children} */}
    //                 {childrenWithProps}
    //             </div> 
    //         </div>
                       
    //     );
    // }
    render() {
        const authProviderValue = {
          ...this.state,
          initiateLogin: this.initiateLogin,
          handleAuthentication: this.handleAuthentication,
          logout: this.logout
        };
        return (
          <AuthProvider value={authProviderValue}>
            {this.props.children}
          </AuthProvider>
        );
      }
    


} 
export default Auth;