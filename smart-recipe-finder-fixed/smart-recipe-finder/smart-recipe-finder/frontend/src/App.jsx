import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import SubstitutionsPage from './pages/SubstitutionsPage';

export default function App() {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<RecipeForm />} />
          <Route path="/edit-recipe/:id" element={<RecipeForm />} />
          <Route path="/substitutions" element={<SubstitutionsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </RecipeProvider>
  );
}
