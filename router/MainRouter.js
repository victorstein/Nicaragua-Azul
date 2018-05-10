import { StackNavigator } from 'react-navigation';
import Welcome from '../views/Welcome';
import Main from '../views/Main';
import QRScanner from '../views/QRScanner';
import CalendarView from '../views/Calendar';
import Sponsors from '../views/Sponsors';
import MyProfile from '../views/MyProfile';
import Wiki from '../views/wiki/Wiki';
import Ambassadors from '../views/Ambassadors';
import MyTreasures from '../views/MyTreasures';
import Introduccion from '../views/wiki/Introduccion';
import Pacifico from '../views/wiki/Pacifico';
import AguaDulce from '../views/wiki/AguaDulce';
import Caribe from '../views/wiki/Caribe';
import Reflexion from '../views/wiki/Reflexion';
import RenderView from '../views/RenderView';
import RenderBioView from '../views/RenderBioView';

const WikiRouter = StackNavigator(
  {
    WikiMain: {
      screen: Wiki
    },
    Introduccion: {
      screen: Introduccion
    },
    Pacifico: {
      screen: Pacifico
    },
    AguaDulce: {
      screen: AguaDulce
    },
    Caribe: {
      screen: Caribe
    },
    Reflexion: {
      screen: Reflexion
    },
    RenderBioView: {
      screen: RenderBioView
    },
    RenderView: {
      screen: RenderView
    },
    Main: {
      screen: Main,
    },
  },
  {
    headerMode: 'none'
  }
)

const MainRouter = StackNavigator(
  {
    Main: {
      screen: Main,
    },
    QRScanner: {
      screen: QRScanner,
    },
    Calendar: {
      screen: CalendarView
    },
    Sponsors: {
      screen: Sponsors
    },
    MyProfile: {
      screen: MyProfile
    },
    Wiki: {
      screen: WikiRouter
    },
    Ambassadors: {
      screen: Ambassadors
    },
    MyTreasures: {
      screen: MyTreasures
    },
    RenderView: {
      screen: RenderView
    }
  }
);

export const MainRouterFirstUSe = StackNavigator(
  {
    Welcome: {
      screen: Welcome,
    },
    Main: {
      screen: MainRouter,
    },
    QRScanner: {
      screen: QRScanner,
    },
  },
  {
    headerMode : 'none'
  }
);

export const MainRouterAlreadyUsed = StackNavigator(
  {
    Main: {
      screen: MainRouter,
    }
  },
  {
    headerMode : 'none'
  }
);
