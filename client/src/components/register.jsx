import style from './register.module.css'

function Register(props) {

    return (
      <div className={style.register}>
        <h2>Please create your account</h2>
        <p>Already registered? <a onClick={props.toggleDisplay}>Log in here.</a></p>

        <form className={style.registerform} action="http://localhost:4000/login/register" method='POST' autoComplete='off' target="_self" onClick='this.diabled=true;this.value=`Sending...`'>
          <label htmlFor="username">Username:</label>
          <input type="text" name='username' id='username' required/>
  
          <label htmlFor="password">Password:</label>
          <input type="password" name='password' id='password' required/>
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" name='confirm-password' id='confirm-password' required/>

          <button>Sign me up!</button>
        </form>
  
      </div>
    )
  }
  
  export default Register
  