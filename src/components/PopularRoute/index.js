import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import Header from '../Header'

import './index.css'
import FooterRoute from '../FooterRoute'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PopularRoute extends Component {
  state = {
    popularList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPopularVideos()
  }

  getPopularVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const fetchedData = data.results.map(eachItem => ({
        id: eachItem.id,
        backdropPath: eachItem.backdrop_path,
        posterPath: eachItem.poster_path,
        title: eachItem.title,
      }))
      this.setState({
        popularList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {popularList} = this.state
    return (
      <div>
        <ul className="popular-list-items">
          {popularList.map(eachItem => (
            <Link to={`/movies/${eachItem.id}`} key={eachItem.id}>
              <li key={eachItem.id} className="list-item-popular">
                <img
                  src={eachItem.posterPath}
                  alt={eachItem.title}
                  className="popular-img"
                />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  onRetry = () => {
    this.getPopularVideos()
  }

  renderFailureView = () => (
    <div className="original-fail-container">
      <FailureView onRetry={this.onRetry} />
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="popular-container">
          <Header />
          <div className="popular-responsive-container">
            {this.renderAll()}
            <FooterRoute />
          </div>
        </div>
      </>
    )
  }
}
export default PopularRoute
