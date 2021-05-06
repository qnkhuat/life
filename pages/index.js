import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authContext } from '../lib/auth';
import React from "react";
import { withRouter } from 'next/router';

//export default function Home() {
//  const { auth, loading, signOut } = useAuth();
//
//  const router = useRouter();
//  useEffect(() => {
//    if (!auth && !loading) {
//      router.push('/login?next=/');
//    }
//  }, [auth, loading]);
//
//  const title = auth ? auth.name : "stranger";
//
//  return (
//    <div className="container mx-auto">
//      <p>{title}</p>
//      <Button onClick={() => signOut()}>
//        Log out
//      </Button>
//
//    </div>
//  )
//}

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      token: "nothing"
    }
  }
  static contextType = authContext;

  componentDidMount() {
    const { auth, loading } = this.context;
    if (!auth && !loading) {
      this.props.router.push('/login?next=/');
    }
    if (auth){
      this.setState({token: auth.token});
    }

  }

  render(){
    const { auth, signOut } = this.context;
    const title = auth ? auth.name : "stranger";
    return (
      <div className="container mx-auto">
        <p>{title}</p>
        <p>{this.state.token}</p>
        <Button onClick={() => signOut()}>
          Log out
        </Button>
      </div>
    )
  }
}

export default withRouter(Home);
