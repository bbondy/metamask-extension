import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import FileInput from 'react-simple-file-input'
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes'
import { getMetaMaskAccounts } from '../../../selectors/selectors'
import Button from '../../../components/ui/button'

const HELP_LINK = 'https://metamask.zendesk.com/hc/en-us/articles/360015489351-Importing-Accounts'

class JsonImportSubview extends Component {
  state = {
    fileContents: '',
  }

  render () {
    const { error } = this.props

    return (
      <div className="new-account-import-form__json">
        <p>{this.context.t('usedByClients')}</p>
        <a className="warning" href={HELP_LINK} target="_blank">{this.context.t('fileImportFail')}</a>
        <FileInput
          readAs="text"
          onLoad={this.onLoad.bind(this)}
          style={{
            padding: '20px 0px 12px 15%',
            fontSize: '15px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        />
        <input
          className="new-account-import-form__input-password"
          type="password"
          placeholder={this.context.t('enterPassword')}
          id="json-password-box"
          onKeyPress={this.createKeyringOnEnter.bind(this)}
        />
        <div className="new-account-create-form__buttons">
          <Button
            type="default"
            large
            className="new-account-create-form__button"
            onClick={() => this.props.history.push(DEFAULT_ROUTE)}
          >
            {this.context.t('cancel')}
          </Button>
          <Button
            type="secondary"
            large
            className="new-account-create-form__button"
            onClick={() => this.createNewKeychain()}
          >
            {this.context.t('import')}
          </Button>
        </div>
        {
          error
            ? <span className="error">{error}</span>
            : null
        }
      </div>
    )
  }

  onLoad (event) {
    this.setState({
      fileContents: event.target.result,
    })
  }

  createKeyringOnEnter (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.createNewKeychain()
    }
  }

  createNewKeychain () {
    const { firstAddress, displayWarning, importNewJsonAccount, setSelectedAddress, history } = this.props
    const { fileContents } = this.state

    if (!fileContents) {
      const message = this.context.t('needImportFile')
      return displayWarning(message)
    }

    const passwordInput = document.getElementById('json-password-box')
    const password = passwordInput.value

    importNewJsonAccount([ fileContents, password ])
      .then(({ selectedAddress }) => {
        if (selectedAddress) {
          history.push(DEFAULT_ROUTE)
          this.context.metricsEvent({
            eventOpts: {
              category: 'Accounts',
              action: 'Import Account',
              name: 'Imported Account with JSON',
            },
          })
          displayWarning(null)
        } else {
          displayWarning('Error importing account.')
          this.context.metricsEvent({
            eventOpts: {
              category: 'Accounts',
              action: 'Import Account',
              name: 'Error importing JSON',
            },
          })
          setSelectedAddress(firstAddress)
        }
      })
      .catch(err => err && displayWarning(err.message || err))
  }
}

JsonImportSubview.propTypes = {
  error: PropTypes.string,
  displayWarning: PropTypes.func,
  firstAddress: PropTypes.string,
  importNewJsonAccount: PropTypes.func,
  history: PropTypes.object,
  setSelectedAddress: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(getMetaMaskAccounts(state))[0],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    displayWarning: warning => dispatch(actions.displayWarning(warning)),
    importNewJsonAccount: options => dispatch(actions.importNewAccount('JSON File', options)),
    setSelectedAddress: (address) => dispatch(actions.setSelectedAddress(address)),
  }
}

JsonImportSubview.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func,
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(JsonImportSubview)
