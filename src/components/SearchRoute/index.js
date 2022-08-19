import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {HiOutlineSearch} from 'react-icons/hi'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchList: [],
    searchInput: '',
  }

  getSearchMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state

    const searchUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(searchUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const fetchedData = data.results.map(eachItem => ({
        id: eachItem.id,
        backdropPath: eachItem.backdrop_path,
        title: eachItem.title,
        posterPath: eachItem.poster_path,
      }))
      this.setState({
        searchList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickTryAgain = () => {
    this.getSearchMovies()
  }

  renderFailureView = () => (
    <div className="search-failure-div">
      <img
        className="search-failed-image"
        src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426934/homepage-failure_egb8fl.png"
        alt="failure view"
      />

      <h1 className="try-description">
        Something went wrong. Please try again
      </h1>
      <button type="button" className="try-btn" onClick={this.onClickTryAgain}>
        Try Again
      </button>
    </div>
  )

  renderNoSearchFound = () => {
    const {searchInput} = this.state
    return (
      <div className="no-search-container">
        <img
          src="https://res.cloudinary.com/dtvpdvwm9/image/upload/v1660053592/Group_7394_iyciwz.png"
          alt="no movies"
          className="no-search-img"
        />
        <p className="no-search-description">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderSearchResults = () => {
    const {searchList} = this.state
    return (
      <div className="search-result-div">
        <ul className="search-ul-lists">
          {searchList.map(eachItem => (
            <li key={eachItem.id} className="search-list-item">
              <Link to={`/movies/${eachItem.id}`} key={eachItem.id}>
                <img
                  src={eachItem.posterPath}
                  alt={eachItem.title}
                  className="search-poster"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSuccessView = () => {
    const {searchList} = this.state
    const lengthOfList = searchList.length > 0
    return (
      <>
        {lengthOfList ? this.renderSearchResults() : this.renderNoSearchFound()}
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onEnterSearchInput = () => {
    const {searchInput} = this.state
    if (searchInput !== '') {
      this.getSearchMovies()
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="search-container-div">
        <input
          type="search"
          className="input-element"
          onChange={this.onChangeSearchInput}
          value={searchInput}
        />
        <button
          type="button"
          onClick={this.onEnterSearchInput}
          className="search-btn"
          testid="searchButton"
        >
          <HiOutlineSearch className="search-Hi-icon" />
        </button>
      </div>
    )
  }

  renderSearchView = () => {
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
      <div className="search-container" testid="search">
        <Header />
        {this.renderSearchBar()}
        <div className="search-responsive-div">{this.renderSearchView()}</div>
      </div>
    )
  }
}
export default SearchRoute
