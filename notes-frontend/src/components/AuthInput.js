import React from 'react'

function AuthInput({setplaceholder,value,setValue}) {
  return (
    <div>
      <input type='text' required placeholder={setplaceholder} value={value} onChange={(e)=>{setValue(e.target.value)}} className='auth-input' autoFocus/><span className='required'>*</span>
    </div>
  )
}

export default AuthInput
