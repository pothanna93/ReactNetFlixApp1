import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import FailureView from '../FailureView'
import MovieItem from '../MovieItem'

import './index.css'
import FooterRoute from '../FooterRoute'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: [],
    genres: [],
    spokenLanguages: [],
    similarMovies: [],
  }

  componentDidMount() {
    this.getMovieItems()
  }

  getMovieItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = [data.movie_details].map(each => ({
        id: each.id,
        backdropPath: each.backdrop_path,
        budget: each.budget,
        title: each.title,
        overview: each.overview,
        originalLanguage: each.original_language,
        releaseDate: each.release_date,
        count: each.vote_count,
        rating: each.vote_average,
        runtime: each.runtime,
        posterPath: each.poster_path,
      }))

      const genresData = data.movie_details.genres.map(each => ({
        id: each.id,
        name: each.name,
      }))

      const updatedSimilarData = data.movie_details.similar_movies.map(
        each => ({
          id: each.id,
          posterPath: each.poster_path,
          title: each.title,
        }),
      )

      const updatedLanguagesData = data.movie_details.spoken_languages.map(
        each => ({
          id: each.id,
          language: each.english_name,
        }),
      )
      this.setState({
        movieDetails: updatedData,
        genres: genresData,
        spokenLanguages: updatedLanguagesData,
        similarMovies: updatedSimilarData.slice(0, 6),
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {movieDetails, genres, spokenLanguages, similarMovies} = this.state
    const newMovieDetails = {...movieDetails[0]}
    const {releaseDate, count, rating, budget} = newMovieDetails
    return (
      <>
        <div className="poster-container">
          {movieDetails.map(eachMovie => (
            <MovieItem movieDetails={eachMovie} key={eachMovie.id} />
          ))}
        </div>
        <div className="movie-info-container">
          <div className="movie-items-div">
            <h1 className="movie-info-heading">Genres</h1>
            <ul className="movie-info-ul-container">
              {genres.map(eachGenre => (
                <li className="movie-list-item" key={eachGenre.id}>
                  <p>{eachGenre.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="movie-items-div">
            <h1 className="movie-info-heading">Audio Available</h1>
            <ul className="movie-info-ul-container">
              {spokenLanguages.map(eachAudio => (
                <li className="movie-list-item" key={eachAudio.id}>
                  <p>{eachAudio.language}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="movie-items-div">
            <h1 className="movie-info-heading">Rating Count</h1>
            <p className="movie-list-item">{count}</p>
            <h1 className="movie-info-heading">Rating Average</h1>
            <p className="movie-list-item">{rating}</p>
          </div>
          <div className="movie-items-div">
            <h1 className="movie-info-heading">Budget</h1>
            <p className="movie-list-item">{budget}</p>
            <h1 className="movie-info-heading">Release Date</h1>
            <p className="movie-list-item">{releaseDate}</p>
          </div>
        </div>
        <div className="movie-similar-container">
          <h1 className="more-like-this">More like this</h1>
          <ul className="similar-ul-container">
            {similarMovies.map(each => (
              <Link to={`/movies/${each.id}`} key={each.id} target="blank">
                <li className="similar-li-item" key={each.id}>
                  <img
                    className="movie-popular-poster"
                    src={each.posterPath}
                    alt={each.title}
                  />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </>
    )
  }

  onRetry = () => {
    this.getMovieItems()
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
      <div className="movie-item-container">
        {this.renderAll()}
        <FooterRoute />
      </div>
    )
  }
}

export default MovieItemDetails
