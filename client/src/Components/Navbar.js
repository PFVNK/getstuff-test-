import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'
import MediaQuery from 'react-responsive'

import AddTag from './AddTag'

import '../App.css'

class Navbar extends Component {

  render() {
    const { tags, handleDelete, handleAddition, handleDrag, delimiters } = this.props
    return (
      <React.Fragment>
        <header className='nav-header'>
          <div className='nav-logo'><div className='nav-logo-title'>STUFF</div></div>
          <MediaQuery query='(max-width: 900px)'>
            <Menu>
              <AddTag
                className='nav-tag'
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
              />
            </Menu>
          </MediaQuery>
          <MediaQuery query='(min-width: 900px)'>
            <AddTag
              className='nav-tag'
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              delimiters={delimiters}
            />
          </MediaQuery>
        </header>
      </React.Fragment>
    )
  }
}


export default Navbar