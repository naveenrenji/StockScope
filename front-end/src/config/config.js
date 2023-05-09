// Bootstrap Icons
import {
  Newspaper, FileBarGraph, PersonCircle,
  Apple, Microsoft, CurrencyDollar, Grid1x2, Chat, PersonVcardFill
} from 'react-bootstrap-icons';

// Recent Card Imports
import img1 from "../assets/imgs/img1.png";
import img2 from "../assets/imgs/img2.png";
import img3 from "../assets/imgs/img3.png";

// Sidebar Data
export const SidebarData = [
  {
    icon: <Grid1x2 />,
    heading: "Dashboard",
    link: "/"
  },
  {
    icon: <Newspaper />,
    heading: "Market News",
    link: "/market-news"
  },
  {
    icon: <FileBarGraph />,
    heading: 'Portfolio',
    link: "/portfolio"
  },
  // {
  //   icon: <PersonVcardFill />,
  //   heading: 'View Account',
  //   link: "/profile"
  // }
];

//StocksScope Navbar Data
export const StockScopeNavbarData = [
  { heading: "Summary", link: "/stock/summary/:symbol" },
  { heading: "News", link: "/stock/news/:symbol" },
  { heading: "Historical Data", link: "/stock/historicaldata/:symbol" }
];
// Analytics Cards Data
export const cardsData = [
  {
    title: "Apple Inc.",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "128.47",
    png: Apple,
    series: [
      {
        name: "AAPL",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Tesla, Inc.",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "716.56",
    png: CurrencyDollar,
    series: [
      {
        name: "TSLA",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Microsoft",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "246.47",
    png: Microsoft,
    series: [
      {
        name: "MSFT",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// Recent Update Card Data
export const UpdatesData = [
  {
    img: img1,
    name: "John Doe",
    noti: "announces partnership with Tesla for new electric vehicle project",
    time: "10 seconds ago",
  },
  {
    img: img2,
    name: "Jane Smith",
    noti: "wins court case against ExxonMobil for environmental damages",
    time: "1 hour ago",
  },
  {
    img: img3,
    name: "Bob Johnson",
    noti: "acquires 10% stake in Amazon, stock price surges",
    time: "2 hours ago",
  },
];
