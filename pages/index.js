import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authContext } from '../lib/firebase/auth';
import React from "react";
import { withRouter } from 'next/router';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      token: "nothing"
    }
  }
  static contextType = authContext;

  componentDidMount() {
    const { auth, user, loading } = this.context;
    console.log("test", !auth, !loading);
    if (!auth && !loading) {
      console.log("testtttttttttt");
      this.props.router.push('/login?next=/');
    }
    if (auth){
      this.setState({token: auth.token});
    }
  }

  render(){
    const { user, auth, signOut } = this.context;
    const title = auth ? auth.name : "stranger";
    return (
      <div className="container mx-auto">
        <p>{title}</p>
        <p>{this.state.token}</p>
        <p>{user && user.email}</p>
        <Button onClick={() => signOut()}>
          Log out
        </Button>
        <Button onClick={() => this.go()}>
          GO
        </Button>

      </div>
    )
  }
}

export default withRouter(Home);
