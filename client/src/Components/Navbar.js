import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'
import MediaQuery from 'react-responsive'

import AddTag from './AddTag'

import '../App.css'

class Navbar extends Component {

  render() {
    return (
      <React.Fragment>
        <header className='nav-header'>
          <div className='nav-logo'><div className='nav-logo-title'>STUFF</div></div>
          <MediaQuery query='(max-width: 900px)'>
            <Menu>
              <AddTag
                className='nav-tag'
                tags={this.props.tags}
                handleDelete={this.props.handleDelete}
                handleAddition={this.props.handleAddition}
                handleDrag={this.props.handleDrag}
                delimiters={this.props.delimiters}
              />
            </Menu>
          </MediaQuery>
          <MediaQuery query='(min-width: 900px)'>
            <AddTag
              className='nav-tag'
              tags={this.props.tags}
              handleDelete={this.props.handleDelete}
              handleAddition={this.props.handleAddition}
              handleDrag={this.props.handleDrag}
              delimiters={this.props.delimiters}
            />
          </MediaQuery>
        </header>
      </React.Fragment>
    )
  }
}


export default Navbar