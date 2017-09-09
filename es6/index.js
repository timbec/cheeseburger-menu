import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Swipe from 'react-easy-swipe'

import {
  overlayStyle,
  overlayActiveStyle,
  menuOuterStyle,
  menuOuterActiveStyle,
  menuShadowStyle,
  menuShadowActiveStyle,
  menuInnerStyle
} from './styles'

class CheeseburgerMenu extends Component {
  constructor() {
    super()
    this.state = {
      swiping: false,
      swipePosition: {x: 0, y: 0},
      menuExtraStyle: {}
    }
  }

  onSwipeStart(event) {
    if (this.props.isOpen) {
      this.setState({
        swiping: true
      })
    }
  }

  onSwipeMove(position, event) {
    if (this.state.swiping) {
      const snapOpenThreshold = this.options.width / 15
      const pastThreshold = (
        (!this.props.right && position.x < -snapOpenThreshold) ||
        ( this.props.right && position.x >  snapOpenThreshold)
      )
      const translateX = (pastThreshold ? position.x : 0)

      this.setState({
        swipePosition: position,
        menuExtraStyle: {
          transform: `translate3d(${translateX}px, 0px, 0px)`,
          transition: 'transform 0s'
        }
      })
    }
  }

  onSwipeEnd(event) {
    const swipeCloseThreshold = this.options.width / 3
    if (
      (!this.props.right && this.state.swipePosition.x < -swipeCloseThreshold) ||
      ( this.props.right && this.state.swipePosition.x >  swipeCloseThreshold)
    ) {
      this.props.closeCallback()
    }
    this.setState({
      swiping: false,
      swipePosition: {x: 0, y: 0},
      menuExtraStyle: {}
    })
  }

  componentWillMount() {
    this.options = {
      isLeft: (!this.props.right),
      transitionTime: this.props.transitionTime || 0.3,
      topOffset: this.props.topOffset || 0,
      width: this.props.width || 300,
      backgroundColor: this.props.backgroundColor || 'white',
      showShadow: (!this.props.noShadow)
    }
  }

  render() {
    const baseMenuOuterStyle = (this.props.isOpen ? menuOuterActiveStyle(this.options) : menuOuterStyle(this.options))
    const currentMenuOuterStyle = {...baseMenuOuterStyle, ...this.state.menuExtraStyle}

    return (
      <div className={"cheeseburger-menu" + (this.props.isOpen ? " open" : "")}>
        <div className="cheeseburger-menu-overlay"
             style={this.props.isOpen ? overlayActiveStyle(this.options) : overlayStyle(this.options)}
             onClick={this.props.closeCallback}/>

        <Swipe onSwipeStart={this.onSwipeStart.bind(this)}
               onSwipeMove={this.onSwipeMove.bind(this)}
               onSwipeEnd={this.onSwipeEnd.bind(this)}>
          <div className="cheeseburger-menu-outer" style={currentMenuOuterStyle}>
            <div className="cheeseburger-menu-inner" style={menuInnerStyle(this.options)}>
              {this.props.children}
            </div>
            <div className="cheeseburger-menu-shadow"
                 style={this.props.isOpen ? menuShadowActiveStyle(this.options) : menuShadowStyle(this.options)}/>
          </div>
        </Swipe>
      </div>
    )
  }
}

CheeseburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
  right: PropTypes.bool,
  transitionTime: PropTypes.number,
  topOffset: PropTypes.number,
  width: PropTypes.number,
  backgroundColor: PropTypes.string,
  noShadow: PropTypes.bool
}

export default CheeseburgerMenu
