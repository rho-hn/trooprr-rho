import React, { Component } from 'react';


import coming_soon from '../../../media/coming_soon_files.svg'


class FilesComingSoon extends Component {
  render() {
    return (
      <div className="backlogs--container d-flex flex-column align-items-center">


<img src={coming_soon}  alt=""/>  

<div className ="notes_btn d-flex align-items-center justify-content-center">Coming Soon</div>

 
      </div>
    );
  }
}


export default FilesComingSoon;