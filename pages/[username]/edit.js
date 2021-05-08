import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FirebaseUpload from "../../components/FirebaseUpload";

function Edit({ events, birthday, maxAge }) {
  const { auth } = useAuth();
  const router = useRouter();
  var eventsList = [];
  Object.keys(events).forEach((key) => {
    eventsList.push(events[key]);
  });
  return (
    <div className="container mx-auto">
    <form className="" noValidate autoComplete="off" className="flex mt-40">
        <TextField id="info-fullname" 
          label="Full name" 
          variant="outlined" 
          onChange={(e) => setFullname(e.target.value)}
          required/>
        <TextField id="info-username" 
          onChange={(e) => setUsername(e.target.value)}
          label="Username" 
          variant="outlined" 
          required/>
        <TextField id="info-birthday" 
          onChange={(e) => setBirthday(e.target.value)}
          label="Birthday" 
          variant="outlined" 
          type="datetime-local"
          InputLabelProps={{shrink: true}}
          required/>
        <TextField id="info-maxage" 
          onChange={(e) => setMaxAge(e.target.value)}
          label="MaxAge" 
          variant="outlined" 
          type="number" 
          defaultValue={100}
          required/>
        <TextField id="info-email" 
          onChange={(e) => setEmail(e.target.value)}
          label="Email" 
          disabled={auth?.email ? true : false}
          variant="outlined"           
          defaultValue={auth?.email || null}
          InputProps={{ readOnly: true}}
        />
        <TextField id="info-about" 
          onChange={(e) => setAbout(e.target.value)}
          label="About your sefl" 
          multiline
          variant="outlined" />

          <FirebaseUpload id="info-avatar" className="bg-black"/>
        
        <Button id="info-submit" variant="outlined" color="primary">
          Submit
        </Button>
      </form>

    </div>
  )
}

export async function getServerSideProps(context) {
  console.log("arround here");
  const { username } = context.query;
  var events = null, user = null;
  try {
    const events_req = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}/stories`));
    const user_req = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}`));
    events = events_req.data;
    user = user_req.data;
  } catch (error){
    return {
      redirect: {
        notFound: true,
      }
    }
  }
  return { props: { events: events, birthday: user.birthday, maxAge: user.maxAge } };
}

export default withAuth(Edit, true, "/403");
