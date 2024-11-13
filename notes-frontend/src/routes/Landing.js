import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [openMenu,setOpenMenu]=useState(false)

  function togglebutton(){
    setOpenMenu(!openMenu);
  }
  return (
    <div className='landing-page'>
    <div className='landing_page-container'>
        {/*header */}
        <div className='landingpage-header'>
            <div className='landing_header-left'>
                <div ><Icon icon="streamline-emojis:sunflower-2" className='header_logo' width={`45px`}/></div>
                <div className='brand_name'>LearnLog</div>
            </div>

            <div className='landing_header-right'>
                <div className='btn'>About Us</div>
                <div><Link to='/login'>Login</Link></div>
                <div className='btn'><Link to='/signup'>Signup</Link></div>
            </div>
            <div className='landing_header-right-sm'>
              <div onClick={e=> {e.preventDefault(); togglebutton();}}><Icon icon="bx:menu" width={50} /></div>
              <div className={`${openMenu?'sm-modal':'sm-modal-hidden'}`}>
                <div>About us</div>
                <div><Link to='/login'>Login</Link></div>
                <div><Link to='/signup'>Signup</Link></div>
              </div>
            </div>
        </div>
        
        {/*Body*/}
        <div className='landingpage-body'>
           <div className='content'>
            <div className='text'>craft your <span className='text-big'>Knowledge</span></div>
            <div className='btn btn-lg'><Link to='/signup'>Signup</Link></div>     
           </div>        
        </div>
    </div>
    </div>
  )
}

export default LandingPage
