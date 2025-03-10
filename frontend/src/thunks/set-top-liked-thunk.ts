import { AppThunk } from '../store/store.types';

import { setTopFeed } from '../store';

import { getAll } from '../services/api/articles';

const setTopLikedThunk: AppThunk = (qty = 5) => async (dispatch) => {
  try {
    const articles = await getAll({ limit: qty as number, sort: 'popular' });

    dispatch(setTopFeed(articles));
  } catch (error) {
    console.log(error);
  }
};

export default setTopLikedThunk;
