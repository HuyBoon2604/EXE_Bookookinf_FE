import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Paper,
  Container,
  CircularProgress
} from '@mui/material';
import api from '../../Components/utils/requestAPI';
import { toast } from 'react-toastify';

const ReviewPage = () => {
  const { orderId, studioId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [existingReview, setExistingReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        const response = await api.get(`/get-review?orderId=${orderId}&studioId=${studioId}`);
        if (response.data) {
          setExistingReview(response.data);
          setRating(response.data.rating);
          setComment(response.data.comment);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingReview();
  }, [orderId, studioId]);

  const handleSubmitReview = async () => {
    try {
      if (rating === 0) {
        toast.warning('Vui lòng chọn số sao đánh giá!');
        return;
      }
      
      const endpoint = existingReview ? '/update-review' : '/submit-review';
      const method = existingReview ? 'put' : 'post';
      
      await api[method](endpoint, {
        orderId,
        studioId,
        rating,
        comment
      });

      toast.success(existingReview ? 
        'Đánh giá đã được cập nhật thành công!' : 
        'Đánh giá của bạn đã được gửi thành công!'
      );
      navigate(-1);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#5e35b1' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)',
          border: '1px solid #e0d8ff'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            color: '#5e35b1',
            textAlign: 'center',
            fontWeight: 600,
            mb: 4,
            textShadow: '2px 2px 4px rgba(94, 53, 177, 0.1)'
          }}
        >
          {existingReview ? 'Chỉnh Sửa Đánh Giá' : 'Đánh Giá Dịch Vụ'}
        </Typography>
        
        <Box 
          sx={{ 
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography 
            component="legend"
            sx={{
              color: '#7c4dff',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          >
            Bạn cảm thấy dịch vụ của chúng tôi thế nào?
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#7c4dff',
              },
              '& .MuiRating-iconHover': {
                color: '#5e35b1',
              },
              transform: 'scale(1.2)',
              mb: 2
            }}
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Nhận xét của bạn"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#7c4dff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#5e35b1',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#5e35b1',
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: '#9575cd',
              '&:hover': {
                bgcolor: '#7e57c2',
              },
              px: 4
            }}
          >
            Hủy
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitReview}
            sx={{
              bgcolor: '#5e35b1',
              '&:hover': {
                bgcolor: '#4527a0',
              },
              px: 4
            }}
          >
            {existingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReviewPage; 