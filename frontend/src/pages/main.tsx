import {
  FC,
  useEffect,
} from 'react';
import { useIntl } from 'react-intl';
import { batch } from 'react-redux';
import styled from 'styled-components';
import { desktopBreakpoint, mobileViewThreshold, tabletBreakpoint } from '../constants';
import { useDispatch, useSelector } from '../services/hooks';
import {
  getPublicFeedThunk,
  setNewPostsThunk,
  setTopLikedThunk,
} from '../thunks';
import { FeedRibbon, Slider } from '../widgets';
import TopAnnounceWidget from '../widgets/top-announce-widget';

const desktopToTabletGapStep = (80 - 40) / (desktopBreakpoint - tabletBreakpoint);
const tabletToMobileGapStep = (40 - 20) / (tabletBreakpoint - mobileViewThreshold);
const tabletToMobileMainWidthStop = (720 - 595) / (tabletBreakpoint - mobileViewThreshold);
const desktopToTabletAsideWidthStep = (359 - 227) / (desktopBreakpoint - tabletBreakpoint);

const MainSection = styled.main`
display: flex;
justify-content: center;
margin: 0;

`;
const MainContainer = styled.div`
 display: flex;
    margin: 56px 0 0 0;
    gap: 0 calc(80px - ${desktopToTabletGapStep} * (${desktopBreakpoint}px - 100vw));
    justify-content: center;
    align-items: flex-start;
    max-width:1140px;
    position: relative;
    z-index: 10;
    width: 100%;

    @media screen and (max-width:${tabletBreakpoint}px) {
      padding: 0 24px;
      gap: 0 calc(40px - ${tabletToMobileGapStep} * (${tabletBreakpoint}px - 100vw)) ;
      width: calc(720px - ${tabletToMobileMainWidthStop} * (${tabletBreakpoint}px - 100vw));
  }
  @media screen and (max-width: 765px) {
    flex-direction: column-reverse;
    gap: 0;
    max-width: 400px;
  }
  @media screen and (min-width: ${desktopBreakpoint}px) {
    gap: 40px;
  }


  @media screen and (max-width: ${mobileViewThreshold}px) {
    padding:0 20px;
    width: 280px;
  }
`;
const LeftColumn = styled.div`
overflow: hidden;
flex-grow:2;
`;

const RightColumn = styled.aside`
    display: flex;
    overflow: hidden;
    align-self: flex-start;
    flex-direction: column;
    max-width: 360px;
    flex-grow:1;
    @media screen and (max-width:1600px) {
      width: calc(359px - ${desktopToTabletAsideWidthStep} * (${desktopBreakpoint}px - 100vw));
    }
  @media screen and (max-width:768px) {

    align-items: center;
    justify-content: center;
    @media screen and (max-width: 765px) {
      width: 100%;
    }
  }
`;
const Main: FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const articles = useSelector((state) => state.view.feed);
  useEffect(() => {
    batch(() => {
      dispatch(getPublicFeedThunk());
      dispatch(setNewPostsThunk());
    });
  }, [dispatch]);

  useEffect(() => {
    if (articles && articles.length > 0) {
      dispatch(setTopLikedThunk());
    }
  }, [dispatch, articles]);
  return (
    <MainSection>
      <MainContainer>
        <LeftColumn>
          <FeedRibbon />
        </LeftColumn>
        <RightColumn>
          <TopAnnounceWidget caption={intl.messages.popularContent as string} />
          <Slider />
        </RightColumn>
      </MainContainer>
    </MainSection>
  );
};
export default Main;
