import React, { useState } from 'react';
import "./Signup.css";
import { useFormik } from 'formik';
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { register, login } from '../../helpers/connector'
import { useNavigate, Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'; 

function SignUpPage() {
  
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues:{
      email:'',
      password:'',
      name:'',
      dob:'',
    },
    

    onSubmit: values=>{
      var text:string = "Email = ";
      text += values.email + "\nPassword: " + values.password + "\nName = " + values.name + "\nDate of birth: " + dateResult;
      if(window.confirm(text)){
        const emailError = emailValidator(values.email)
        const passwordError = passwordValidator(values.password)
        const nameError =!values.name? "Name can't be empty.":"";
        if (emailError || passwordError || nameError) {
          alert("invalid name, email or password")
          return
        }else{
          register(values.email, values.password, values.name, dateResult).then(()=>{
            login(values.email, values.password).then(()=>{
              console.log("loggin")
              navigate("/menu")
            }).catch(()=>{
              alert("Log in failed")
            })
          }).catch(()=>{
            alert("Register failed")
          })
        }
      }
    }
  })

  const [date, setDate] = useState<Date | null>(null);
  // const dateResult = JSON.stringify(date).substring(1,11);
  

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const minDate = new Date(1920, 0, 1);
  const maxDate = new Date(currentYear, currentMonth, currentDay);
  const dateResult = date ? date.toISOString().substring(0, 10) : '';

  return (
    <div className="App">
      <Link to="/" className="welcomeLink">Welcome Page</Link>
      <form className="form" onSubmit={formik.handleSubmit}>
        <p className='signUpName'>Sign Up</p>
        <div className="hasMargin">
          <label htmlFor='email'>Email Address : </label>
          <input onChange={formik.handleChange} value={formik.values.email} id='email' name='email'></input>
        </div>
        <div className="hasMargin">
          <label htmlFor='password'>Password : </label>
          <input onChange={formik.handleChange} value={formik.values.password} id='password' name='password'></input>
        </div>
        <div className="hasMargin">
          <label htmlFor='name'> Username : </label>
          <input onChange={formik.handleChange} value={formik.values.name} id='name' name='name'></input>
        </div>

        <div className='hasMargin'>
          <div className='datetime'>
            <label htmlFor='dob'>
              Date of Birth : 
            </label>
          </div>
          <div className='datetime'>
            <DatePicker
              dateFormat = "yyyy-MM-dd"
              selected = {date}
              onChange = {setDate}
              placeholderText = "YYYY/MM/DD"
              showYearDropdown
              showMonthDropdown
              scrollableMonthYearDropdown
              // className='custom-datepicker'
              yearDropdownItemNumber={currentYear - 1920 + 1}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
        <div className='registerDiv'>
          <button className="RegisterButton" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
  
export default SignUpPage;