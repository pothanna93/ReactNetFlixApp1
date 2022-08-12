import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import HomePoster from '../HomePoster'
import TrendingRoute from '../TrendingRoute'
import OriginalRoute from '../OriginalRoute'
import FooterRoute from '../FooterRoute'
import FailureView from '../FailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class HomeRoute extends Component {
  state = {
    originalsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getOriginals()
  }

  getOriginals = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const originalsUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(originalsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedDataLength = data.results.length
      const randomPoster =
        data.results[Math.floor(Math.random() * fetchedDataLength)]

      const updatedData = {
        id: randomPoster.id,
        backdropPath: randomPoster.backdrop_path,
        title: randomPoster.title,
        overview: randomPoster.overview,
        posterPath: randomPoster.poster_path,
      }
      this.setState({
        originalsList: {...updatedData},
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onRetry = () => {
    this.getOriginals()
  }

  renderFailureView = () => (
    <div className="home-fail-div">
      <FailureView onRetry={this.onRetry} />
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader
        testid="loader"
        type="TailSpin"
        height={35}
        width={380}
        color=" #D81F26"
      />
    </div>
  )

  renderSuccessView = () => {
    const {originalsList} = this.state

    return (
      <div className="home-poster-div">
        <HomePoster posterDetails={originalsList} />
      </div>
    )
  }

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
        <div className="home-app-container">
          {this.renderAll()}
          <div className="home-responsive-container">
            <h1 className="slide-title">Trending Now</h1>

            <TrendingRoute />

            <h1 className="slide-title">Originals</h1>
            <OriginalRoute />
            <FooterRoute />
          </div>
        </div>
      </>
    )
  }
}
export default HomeRoute
