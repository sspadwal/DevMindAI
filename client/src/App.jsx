import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { 
  Home, 
  GenerateImages, 
  BlogTitles, 
  Community, 
  RemoveBackground, 
  WriteArticle, 
  ReviewResume, 
  Dashboard,
  Layout,
  RemoveObject
} from './pages';
import { useAuth } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const location = useLocation();

  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      e.preventDefault();
      const id = target.getAttribute('href');
      const element = document.querySelector(id);
      
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Reset scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout/>}>
          <Route index element={<Dashboard />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="community" element={<Community />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="remove-object" element={<RemoveObject />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;