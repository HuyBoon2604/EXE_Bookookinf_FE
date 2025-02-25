import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css"
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import api from "../../utils/requestAPI";

const Contact = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await api.get("/api/Blog/Get-All-Blog");
      const posts = Array.isArray(response.data) ? response.data : response.data?.$values || [];
      setBlogPosts(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/contact/${postId}`);
  };

  // Hàm chuyển đổi Facebook URL thành blog post ID
  const getFbPostId = (fbUrl) => {
    // Thêm logic để trích xuất ID từ URL Facebook
    const urlParts = fbUrl.split('/');
    return urlParts[urlParts.length - 1];
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">Blog Của Chúng Tôi</h1>
      
      <div className="blog-posts">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            className="blog-post"
            onClick={() => handlePostClick(post.id)}
          >
            <div className="post-image">
              <img src={post.imageUrl || "https://i.imgur.com/pRy9nMo.png"} alt={post.title} />
            </div>
            
            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-meta">
                <span className="post-date">
                  {new Date(post.createDate).toLocaleDateString()}
                                  </span>
                <span className="post-author">{post.author}</span>
              </div>
              <p className="post-excerpt">{post.description}</p>
              
              <div className="post-footer">
                <div className="social-links">
                  <a 
                    href={post.facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const postId = getFbPostId(post.facebookUrl);
                      if (postId) handlePostClick(postId);
                    }}
                  >
                    <FaFacebook style={{ color: "#1877F2", fontSize: "24px" }} />
                  </a>
                  <a 
                    href={post.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram style={{ color: "#E4405F", fontSize: "24px" }} />
                  </a>
                </div>
                <button className="read-more">Đọc thêm</button>
              </div>
            </div>
          </article>
        ))}
</div>
</div>
  );
};

export default Contact;