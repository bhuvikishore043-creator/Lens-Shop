import { getStorageData, setStorageData } from './storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const reviewService = {
  async getReviews() {
    const reviews = getStorageData(LOCAL_STORAGE_KEYS.REVIEWS) || [];
    return Promise.resolve(reviews);
  },

  async getReviewsByProduct(productId) {
    const reviews = await this.getReviews();
    return reviews.filter(r => r.productId === productId);
  },

  async submitReview(reviewData) {
    const reviews = await this.getReviews();
    const newReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      isVerifiedBuyer: true,
      userPhotos: [],
      ...reviewData
    };
    reviews.unshift(newReview);
    setStorageData(LOCAL_STORAGE_KEYS.REVIEWS, reviews);
    return Promise.resolve(newReview);
  },

  async voteHelpful(reviewId) {
    const reviews = await this.getReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      review.helpfulCount += 1;
      setStorageData(LOCAL_STORAGE_KEYS.REVIEWS, reviews);
    }
    return Promise.resolve(review);
  }
};
