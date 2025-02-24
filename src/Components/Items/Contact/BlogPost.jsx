import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/requestAPI';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const response = await api.get(`/api/Blog/Get-Blog-By-Id?id=${id}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="blog-post-container">
      <article className="blog-post-content">
        <h1 className="blog-post-title">{post.title}</h1>
        
        <div className="blog-post-meta">
          <span className="post-date">
            {new Date(post.createDate).toLocaleDateString()}
          </span>
          <span className="post-author">{post.author}</span>
        </div>

        <div className="blog-post-image">
          <img src={post.imageUrl} alt={post.title} />
        </div>

        <div className="blog-post-body" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
};

export default BlogPost; 