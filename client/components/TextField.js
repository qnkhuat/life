import TextField from '@material-ui/core/TextField';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
   
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
  },
});

export default CustomTextField ;
