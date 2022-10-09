import { Component } from 'react';
import { MainBox } from './App.styled';
import OnlyScroll from 'only-scrollbar';
import SearchBar from '../Searchbar/Searchbar';
import getImg from '../pixabayApi';
import ImageGallery from '../ImageGallery/ImageGallery';
import LoadMoreBtn from '../Button/Button';
import Loader from 'components/Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';

new OnlyScroll(window, {
  damping: 0.5,
});

export default class App extends Component {
  state = {
    items: [],
    isLoading: false,
    error: false,
    query: '',
    page: 1,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page, query, error, items } = this.state;
    const { page: prevPage, query: prevQuery, error: prevError } = prevState;
    if (prevPage !== page || prevQuery !== query) {
      this.fetchImg();
    }

    if (items.length === 0) {
      toast.error(
        'Sorry, there are no images matching your query. Please try again.'
      );
    }
    if (query === '') {
      toast.error('Write something!');
    }

    if (prevError !== error) {
      toast.error(error);
    }
  }

  handlerFormSubmit = values => {
    this.setState({
      page: 1,
      isLoading: false,
      error: false,
      items: [],
      query: values.searchQuery.trim(),
    });
  };

  fetchImg = async (query, page) => {
    try {
      this.setState({ isLoading: true });
      const response = await getImg(query, page);
      const images = response.hits;
      this.setState(({ items }) => ({
        items: [...items, ...images],
        isLoading: false,
      }));
    } catch {
      this.setState({ error: 'Can`t load images!' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      isLoading: true,
    }));
  };

  render() {
    const { items, isLoading } = this.state;
    return (
      <MainBox>
        <SearchBar onSubmit={this.handlerFormSubmit} />
        {isLoading && <Loader />}
        <ImageGallery items={items} />
        {items.length > 12 && <LoadMoreBtn onClick={this.loadMore} />}
        <Toaster />
      </MainBox>
    );
  }
}
