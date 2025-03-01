import { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { batch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useDispatch, useSelector } from '../services/hooks';

import ArticlePage from '../pages/article-page';
import Editor from '../pages/editor';
import Login from '../pages/login';
import Main from '../pages/main';
import NotFound from '../pages/not-found';
import Profile from '../pages/profile';
import Register from '../pages/register';
import Settings from '../pages/settings';
import { closeConfirm, setLanguage } from '../store';
import basicThemes, { defaultTheme } from '../themes/index';
import {
  deleteArticleThunk,
  getAllPostsThunk,
  getAllTagsThunk,
  getUserThunk,
} from '../thunks';
import { Modal } from '../widgets';
import Footer from '../widgets/Footer';
import Header from '../widgets/Header';

import { IGenericVoidHandler } from '../types/widgets.types';

const App = () => {
  const dispatch = useDispatch();
  const { currentTheme, currentLang } = useSelector((state) => state.system);
  const { themes, langNames, vocabularies } = useSelector((state) => state.all);
  const { isDeleteConfirmOpen } = useSelector((state) => state.system);
  const { id: userId, username, nickname } = useSelector((state) => state.profile);
  const id = useSelector((state) => state.view.article?.id);
  const onConfirmDelete : IGenericVoidHandler = () => {
    batch(() => {
      if (id) {
        dispatch(deleteArticleThunk(id));
      }
      dispatch(closeConfirm());
    });
  };
  const onConfirmClose : IGenericVoidHandler = () => dispatch(closeConfirm());

  useEffect(() => {
    batch(() => {
      dispatch(getAllPostsThunk());
      dispatch(getAllTagsThunk({ sort: 'popular' }));
      dispatch(getUserThunk());
    });
  }, [userId, dispatch, username, nickname]);

  useEffect(() => {
    const language = navigator.language.split('-')[0];
    if (langNames.includes(language)) {
      dispatch(setLanguage(language));
    }
  }, [dispatch, langNames]);

  return (
    <IntlProvider locale={currentLang} messages={vocabularies[currentLang]}>
      <ThemeProvider theme={
        themes[currentTheme ?? defaultTheme]
        ?? basicThemes[currentTheme ?? defaultTheme]
      }>
        <Header />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Register />} />
          <Route path='/editArticle' element={<Editor />} />
          <Route path='/editArticle/:slug' element={<Editor />} />
          <Route path='/profile/:username' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/article/:slug' element={<ArticlePage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
        {isDeleteConfirmOpen && <Modal onClose={onConfirmClose} onSubmit={onConfirmDelete} />}
      </ThemeProvider>
    </IntlProvider>
  );
};

export default App;
