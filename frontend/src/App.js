// import logo from './logo.svg';
import './App.css';
import UserSignUp from './components/User/UserSignUp.js';
import { Routes, Route } from "react-router-dom";
import UserSignIn from './components/User/UserSignIn.js';
import Home from './components/User/Home.js';
import Header from './components/User/Header.js';
import CreateSurveys from './components/User/CreateSurveys.js';
import QuestionsPage from './components/User/QuestionsPage.js';
import ViwSurveys from './components/User/ViewSurveys.js';
import AboutUs from './components/User/AboutUs.js';
import Footer from './components/User/Footer.js';
import UserProfile from './components/User/UserProfile.js';
import ViewParticularSurvey from './components/User/ViewParticularSurvey.js';
import AttendSurvey from './components/User/AttendSurvey.js';
import ApiUrl from './components/User/ApiUrl.js';
import SurveyPreview from './components/User/SurveyPreview.js';
import BarChart from './components/User/BarChart.js';
import ViewAttendedSurvey from './components/User/ViewAttendedSurvey.js';
function App() {
  return <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/barChart' element={<BarChart />} />
      <Route path='/userSignUp' element={<UserSignUp />} />
      <Route path='/userSignIn' element={<UserSignIn />} />
      <Route path='/userProfile' element={<UserProfile />} />
      <Route path='/createSurvey' element={<CreateSurveys />} />
      <Route path='/questionsPage' element={<QuestionsPage />} />
      <Route path='/surveyPreview' element={<SurveyPreview />} />
      <Route path='/viewSurveys' element={<ViwSurveys />} />
      <Route path='/attendSurvey' element={<AttendSurvey />} />
      <Route path='/ViewAttendedSurvey' element={<ViewAttendedSurvey />} />
      <Route path='/ViewParticularSurvey' element={<ViewParticularSurvey />} />
      <Route path='/aboutUs' element={<AboutUs />} />
      <Route path='/footer' element={<Footer />} />

    </Routes>
  </>
}

export default App;
