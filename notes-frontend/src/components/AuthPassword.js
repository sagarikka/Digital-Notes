import React from 'react'

function AuthPassword({value,setValue}) {
  return (
    <div>
      <input type='password' required placeholder="Password" value={value} onChange={(e)=>{setValue(e.target.value)}} className='auth-input'/><span className='required'>*</span>
    </div>
  )
}

export default AuthPassword
