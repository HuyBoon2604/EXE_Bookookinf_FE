import { useState, useEffect } from "react";
import "./Contact.css";
import { FaTimes } from "react-icons/fa";

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbwGO9k2y8Fa1fPc4_LrUOL-TX7j5mGVHy0YZWqzMlBx2bmS5Vem4RhEtbJ6uBFXBYIQ/exec";

const Contact = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(GOOGLE_SHEET_API);
        const data = await response.json();
        
        // Log để kiểm tra dữ liệu nhận được
        console.log("Raw data from API:", data);
        
        // Đảm bảo data là một mảng và có dữ liệu
        if (Array.isArray(data) && data.length > 0) {
          const formattedPosts = data.map((row, index) => {
            // Log từng row để debug
            console.log("Processing row:", row);
            
            // Kiểm tra và lấy giá trị từ row
            const title = row["TIÊU ĐỀ"] || row["tiêu đề"] || row["Tieu de"] || "Không có tiêu đề";
            // Thử nhiều cách khác nhau để lấy link Facebook
            const fbUrl = row["Link BÀI"] || 
                         row["link bài"] || 
                         row["Link bai"] || 
                         row["LINK BÀI"] || 
                         row["LINK BAI"] || 
                         row["Link Facebook"] || 
                         row["link facebook"] || 
                         row["LINK FACEBOOK"] || 
                         row["Facebook Link"] || 
                         row["facebook link"] || 
                         row["FACEBOOK LINK"] || "";
            const imageUrl = row["HÌNH ẢNH"] || row["hình ảnh"] || row["Hinh anh"] || "https://i.imgur.com/pRy9nMo.png";

            // Log các giá trị đã trích xuất
            console.log("Extracted values:", { title, fbUrl, imageUrl });

            return {
              id: index + 1,
              title,
              fbUrl,
              imageUrl
            };
          });

          // Log để kiểm tra dữ liệu đã format
          console.log("Formatted posts:", formattedPosts);
          
          // Lọc bỏ các bài viết không có link Facebook
          const validPosts = formattedPosts.filter(post => {
            console.log("Checking post:", post);
            return post.fbUrl && post.fbUrl.trim() !== "";
          });
          
          // Log số lượng bài viết hợp lệ
          console.log("Valid posts count:", validPosts.length);
          console.log("Valid posts:", validPosts);
          
          setBlogPosts(validPosts);
        } else {
          console.error("Dữ liệu trống hoặc không đúng định dạng");
          setBlogPosts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ Google Sheets: ", error);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) return;
      
      window.fbAsyncInit = function() {
        window.FB.init({ 
          xfbml: true, 
          version: 'v18.0',
          cookie: true
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/vi_VN/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    loadFacebookSDK();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    
    // Đợi một chút để đảm bảo modal đã render
    setTimeout(() => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    }, 500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div id="Contact">
      <div className="blog-container">
        <div className="blog-header">
          <h1>Danh Sách Bài Viết</h1>
          <p>Khám phá những không gian tập luyện chất lượng tại Colordanhub</p>
        </div>

        <div className="blog-content">
          {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : blogPosts.length === 0 ? (
            <div className="no-data">Không có bài viết nào</div>
          ) : (
            <div className="postsgrid">
              {blogPosts.map((post) => (
                <div key={post.id} className="post-wrapper">
                  <article className="studio-card" onClick={() => handlePostClick(post)}>
                    <div className="studio-image">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://i.imgur.com/pRy9nMo.png";
                        }}
                      />
                    </div>
                    <div className="studio-content">
                      <h2>{post.title}</h2>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && selectedPost && (
          <div className="lightbox-overlay" onClick={handleCloseModal}>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <button className="lightbox-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
              <div className="fb-post" 
                   data-href={selectedPost.fbUrl}
                   data-width="800"
                   data-show-text="true">
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
