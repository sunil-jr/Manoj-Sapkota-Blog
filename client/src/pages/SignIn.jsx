import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.emailOrUsername || !formData.password){
      return dispatch(signInFailure("Please fill out all fields."));
    }
    try{
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if(data.success === false){
        return dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch(err){
      return dispatch(signInFailure(data.message));
    }
  }

  return (
    <div className='min-h-screen mt-20'>

      
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
      { /* Left Side */ }
      <div className='flex-1'>
      <Link to= '/' className='font-bold dark:text-white text-4xl'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Banking</span>
        Tayari
    </Link>

      <p className='text-sm mt-5'>
        Welcome to Banking Tayari. You can sign in with your email and password or Google.
      </p>
      </div>

      { /* Right Side */ }
      <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value='Email or Username' />
            <TextInput type = 'text' placeholder='Username/Email' id='emailOrUsername' onChange = {handleChange}/>
          </div>
          <div>
            <Label value='Password' />
            <TextInput type = 'password' placeholder='********' id='password' onChange = {handleChange}/>
          </div>

          <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
            {
            loading ? (
              <>
              <Spinner size='sm'/>
              <span className='pl-3'>Loading...</span>
              </>
            ) : 'Sign In'
}
          </Button>
          <OAuth />
        </form>
        <div className='flex gap-2 text-sm mt-5'> 
          <span>Don't have an account?</span>
          <Link to='/sign-up' className='text-blue-500'>
            Sign Up
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
      </div>
    </div>
    </div>
  );
}
