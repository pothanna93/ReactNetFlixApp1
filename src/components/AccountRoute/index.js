import Cookies from 'js-cookie'

import FooterRoute from '../FooterRoute'
import Header from '../Header'
import './index.css'

const AccountRoute = props => {
  const username = localStorage.getItem('username')
  const password = localStorage.getItem('password')

  const passwordInAsterisk = '*'.repeat(password.length)

  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="account-container">
      <Header />
      <div className="account-resp-div">
        <h1>Account</h1>
        <hr className="hr-line" />
        <div className="member-details-container">
          <p className="membership-heading">Member ship</p>
          <div>
            <p className="membership-email">{username}@gmail.com</p>
            <p className="membership-password">Password:{passwordInAsterisk}</p>
          </div>
        </div>
        <hr className="hr-line" />
        <div className="membership-container">
          <p className="membership-heading">Plan details</p>
          <p className="membership-premium">Premium</p>
          <p className="ultra-hd">Ultra HD</p>
        </div>
        <hr className="hr-line" />
        <div className="account-logout-container">
          <button
            onClick={onClickLogout}
            className="account-logout"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
      <FooterRoute />
    </div>
  )
}

export default AccountRoute
