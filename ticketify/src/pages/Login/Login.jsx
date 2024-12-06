import React, { useState } from 'react';
import Logo from '../../assets/img/ticketifyLogo.png';
import { useAppContext, getToken, getRoleNames } from '../../context/AppContext';

function Login() {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const onChange = (e, save) => {
    save(e.target.value);
  };

  async function onSubmit(e) {
    e.preventDefault();

    if (email === '') {
      setEmailError('Correo electrónico inválido');
      return;
    }

    if (password === '') {
      // Agrega el código para mostrar un error en caso de contraseña vacía
      return;
    }

    const logged = await login(email, password);

    // if (!logged) {
    //   // Agrega el código para mostrar un error en caso de error en el inicio de sesión
    //   return;
    // }

    setEmail('');
    setPassword('');
  }

  if (getToken() && getRoleNames()?.includes("User")) {
    window.location.href = './';
  } else if (getToken() && getRoleNames()?.includes("Admin")) {
    window.location.href = './event-admin';
  }

  return (
    <>
      <div className='bg-penn-blue h-screen w-screen flex justify-center'>
        <div className='bg-white h-[24rem] w-[20rem] lg:w-[20rem] m-auto p-auto rounded-xl'>
          <div className='flex justify-between items-center flex-col h-full w-full'>
            <div className='justify-center'>
              <img className='h-28' src={Logo} alt='ticketify' />
            </div>
            <form className='mt-8' onSubmit={onSubmit}>
              <div>
                <input
                  autoComplete='off'
                  id='email'
                  name='email'
                  type='email'
                  className={`peer placeholder-silver text-md font-light h-10 w-72 border shadow-sm rounded-lg border-gray-300 text-gray-900 focus:outline-none mb-4 ${emailError ? 'border-rose-600' : 'border-gray-300'
                    }`}
                  placeholder='Correo'
                  onChange={(e) => onChange(e, setEmail)}
                  value={email}
                  required
                />
                {emailError && (
                  <p className='text-red-500 font-semibold text-xs'>{emailError}</p>
                )}
                <div className='relative'>
                  <input
                    autoComplete='off'
                    id='password'
                    name='password'
                    type='password'
                    className='mt-4 peer placeholder-silver text-md font-light h-10 w-72 border shadow-sm rounded-lg border-gray-300 text-gray-900 focus:outline-none'
                    placeholder='Contraseña'
                    onChange={(e) => onChange(e, setPassword)}
                    value={password}
                  />
                </div>
                <div>
                  <a href={'./sendemailresetpassword'}>
                    <p className='text-pure-indigo py-2 text-base font-light'>
                      Olvidaste la contraseña?
                    </p>
                  </a>
                </div>
              </div>

              <div className='flex flex-col gap-5 m-5 text-white'>
                <button
                  type='submit'
                  className='bg-pure-indigo rounded-2xl p-2 text-center h-10 w-64 font-light text-sm shadow-silver shadow-md'
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
