import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';

class CharList extends Component {
    
    marvelService1 = new MarvelService();

    state = {
        charlist: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1400,
        charEnded: false,
        pageEnded: false
    }

    componentDidMount() {
        this.onRequest();
        // window.addEventListener('scroll', this.checkPageEnded)
        // window.addEventListener('scroll', this.onUpdateCharListByScroll)
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll', this.checkPageEnded)
        // window.removeEventListener('scroll', this.onUpdateCharListByScroll)
      }

    checkPageEnded = () => {
    if (
        window.scrollY + document.documentElement.clientHeight >=
        document.documentElement.offsetHeight - 3
        ) {
        this.setState({ pageEnded: true })
        }
    }
    
    onUpdateCharListByScroll = () => {
        const { pageEnded, charEnded, newItemLoading } = this.state
    
        if (pageEnded && !newItemLoading && !charEnded) {
            this.onRequest(this.state.offset)
        }
    }

    onRequest = (offset) => {
        this.onCharlistLoading();
        this.marvelService1.getAllCharacters(offset)
            .then(this.onCharlistLoaded)
            .catch(this.onError);
    }

    onCharlistLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharlistLoaded = (newCharlist) => {
        let ended = false;
        if (newCharlist.length < 9) {
            ended = true;
        }
        
        this.setState(({offset, charlist}) => ({
            charlist: [...charlist, ...newCharlist], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({error: true, loading: false})
    }

    myRefs = [];
 
    setInputRef = elem => {
        this.myRefs.push(elem);
    }
 
    onFocusChar = (index) => {
        this.myRefs[index].classList.add('char__item_selected');
    }
 
    onBlurChar = (index) => {
        this.myRefs[index].classList.remove('char__item_selected');
    }
    

    renderItems = (charlist) => {
        const items = charlist.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li 
                    ref={this.setInputRef}
                    tabIndex={0}
                    key={item.id} 
                    onFocus={() => this.onFocusChar(i)}
                    onBlur={() => this.onBlurChar(i)}
                    className='char__item'
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return items;
    }   

    render() {
        const {error, loading, charlist, newItemLoading, offset, charEnded} = this.state;
        console.log(charlist);
        const items = this.renderItems(charlist)

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading||error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                <ul className='char__grid'>
                    {content}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                        <div className="inner">load more</div>
                </button>
            </div>
        )
}
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}



export default CharList;