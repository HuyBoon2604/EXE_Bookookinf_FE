import { useState, useEffect } from "react";
import "./Contact.css";
import { FaTimes } from "react-icons/fa";
import api from "../../utils/requestAPI";

const Contact = () => {
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Top Những Dancer Đỉnh Nhất Tại Việt Nam: Tài Năng Bùng Nổ, Chinh Phục Mọi Sân Khấu!",
      fbUrl: "https://www.facebook.com/Colordanhub/posts/122110684058729479?ref=embed_post",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 2,
      title: "Bắt đầu hành trình nhảy múa của bạn ngay hôm nay ! Với những mẹo nhỏ này, bạn sẽ tự tin thể hiện mình trên sàn nhảy.",
     
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 3,
      title: "NHẢY GIÚP BẠN THÔNG MINH HƠN – SỰ THẬT HAY CHỈ LÀ LỜI ĐỒN? 💃🕺",
      
      
      
      fbUrl: "https://www.facebook.com/photo.php?fbid=122110321286729479&set=a.122106401876729479&type=3&ref=embed_post",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 4,
      title: "SLAY STUDIO1",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid0nfsBxrXEDCSTq3dGEGjrrkQNwY44N4EmJd9TD4FtQe375Ui4oB2g7MouUq4JX1Tvl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 6,
      title: "Lalaland Studio",
     
      
      
      fbUrl: "https://www.facebook.com/photo.php?fbid=122109826742729479&set=a.122106111542729479&type=3&ref=embed_post",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 7,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/photo.php?fbid=122109663080729479&set=a.122106111542729479&type=3&ref=embed_post",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 8,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 9,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 10,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 11,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 12,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 13,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 14,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 15,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    },
    {
      id: 16,
      title: "Lalaland Studio",
      
      
      
      fbUrl: "https://www.facebook.com/Colordanhub/posts/pfbid02mPGrbyVtrshAnHWzqH2GBTpcW2CVzgdMTeSAPJ4o36P2fV5GQTS544fX5bNVa8CDl",
      imageUrl: "https://i.imgur.com/pRy9nMo.png"
    }
  ]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) return;
      
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
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
          <h1>Danh Sách Bài Viết </h1>
          <p>Khám phá những không gian tập luyện chất lượng tại Colordanhub</p>
        </div>

        <div className="blog-content">
          <div className="postsgrid">
            {blogPosts.map((post) => (
              <div key={post.id} className="post-wrapper">
                <article className="studio-card" onClick={() => handlePostClick(post)}>
                  <div className="studio-image">
                    <img src={post.imageUrl} alt={post.title} />
                    
                  </div>
                  <div className="studio-content">
                    <h2>{post.title}</h2>
                    <p className="studio-address">{post.address}</p>
                    <div className="studio-rating">
                      <span className="stars">★</span>
                      <span>{post.rating}</span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
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